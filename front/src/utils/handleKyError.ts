import * as Sentry from '@sentry/react';
import { HTTPError, isNetworkError } from 'ky';

import { getIsProduction } from '~/utils/env';

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
export function handleKyError(error: unknown) {
  if (error instanceof HTTPError) {
    const { status } = error.response;
    const url = error.request.url;
    const shouldReportToSentry = status >= 500 || status === 429;
    const responseBody = error.data;

    console.error('HTTP error:', status, url, responseBody);
    if (shouldReportToSentry) {
      sendToSentry(error, { status, url, responseBody });
    }
  } else if (error instanceof Error) {
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      return;
    }

    if (isNetworkError(error) || error instanceof TypeError) {
      console.error('network_failure error:', error.message);
      return;
    }

    console.error('unknown error:', error.message);

    sendToSentry(error, {
      type: 'unknown',
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
