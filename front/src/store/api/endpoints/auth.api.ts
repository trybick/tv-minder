import { baseApi } from '~/store/api/baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<
      void,
      {
        email: string;
        password: string;
      }
    >({
      query: body => ({
        url: '/login',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
