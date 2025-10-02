import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';

import { showToast } from '~/components/ui/toaster';
import { userApi } from '~/store/user/user.api';
import { getMessageFromError } from '~/utils/getMessageFromError';

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
