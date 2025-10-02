export const getMessageFromError = (error: any) => {
  let title = 'Error';
  let message = 'Something went wrong';

  if (error && typeof error === 'object' && 'status' in error) {
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
  }

  return { title, message };
};
