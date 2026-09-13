import { type TmdbShowWithSeasons } from '~/store/tv/types/transformed';

export const hasFetchedRichShowContent = (
  show: TmdbShowWithSeasons | undefined
) => {
  return !!show && 'showVideos' in show;
};
