import { baseApi } from './baseApi';

export const contactApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    submitFeedback: builder.mutation<
      void,
      {
        text: string;
        email: string;
      }
    >({
      query: body => ({
        url: '/contact',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useSubmitFeedbackMutation } = contactApi;
