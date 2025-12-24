import * as Sentry from '@sentry/react';
import { AxiosError } from 'axios';

import { getIsProduction } from './env';

function sendToSentry(error: AxiosError, context?: Record<string, unknown>) {
  if (!getIsProduction()) {
    return;
  }

  Sentry.captureException(error, {
    extra: {
      url: error.config?.url,
      method: error.config?.method,
      ...context,
    },
  });
}

export default function handleErrors(error: AxiosError) {
  if (error.response) {
    const { status, data } = error.response;
    console.log('error data:', data);

    if (status >= 500) {
      sendToSentry(error, { status, data });
    }
  } else if (error.request) {
    // No response received - network error, timeout, etc.
    console.log('error request:', error.request);
    sendToSentry(error, { type: 'no_response' });
  } else {
    // Error before request was sent (invalid config, interceptor threw, etc.)
    console.log('General error:', error.message);
    sendToSentry(error, { type: 'setup_error' });
  }
}
