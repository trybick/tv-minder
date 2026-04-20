import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { ENDPOINTS } from '~/app/endpoints';
import type { RootState } from '~/store';

const USE_API_V2 = false;

const baseUrl = USE_API_V2
  ? ENDPOINTS.TV_MINDER_SERVER_V2
  : `${ENDPOINTS.TV_MINDER_SERVER}/api`;

export type ApiDataResponse<T> = {
  data: T;
};

export type ApiErrorResponse = {
  error?: {
    message?: string;
  };
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).user.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithUnwrap: typeof rawBaseQuery = async (
  args,
  api,
  extraOptions
) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.data !== undefined) {
    const envelope = result.data as ApiDataResponse<unknown>;
    result.data = envelope?.data ?? result.data;
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithUnwrap,
  endpoints: () => ({}),
});
