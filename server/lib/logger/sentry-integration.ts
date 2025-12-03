import { logger } from "@/server/lib/logger";
import { Sentry } from "@/server/lib/sentry";

export const pinoSentryIntegration = () => {
  Sentry.pinoIntegration.trackLogger(logger);

  return Sentry.pinoIntegration({
    log: { levels: ["info", "warn", "error"] },
    error: { levels: ["warn", "error"] },
  });
};
