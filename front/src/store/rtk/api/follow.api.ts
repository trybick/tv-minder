import { authStorage } from '~/utils/auth';

import { baseApi } from './baseApi';

export const followApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getFollowedShows: builder.query<number[], void>({
      query: () => ({
        url: '/follow',
        params: { token: authStorage.getToken() },
      }),
    }),

    followShow: builder.mutation<{ showId: number }, number>({
      query: showId => ({
        url: '/follow',
        method: 'POST',
        body: {
          showId,
          token: authStorage.getToken(),
        },
      }),
      async onQueryStarted(showId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          followApi.util.updateQueryData(
            'getFollowedShows',
            undefined,
            draft => {
              if (!draft.includes(showId)) {
                draft.push(showId);
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    unfollowShow: builder.mutation<{ showId: number }, number>({
      query: showId => ({
        url: '/follow',
        method: 'DELETE',
        body: {
          showId,
          token: authStorage.getToken(),
        },
      }),
      async onQueryStarted(showId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          followApi.util.updateQueryData(
            'getFollowedShows',
            undefined,
            draft => {
              const index = draft.findIndex(id => id === showId);
              if (index !== -1) {
                draft.splice(index, 1);
              }
            }
          )
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

export const {
  useGetFollowedShowsQuery,
  useLazyGetFollowedShowsQuery,
  useFollowShowMutation,
  useUnfollowShowMutation,
} = followApi;
