import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';

import { showToast } from '~/components/ui/toaster';
import { getMessageFromError } from '~/utils/getMessageFromError';

import { followApi } from './follow.api';

export const errorHandlerMiddleware = createListenerMiddleware();

/** Opt-in list of RTK Query endpoints that should show error toasts */
const endpointsWithErrorToasts = [
  followApi.endpoints.followShow.matchRejected,
  followApi.endpoints.unfollowShow.matchRejected,
  followApi.endpoints.getFollowedShows.matchRejected,
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
    const { title, message } = getMessageFromError(error);

    showToast({
      title,
      description: message,
      type: 'error',
    });

    console.error('RTK Query Error:', action);
  },
});
