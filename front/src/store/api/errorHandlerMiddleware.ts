import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';

import { toaster } from '~/components/ui/toaster';
import { userApi } from '~/store/user/user.api';

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

    let title = 'Error';
    let description = 'Something went wrong';

    if (error && typeof error === 'object' && 'status' in error) {
      if ('data' in error && error.data) {
        description =
          typeof error.data === 'string'
            ? error.data
            : (error.data as any).message || description;
      } else if (error.status === 'FETCH_ERROR') {
        title = 'Network Error';
        description = 'Unable to connect to the server';
      } else if (error.status === 401) {
        title = 'Unauthorized';
        description = 'Please log in to continue';
      } else if (error.status === 403) {
        title = 'Forbidden';
        description = 'You do not have permission to perform this action';
      } else if (error.status === 404) {
        title = 'Not Found';
        description = 'The requested resource was not found';
      } else if (error.status === 500) {
        title = 'Server Error';
        description = 'Internal server error occurred';
      }
    }

    toaster.create({
      title,
      description,
      type: 'error',
      duration: 5000,
      meta: { closable: true },
    });

    console.error('RTK Query Error:', action);
  },
});
