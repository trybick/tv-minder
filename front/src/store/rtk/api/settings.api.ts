import { baseApi } from './baseApi';

export type UserSettings = {
  showWelcomeStrip: boolean;
};

export const settingsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getSettings: builder.query<UserSettings, void>({
      query: () => '/settings',
    }),

    updateSettings: builder.mutation<void, Partial<UserSettings>>({
      query: body => ({
        url: '/settings',
        method: 'PUT',
        body,
      }),
      async onQueryStarted(patch, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          settingsApi.util.updateQueryData('getSettings', undefined, draft => {
            Object.assign(draft, patch);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;
