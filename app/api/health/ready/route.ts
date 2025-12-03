import { NextResponse } from "next/server";

import { client as dbClient } from "@/server/lib/db";
import { logger } from "@/server/lib/logger";
import { Sentry } from "@/server/lib/sentry";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type CheckState = "UP" | "DEGRADED" | "DOWN";

type ComponentCheckResult = {
  status: CheckState;
  latencyMs: number;
  error?: string;
  detail?: Array<{ name: string; healthy: boolean }>;
};

type HealthResponse = {
  status: CheckState;
  timestamp: string;
  uptimeSeconds: number;
  durationMs: number;
  metadata: Record<string, string>;
  checks: Record<string, ComponentCheckResult>;
};

const DEFAULT_TIMEOUT_MS = Number(process.env.HEALTHCHECK_TIMEOUT_MS ?? "2500");
const RESPONSE_HEADERS: HeadersInit = {
  "Cache-Control": "no-store, max-age=0, must-revalidate",
};

const CHECKS: Record<string, () => Promise<ComponentCheckResult>> = {
  database: checkDatabase,
  apm: checkSentry,
};

export async function GET() {
  const health = await gatherHealth();
  return NextResponse.json(health.body, {
    status: health.statusCode,
    headers: RESPONSE_HEADERS,
  });
}

export async function HEAD() {
  const health = await gatherHealth();
  return new Response(null, {
    status: health.statusCode,
    headers: RESPONSE_HEADERS,
  });
}

async function gatherHealth(): Promise<{
  body: HealthResponse;
  statusCode: number;
}> {
  const startedAt = Date.now();
  const checks = await runChecks();
  const overallStatus = deriveOverallStatus(checks);

  const body: HealthResponse = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    durationMs: Date.now() - startedAt,
    metadata: buildMetadata(),
    checks,
  };

  return {
    body,
    statusCode: overallStatus === "DOWN" ? 503 : 200,
  };
}

async function runChecks(): Promise<Record<string, ComponentCheckResult>> {
  const entries = await Promise.all(
    Object.entries(CHECKS).map(async ([name, fn]) => {
      try {
        return [name, await fn()];
      } catch (error) {
        logger.error(error, "Error during check for component %s", name);
        return [name, { status: "DOWN", latencyMs: 0, error: "Unknown error" }];
      }
    })
  );

  return Object.fromEntries(entries) as Record<string, ComponentCheckResult>;
}

function deriveOverallStatus(
  checks: Record<string, ComponentCheckResult>
): CheckState {
  const statuses = Object.values(checks).map((check) => check.status);
  if (statuses.includes("DOWN")) {
    return "DOWN";
  }
  if (statuses.includes("DEGRADED")) {
    return "DEGRADED";
  }
  return "UP";
}

function buildMetadata(): Record<string, string> {
  const metadata: Record<string, string> = {};
  const environment = process.env.NODE_ENV;
  const region = process.env.REGION;
  const sha = process.env.SHA;

  if (environment) metadata.environment = environment;
  if (region) metadata.region = region;
  if (sha) metadata.sha = sha;

  return metadata;
}

async function checkDatabase(): Promise<ComponentCheckResult> {
  const startedAt = Date.now();

  try {
    await withTimeout(dbClient`select 1`, DEFAULT_TIMEOUT_MS, "postgres ping");
    return {
      status: "UP",
      latencyMs: Date.now() - startedAt,
    };
  } catch (error) {
    logger.error(error, "Error during database connectivity check");
    return {
      status: "DOWN",
      latencyMs: Date.now() - startedAt,
      error: "Database connectivity error",
    };
  }
}

async function checkSentry(): Promise<ComponentCheckResult> {
  const startedAt = Date.now();

  try {
    const diagnosis = await withTimeout(
      diagnoseSentryConnectivity(),
      DEFAULT_TIMEOUT_MS,
      "sentry connectivity"
    );

    if (!diagnosis) {
      return {
        status: "UP",
        latencyMs: Date.now() - startedAt,
      };
    }

    return {
      status: "DEGRADED",
      latencyMs: Date.now() - startedAt,
      error: diagnosis,
    };
  } catch (error) {
    logger.error(error, "Error during Sentry connectivity check");
    return {
      status: "DEGRADED",
      latencyMs: Date.now() - startedAt,
      error: "Error during APM connectivity check",
    };
  }
}

async function diagnoseSentryConnectivity(): Promise<
  "no-client-active" | "no-dsn-configured" | void
> {
  const client = Sentry.getClient();

  if (!client) {
    return "no-client-active";
  }

  if (!client.getDsn()) {
    return "no-dsn-configured";
  }
}

function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  label: string
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}
