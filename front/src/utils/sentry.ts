import * as Sentry from '@sentry/react';

const dsn =
  'https://a573ad66c244456eb251808c6d79d851@o367043.ingest.sentry.io/6386089';

export const initSentry = () => {
  if (import.meta.env.MODE === 'production') {
    Sentry.init({
      dsn,
      integrations: [Sentry.browserTracingIntegration()],
      tracesSampleRate: 1.0,
    });
  }
};

export const setSentryUser = (email: string | null) => {
  const user = email ? { email } : null;
  if (import.meta.env.MODE === 'production') {
    Sentry.setUser(user);
  }
};
