import * as Sentry from '@sentry/react';

import { getIsProduction } from './env';

const sendToSentry = (error: object & Record<'status', unknown>) => {
  const status = error.status;

  if (
    'error' in error &&
    typeof error.error === 'string' &&
    (error.error.includes('Timeout') || error.error.includes('timed out'))
  ) {
    return;
  }

  const shouldSend =
    getIsProduction() &&
    (status === 'FETCH_ERROR' ||
      status === 'PARSING_ERROR' ||
      (typeof status === 'number' && status >= 500));
  if (shouldSend) {
    Sentry.captureException(error, {
      extra: { rawError: error },
    });
  }
};

/** For RTK Query errors.
 * Sends the error to Sentry if it's a production error.
 *
 * @param error - The error to get the message from.
 * @returns A title and message for the error.
 */
export const getMessageFromError = (error: unknown) => {
  let title = 'Error';
  let message = 'Something went wrong';

  if (!error || typeof error !== 'object' || !('status' in error)) {
    return { title, message };
  }

  sendToSentry(error);

  if ('data' in error && error.data) {
    message =
      typeof error.data === 'string'
        ? error.data
        : (error.data as any).message || message;
  } else if (error.status === 'FETCH_ERROR') {
    title = 'Network Error';
    message = 'Unable to connect to the server';
  } else if (error.status === 401) {
    title = 'Unauthorized';
    message = 'Please log in to continue';
  } else if (error.status === 403) {
    title = 'Forbidden';
    message = 'You do not have permission to perform this action';
  } else if (error.status === 404) {
    title = 'Not Found';
    message = 'The requested resource was not found';
  } else if (error.status === 500) {
    title = 'Server Error';
    message = 'Internal server error occurred';
  }

  return { title, message };
};
