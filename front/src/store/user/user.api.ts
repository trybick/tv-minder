import { baseApi, cacheTags } from '~/store/api/baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getFollowedShows: builder.query<{ followedShows: number[] }, void>({
      query: () => ({
        url: '/follow',
        params: { token: localStorage.getItem('jwt') },
      }),
      providesTags: [cacheTags.followedShows],
    }),

    followShow: builder.mutation<
      { showId: number; isRegistered: boolean },
      number
    >({
      query: showId => ({
        url: '/follow',
        method: 'POST',
        body: {
          showId,
          token: localStorage.getItem('jwt'),
        },
      }),
      invalidatesTags: [cacheTags.followedShows],
      async onQueryStarted(showId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userApi.util.updateQueryData('getFollowedShows', undefined, draft => {
            if (!draft.followedShows.includes(showId)) {
              draft.followedShows.push(showId);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    unfollowShow: builder.mutation<
      { showId: number; isRegistered: boolean },
      number
    >({
      query: showId => ({
        url: '/follow',
        method: 'DELETE',
        body: {
          showId,
          token: localStorage.getItem('jwt'),
        },
      }),
      invalidatesTags: [cacheTags.followedShows],
      async onQueryStarted(showId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userApi.util.updateQueryData('getFollowedShows', undefined, draft => {
            draft.followedShows = draft.followedShows.filter(
              id => id !== showId
            );
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

export const {
  useGetFollowedShowsQuery,
  useFollowShowMutation,
  useUnfollowShowMutation,
} = userApi;
