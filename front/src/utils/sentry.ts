import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

const dsn = 'https://a573ad66c244456eb251808c6d79d851@o367043.ingest.sentry.io/6386089';

export const initSentry = () => {
  Sentry.init({
    dsn,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  });
};
