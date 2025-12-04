// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { pinoSentryIntegration } from '@/server/lib/logger/sentry-integration'
import { Sentry } from '@/server/lib/sentry'

Sentry.init({
  dsn: 'https://d2fe01507e86728c78e19a7f43364386@o4510472579383296.ingest.de.sentry.io/4510472580890704',

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  integrations: [pinoSentryIntegration()],
})
