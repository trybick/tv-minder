import * as Sentry from '@sentry/react';
import { HTTPError } from 'ky';

import { getIsProduction } from './env';

function sendToSentry(error: Error, context?: Record<string, unknown>) {
  if (!getIsProduction()) {
    return;
  }

  Sentry.captureException(error, {
    extra: context,
  });
}

export default function handleErrors(error: unknown) {
  if (error instanceof HTTPError) {
    const { status } = error.response;
    const url = error.request.url;

    console.error('HTTP error:', status, url);

    // Track server errors + rate limits
    if (status >= 500 || status === 429) {
      error.response
        .clone()
        .json()
        .then(responseBody => {
          sendToSentry(error, { status, url, responseBody });
        })
        .catch(() => {
          sendToSentry(error, { status, url });
        });
    }
  } else if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return;
    }
    console.error('Network error:', error.message);
    sendToSentry(error, {
      type: 'network_error',
      name: error.name,
      message: error.message,
    });
  }
}
