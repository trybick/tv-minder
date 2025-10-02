import { baseApi } from '~/store/api/baseApi';

type ContactRequest = {
  text: string;
  email: string;
};

export const contactApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    submitFeedback: builder.mutation<void, ContactRequest>({
      query: body => ({
        url: '/contact',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useSubmitFeedbackMutation } = contactApi;
