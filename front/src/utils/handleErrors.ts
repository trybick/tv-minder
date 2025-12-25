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

    let errorType: string;
    if (error.name === 'TimeoutError') {
      errorType = 'timeout';
    } else if (error instanceof TypeError) {
      errorType = 'network_failure'; // Failed to fetch, CORS, etc.
    } else {
      errorType = 'unknown';
    }

    console.error(`${errorType} error:`, error.message);

    sendToSentry(error, {
      type: errorType,
      name: error.name,
      message: error.message,
    });
  } else {
    // Non-Error thrown (string, object, etc.)
    console.error('Non-Error thrown:', error);

    if (getIsProduction()) {
      Sentry.captureException(error, {
        extra: { type: 'non_error_thrown', rawValue: String(error) },
      });
    }
  }
}
