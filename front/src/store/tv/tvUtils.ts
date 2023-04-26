import moment from 'moment';
import {
  BasicShowInfo,
  CalendarEpisode,
  EpisodeForDisplay,
  EpisodeForSeason,
  Genre,
  SeasonWithEpisodes,
} from 'types/external';
import { addLeadingZero } from 'utils/formatting';
import { isEmpty } from 'utils/object';

type Status = 'Ended' | 'In Production' | 'Premiering Soon' | 'Active Season';

export type StatusWithColor = {
  status: Status;
  color: string;
  sortOrder: number;
};

export const getStatusWithColor = (
  originalStatus: string,
  lastEpisodeForDisplay: Record<string, any>,
  nextEpisodeForDisplay: Record<string, any>
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
    return { status: 'Premiering Soon', color: 'purple', sortOrder: 2 };
  } else if (hasCurrentlyActiveSeason) {
    return { status: 'Active Season', color: 'green', sortOrder: 1 };
  } else {
    return { status: 'In Production', color: 'blue', sortOrder: 3 };
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

export const getVideoTrailerKey = (videos: any): string | undefined => {
  if (!videos?.results.length) {
    return;
  }
  const { results } = videos;
  const matchingVideo = results
    ?.filter((video: any) => video.site === 'YouTube')
    ?.find((video: any) => {
      if (video.name === 'Official Trailer') {
        return video;
      } else if (video.name.includes('Trailer')) {
        return video;
      }
    });
  return matchingVideo?.key || results[0]?.key || undefined;
};

const formatEpisodesForSeason = (episodes: Record<string, any>[]): EpisodeForSeason[] => {
  if (isEmpty(episodes)) {
    return [];
  }
  return episodes.map<EpisodeForSeason>(episode => {
    const {
      air_date: airDate,
      episode_number: episodeNumber,
      id,
      name,
      overview,
      still_path: stillPath,
      vote_average: voteAverage,
      vote_count: voteCount,
      season_number: seasonNumber,
    } = episode || {};

    const voteAverageForDisplay = voteAverage ? voteAverage.toFixed(1) : '-';

    return {
      airDate,
      episodeNumber,
      id,
      name,
      overview,
      stillPath,
      voteAverage: voteAverageForDisplay,
      voteCount,
      seasonNumber,
    };
  });
};

const formatSeasons = (seasons: Record<number, any>): SeasonWithEpisodes[] => {
  if (isEmpty(seasons)) {
    return [];
  }
  const camelCaseSeasons: SeasonWithEpisodes[] = Object.values(seasons).map<SeasonWithEpisodes>(
    season => {
      const {
        air_date: airDate,
        episodes,
        id,
        name,
        overview,
        poster_path: posterPath,
        season_number: seasonNumber,
      } = season || {};
      let nameForDisplay = name;
      const isSpecialsSeason = seasonNumber === 0;

      if (!isSpecialsSeason) {
        nameForDisplay = `Season ${seasonNumber}`;
      }

      return {
        airDate,
        episodes: episodes.length && formatEpisodesForSeason(episodes),
        id,
        isSpecialsSeason,
        name,
        nameForDisplay,
        overview,
        posterPath,
        seasonNumber,
      };
    }
  );

  const specialsIndex = camelCaseSeasons.findIndex(season => season.seasonNumber === 0);
  // Move 'Specials' season to end of seasons list
  if (specialsIndex === 0 || specialsIndex) {
    camelCaseSeasons.push(camelCaseSeasons.splice(specialsIndex, 1)[0]);
  }

  return camelCaseSeasons.filter(season => season.episodes.length);
};

export const mapShowInfoForDisplay = (show: any): BasicShowInfo => {
  const {
    backdrop_path: backdropPath,
    created_by: createdBy,
    episode_run_time: episodeRunTime,
    first_air_date: firstAirDate,
    genres,
    id,
    in_production: inProduction,
    last_air_date: lastAirDate,
    last_episode_to_air: lastEpisodeToAir,
    name,
    networks,
    next_episode_to_air: nextEpisodeToAir,
    number_of_episodes: numEpisodes,
    number_of_seasons: numSeasons,
    overview,
    poster_path: posterPath,
    seasonsWithEpisodes,
    spoken_languages: spokenLanuages,
    status,
    tagline,
    videos,
    vote_average: voteAverage,
    vote_count: voteCount,
  } = show;

  const lastEpisodeForDisplay: EpisodeForDisplay = lastEpisodeToAir && {
    airDate: lastEpisodeToAir?.air_date,
    daysDiff: Math.abs(moment().startOf('day').diff(lastEpisodeToAir?.air_date, 'days')),
    episodeNumber: addLeadingZero(lastEpisodeToAir?.episode_number),
    name: lastEpisodeToAir?.name,
    overview: lastEpisodeToAir?.overview,
    seasonNumber: addLeadingZero(lastEpisodeToAir?.season_number),
    timeFromNow: getTimeFromLastEpisode(lastEpisodeToAir?.air_date),
  };

  const nextEpisodeForDisplay: EpisodeForDisplay = nextEpisodeToAir && {
    airDate: nextEpisodeToAir?.air_date,
    daysDiff: Math.abs(moment().startOf('day').diff(nextEpisodeToAir?.air_date, 'days')),
    episodeNumber: addLeadingZero(nextEpisodeToAir?.episode_number),
    name: nextEpisodeToAir?.name,
    overview: nextEpisodeToAir?.overview,
    seasonNumber: addLeadingZero(nextEpisodeToAir?.season_number),
    timeFromNow: getTimeUntilNextEpisode(nextEpisodeToAir?.air_date),
  };

  const statusWithColor = getStatusWithColor(status, lastEpisodeForDisplay, nextEpisodeForDisplay);

  const genreNames: string[] = genres.slice(0, 2).map((genre: Genre) => genre.name);

  const yearsActive =
    firstAirDate &&
    `${moment(firstAirDate).year()}-${
      status === 'Ended' ? moment(lastEpisodeToAir?.air_date).year() : ''
    }`;

  const language = spokenLanuages.map((language: any) => language.english_name).join(', ');

  const voteAverageForDisplay = voteAverage ? voteAverage.toFixed(1) : '-';

  return {
    backdropPath,
    createdBy: createdBy[0]?.name,
    episodeRunTime: (episodeRunTime?.length && episodeRunTime[0]) || undefined,
    firstAirDate,
    genreNames,
    language,
    id,
    inProduction,
    lastAirDate,
    lastEpisodeForDisplay,
    name,
    network: networks[0]?.name,
    nextEpisodeForDisplay,
    numEpisodes,
    numSeasons,
    overview,
    posterPath,
    seasonsWithEpisodes: formatSeasons(seasonsWithEpisodes),
    statusWithColor,
    tagline,
    videoTrailerKey: getVideoTrailerKey(videos),
    voteAverage: voteAverageForDisplay,
    voteCount,
    yearsActive,
  };
};

// Example: Netflix has a show where the whole season airs on one day. Instead of showing multiple
// individual events, show one event. Example: 'S1 E1-E10'.
export const formatSameDayEpisodes = (episodesForDisplay: CalendarEpisode[]) => {
  // Combine episode objects with same show name and date
  const sameDayEpisodesByEpisodeID: Record<number, CalendarEpisode> = {};
  episodesForDisplay.reduce((prev, next) => {
    if (prev?.showName === next.showName && prev?.date === next.date) {
      if (!sameDayEpisodesByEpisodeID.hasOwnProperty(prev.episodeId)) {
        sameDayEpisodesByEpisodeID[prev.episodeId] = prev;
      }
      if (!sameDayEpisodesByEpisodeID.hasOwnProperty(next.episodeId)) {
        sameDayEpisodesByEpisodeID[next.episodeId] = next;
      }
    }
    return next;
  });
  const sameDayEpisodes = Object.values(sameDayEpisodesByEpisodeID);

  // Create object grouping episodes by unique show and date
  const sameDayEpisodesByIDAndDate = sameDayEpisodes.reduce(
    (acc: Record<string, CalendarEpisode[]>, next) => {
      if (!acc[`${next.showId}-${next.date}`]) {
        acc[`${next.showId}-${next.date}`] = [next];
      } else {
        acc[`${next.showId}-${next.date}`].push(next);
      }
      return acc;
    },
    {}
  );

  // Create an array of 'same day episodes' ready for calendar to accept
  const formattedSameDayEpisodes: CalendarEpisode[] = [];
  Object.values(sameDayEpisodesByIDAndDate).forEach(episodes => {
    const baseEpisode = episodes[0];
    const seasonNumber = baseEpisode.seasonNumber;
    const episodeNumbers = episodes.map(episode => episode.episodeNumber);
    const lowestEpisode = Math.min(...episodeNumbers);
    const highestEpisode = Math.max(...episodeNumbers);
    const seasonAndEpisodeNumbersShort = `S${seasonNumber} E${lowestEpisode}-${highestEpisode}`;
    const seasonAndEpisodeNumbersFull = `Season ${seasonNumber} Episodes ${lowestEpisode}-${highestEpisode}`;
    baseEpisode.seasonAndEpisodeNumbersFull = seasonAndEpisodeNumbersFull;
    baseEpisode.title = `${baseEpisode.showName}: ${seasonAndEpisodeNumbersShort}`;
    baseEpisode.isMulipleEvent = true;
    baseEpisode.multipleEventSpanAmount = episodeNumbers.length;
    formattedSameDayEpisodes.push(baseEpisode);
  });

  // Remove the 'same day episodes' from original array
  const sameDayEpisodeIDs = Array.from(new Set(sameDayEpisodes.map(episode => episode.episodeId)));
  const episodesWithoutSameDay = episodesForDisplay.filter(
    episode => !sameDayEpisodeIDs.includes(episode.episodeId)
  );

  return episodesWithoutSameDay.concat(formattedSameDayEpisodes);
};
