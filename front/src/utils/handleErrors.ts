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

/**
 * Handles errors and sends them to Sentry.
 * For old redux/ky calls that don't use RTK Query.
 * @param error - The error to handle.
 */
export default function handleErrors(error: unknown) {
  if (error instanceof HTTPError) {
    const { status } = error.response;
    const url = error.request.url;
    const shouldReportToSentry = status >= 500 || status === 429;

    error.response
      .clone()
      .json()
      .then(responseBody => {
        console.error('HTTP error:', status, url, responseBody);
        if (shouldReportToSentry) {
          sendToSentry(error, { status, url, responseBody });
        }
      })
      .catch(() => {
        console.error('HTTP error:', status, url);
        if (shouldReportToSentry) {
          sendToSentry(error, { status, url });
        }
      });
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

    sendToSentry(new Error(String(error)), {
      type: 'non_error_thrown',
      rawValue: String(error),
    });
  }
}
