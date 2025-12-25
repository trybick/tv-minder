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
    console.log('HTTP error:', status, error.request.url);

    if (status >= 500) {
      sendToSentry(error, { status, url: error.request.url });
    }
  } else if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return;
    }
    console.log('General error:', error.message);
    sendToSentry(error, { type: 'network_error' });
  }
}
