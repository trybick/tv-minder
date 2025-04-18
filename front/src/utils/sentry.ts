import * as Sentry from '@sentry/react';

const dsn =
  'https://a573ad66c244456eb251808c6d79d851@o367043.ingest.sentry.io/6386089';

export const initSentry = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn,
      integrations: [Sentry.browserTracingIntegration()],
      tracesSampleRate: 1.0,
    });
  }
};
