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
    moment(nextEpisodeForDisplay.airDate).diff(lastEpisodeForDisplay.airDate, 'days') < 45;
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

export const getTimeFromLastEpisode = (lastEpisodeDate: string) => {
  if (!lastEpisodeDate) {
    return;
  }
  let diff = moment(lastEpisodeDate).startOf('day').from(moment().startOf('day'));

  if (diff === 'a few seconds ago') {
    diff = 'today';
  } else if (diff === 'a day ago') {
    diff = 'yesterday';
  }

  return diff;
};

export const getTimeUntilNextEpisode = (nextAirDate: string) => {
  if (!nextAirDate) {
    return;
  }
  let diff = moment(nextAirDate).startOf('day').from(moment().startOf('day'));

  if (diff === 'a few seconds ago') {
    diff = 'today';
  } else if (diff === 'in a day') {
    diff = 'tomorrow';
  }

  return diff;
};

export const getVideoTrailerKey = ({ results }: { results: any[] }): string | undefined => {
  const matchingVideo = results
    ?.filter(video => video.site === 'YouTube')
    ?.find(video => {
      if (video.name === 'Official Trailer') {
        return video;
      } else if (video.name.includes('Trailer')) {
        return video;
      }
    });
  return matchingVideo?.key || results[0]?.key || undefined;
};
