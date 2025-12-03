import { Sentry } from "@/server/lib/sentry";

export async function register() {
  if (process.env["NODE_ENV"] === "production") {
    if (process.env.NEXT_RUNTIME === "nodejs") {
      await import("./server/lib/sentry/sentry.server.config");
    }

    if (process.env.NEXT_RUNTIME === "edge") {
      await import("./server/lib/sentry/sentry.edge.config");
    }
  }
}

export const onRequestError = Sentry.captureRequestError;
