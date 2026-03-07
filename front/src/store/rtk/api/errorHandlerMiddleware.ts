import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';

import { showToast } from '~/components/ui/toaster';
import { handleRtkQueryError } from '~/utils/handleRtkQueryError';

import { trackApi } from './track.api';

export const errorHandlerMiddleware = createListenerMiddleware();

/** Opt-in list of RTK Query endpoints that should show error toasts */
const endpointsWithErrorToasts = [
  trackApi.endpoints.trackShow.matchRejected,
  trackApi.endpoints.untrackShow.matchRejected,
  trackApi.endpoints.getTrackedShows.matchRejected,
];

errorHandlerMiddleware.startListening({
  matcher: isAnyOf(...endpointsWithErrorToasts),
  effect: action => {
    // Ignore AbortErrors (expected during unmount, StrictMode, etc.)
    const meta = action.meta as { aborted?: boolean } | undefined;
    if (meta?.aborted) {
      return;
    }

    const error = action.payload;
    const { title, message } = handleRtkQueryError(error);

    showToast({
      title,
      description: message,
      type: 'error',
    });

    console.error('RTK Query Error:', action);
  },
});
