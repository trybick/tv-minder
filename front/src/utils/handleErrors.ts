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

export default async function handleErrors(error: unknown) {
  if (error instanceof HTTPError) {
    const { status } = error.response;
    const data = await error.response.json().catch(() => null);
    console.log('error data:', data);

    if (status >= 500) {
      sendToSentry(error, { status, data, url: error.request.url });
    }
  } else if (error instanceof Error) {
    if (error.name === 'AbortError') {
      // Request was cancelled, not an error
      return;
    }
    console.log('General error:', error.message);
    sendToSentry(error, { type: 'network_error' });
  }
}
