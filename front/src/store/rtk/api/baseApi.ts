import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { ENDPOINTS } from '~/app/endpoints';
import type { RootState } from '~/store';

export type ApiDataResponse<T> = {
  data: T;
};

export type ApiErrorResponse = {
  error?: {
    message?: string;
  };
  message?: string;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${ENDPOINTS.TV_MINDER_SERVER}/api`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
