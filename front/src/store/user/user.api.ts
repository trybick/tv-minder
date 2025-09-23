import { baseApi } from '~/store/api/baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getFollowedShows: builder.query<number[], void>({
      query: () => ({
        url: '/follow',
        params: { token: localStorage.getItem('jwt') },
      }),
      providesTags: ['followedShows'],
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
      invalidatesTags: ['followedShows'],
      async onQueryStarted(showId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userApi.util.updateQueryData('getFollowedShows', undefined, draft => {
            if (!draft.includes(showId)) {
              draft.push(showId);
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
      invalidatesTags: ['followedShows'],
      async onQueryStarted(showId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userApi.util.updateQueryData('getFollowedShows', undefined, draft => {
            const index = draft.findIndex(id => id === showId);
            if (index !== -1) {
              draft.splice(index, 1);
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
  }),
});

export const {
  useGetFollowedShowsQuery,
  useFollowShowMutation,
  useUnfollowShowMutation,
} = userApi;
