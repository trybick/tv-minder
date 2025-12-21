import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';

import { showToast } from '~/components/ui/toaster';
import { getMessageFromError } from '~/utils/getMessageFromError';

import { userApi } from './user.api';

export const errorHandlerMiddleware = createListenerMiddleware();

/** Opt-in list of RTK Query endpoints that should show error toasts */
const endpointsWithErrorToasts = [
  userApi.endpoints.followShow.matchRejected,
  userApi.endpoints.unfollowShow.matchRejected,
];

errorHandlerMiddleware.startListening({
  matcher: isAnyOf(...endpointsWithErrorToasts),
  effect: action => {
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
