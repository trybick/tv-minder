import moment from 'moment';

type Status = 'Ended' | 'Returning' | 'New Episodes' | 'Premiering Soon';

export type StatusWithColor = {
  status: Status;
  color: string;
  sortOrder: number;
};

export const getStatusWithColor = (
  originalStatus: string,
  lastEpisodeForDisplay: { [key: string]: any },
  nextEpisodeForDisplay: { [key: string]: any }
): StatusWithColor => {
  const hasCurrentlyActiveSeason =
    lastEpisodeForDisplay &&
    nextEpisodeForDisplay &&
    moment(nextEpisodeForDisplay.airDate).diff(lastEpisodeForDisplay.airDate, 'days') < 30;
  const isPremieringSoon =
    nextEpisodeForDisplay &&
    moment(nextEpisodeForDisplay.airDate).diff(moment().startOf('day'), 'days') < 60 &&
    nextEpisodeForDisplay.episodeNumber === '01';

  if (originalStatus === 'Ended') {
    return { status: 'Ended', color: 'red', sortOrder: 4 };
  } else if (isPremieringSoon) {
    return { status: 'Premiering Soon', color: 'purple', sortOrder: 1 };
  } else if (hasCurrentlyActiveSeason) {
    return { status: 'New Episodes', color: 'green', sortOrder: 2 };
  } else {
    return { status: 'Returning', color: 'blue', sortOrder: 3 };
  }
};

export const getVideoTrailerKey = ({ results }: { results: any[] }): string => {
  const matchingVideo = results
    ?.filter(video => video.site === 'YouTube')
    ?.find(video => {
      if (video.name === 'Official Trailer') {
        return video;
      } else if (video.name.includes('Trailer')) {
        return video;
      }
    });
  return matchingVideo?.key || results[0]?.key;
};
