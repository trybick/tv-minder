import * as Sentry from '@sentry/react';

import { getIsProduction } from '~/utils/env';

const dsn =
  'https://a573ad66c244456eb251808c6d79d851@o367043.ingest.sentry.io/6386089';

const redactUrlSecrets = (url: string) => {
  try {
    const parsed = new URL(url);
    if (parsed.searchParams.has('api_key')) {
      parsed.searchParams.set('api_key', '[filtered]');
    }
    return parsed.toString();
  } catch {
    return url;
  }
};

export const initSentry = () => {
  if (getIsProduction()) {
    Sentry.init({
      dsn,
      integrations: [Sentry.browserTracingIntegration()],
      tracesSampleRate: 1.0,
      ignoreErrors: [
        'Failed to fetch',
        'NetworkError',
        'Load failed',
        'Network request failed',
      ],
      beforeBreadcrumb(breadcrumb) {
        const url = breadcrumb.data?.url;
        if (typeof url === 'string') {
          breadcrumb.data = {
            ...breadcrumb.data,
            url: redactUrlSecrets(url),
          };
        }
        return breadcrumb;
      },
    });
  }
};

export const setSentryUser = (email: string | null) => {
  const user = email ? { email } : null;
  if (getIsProduction()) {
    Sentry.setUser(user);
  }
};
