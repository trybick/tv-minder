import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import ENDPOINTS from '~/gateway/endpoints';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: ENDPOINTS.TV_MINDER_SERVER,
    prepareHeaders: headers => {
      const token = localStorage.getItem('jwt');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
