import { baseApi } from './baseApi';

export const trackApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getTrackedShows: builder.query<number[], void>({
      query: () => '/track',
    }),

    trackShow: builder.mutation<void, number>({
      query: showId => ({
        url: '/track',
        method: 'POST',
        body: { showId },
      }),
      async onQueryStarted(showId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          trackApi.util.updateQueryData('getTrackedShows', undefined, draft => {
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

    untrackShow: builder.mutation<void, number>({
      query: showId => ({
        url: `/track/${showId}`,
        method: 'DELETE',
      }),
      async onQueryStarted(showId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          trackApi.util.updateQueryData('getTrackedShows', undefined, draft => {
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
  useGetTrackedShowsQuery,
  useLazyGetTrackedShowsQuery,
  useTrackShowMutation,
  useUntrackShowMutation,
} = trackApi;
