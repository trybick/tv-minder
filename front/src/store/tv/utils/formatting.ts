import { type TmdbSeason, type TmdbShow } from '~/store/tv/types/tmdbSchema';
import {
  type CalendarEpisode,
  type EpisodeForDisplay,
  type EpisodeForSeason,
  type Genre,
  type SeasonWithEpisodes,
  type ShowForDisplay,
} from '~/store/tv/types/transformed';
import { type TmdbShowWithSeasons } from '~/store/tv/types/transformed';
import { dayjs } from '~/utils/dayjs';
import { isEmpty } from '~/utils/object';

export type ShowStatus = {
  isEnded: boolean;
  isActiveSeason: boolean;
  isInProduction: boolean;
  isPremieringSoon: boolean;
};

export const getShowStatus = (
  originalStatus: string,
  lastEpisodeForDisplay: EpisodeForDisplay | null | undefined,
  nextEpisodeForDisplay: EpisodeForDisplay | null | undefined
): ShowStatus => {
  const isActiveSeason = Boolean(
    lastEpisodeForDisplay &&
    ((nextEpisodeForDisplay &&
      dayjs(nextEpisodeForDisplay.airDate).diff(
        lastEpisodeForDisplay.airDate,
        'day'
      ) < 45) ||
      dayjs().diff(lastEpisodeForDisplay.airDate, 'day') < 14)
  );
  const isPremieringSoon = Boolean(
    nextEpisodeForDisplay &&
    dayjs(nextEpisodeForDisplay.airDate).diff(dayjs().startOf('day'), 'day') <
      60 &&
    nextEpisodeForDisplay.episodeNumber === '01'
  );
  const isEnded = originalStatus === 'Ended';
  const isInProduction = !isEnded && !isPremieringSoon && !isActiveSeason;

  return { isEnded, isActiveSeason, isInProduction, isPremieringSoon };
};

export const getVideoTrailerKey = (
  videos: TmdbShow['videos']
): string | undefined => {
  if (!videos?.results.length) {
    return;
  }
  const { results } = videos;
  const matchingVideo = results
    .filter(video => video.site === 'YouTube')
    .find(video => {
      if (video.name === 'Official Trailer') {
        return video;
      } else if (video.name.includes('Trailer')) {
        return video;
      }
    });
  return matchingVideo?.key || results[0]?.key || undefined;
};

const formatEpisodesForSeason = (
  episodes: TmdbSeason['episodes']
): EpisodeForSeason[] => {
  if (isEmpty(episodes)) {
    return [];
  }
  return episodes.map<EpisodeForSeason>(episode => {
    const {
      air_date: airDate,
      episode_number: episodeNumber,
      name,
      vote_average: voteAverage,
    } = episode || {};

    return {
      airDate,
      episodeNumber,
      name,
      voteAverage: voteAverage ? voteAverage.toFixed(1) : '-',
    };
  });
};

const formatSeasons = (
  seasons: Record<number, TmdbSeason>
): SeasonWithEpisodes[] => {
  if (isEmpty(seasons)) {
    return [];
  }
  const camelCaseSeasons: SeasonWithEpisodes[] = Object.values(
    seasons
  ).map<SeasonWithEpisodes>(season => {
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
      episodes: episodes.length ? formatEpisodesForSeason(episodes) : [],
      id,
      isSpecialsSeason,
      name,
      nameForDisplay,
      overview,
      posterPath,
      seasonNumber,
    };
  });

  const specialsIndex = camelCaseSeasons.findIndex(
    season => season.seasonNumber === 0
  );
  // Move 'Specials' season to end of seasons list
  if (specialsIndex === 0 || specialsIndex) {
    camelCaseSeasons.push(camelCaseSeasons.splice(specialsIndex, 1)[0]);
  }

  return camelCaseSeasons.filter(season => season.episodes.length);
};

export const mapShowInfoForDisplay = (
  show: TmdbShowWithSeasons
): ShowForDisplay => {
  const {
    backdrop_path: backdropPath,
    episode_run_time: episodeRunTime,
    first_air_date: firstAirDate,
    genres,
    id,
    last_episode_to_air: lastEpisodeToAir,
    name,
    networks,
    next_episode_to_air: nextEpisodeToAir,
    overview,
    poster_path: posterPath,
    seasonsWithEpisodes,
    spoken_languages: spokenLanguages,
    status,
    videos,
    vote_average: voteAverage,
    vote_count: voteCount,
  } = show;

  const lastEpisodeForDisplay: EpisodeForDisplay | null = lastEpisodeToAir
    ? {
        airDate: lastEpisodeToAir.air_date,
        episodeNumber: String(lastEpisodeToAir.episode_number).padStart(2, '0'),
      }
    : null;

  const nextEpisodeForDisplay: EpisodeForDisplay | null = nextEpisodeToAir
    ? {
        airDate: nextEpisodeToAir.air_date,
        episodeNumber: String(nextEpisodeToAir.episode_number).padStart(2, '0'),
      }
    : null;

  const showStatus = getShowStatus(
    status,
    lastEpisodeForDisplay,
    nextEpisodeForDisplay
  );

  const genreNames: string[] = (genres ?? [])
    .slice(0, 2)
    .map((genre: Genre) => genre.name);

  const startYear = firstAirDate ? `${dayjs(firstAirDate).year()}` : '';

  const language = spokenLanguages?.map(lang => lang.english_name).join(', ');

  const voteAverageForDisplay = voteAverage ? voteAverage.toFixed(1) : '-';

  return {
    backdropPath,
    episodeRunTime: (episodeRunTime?.length && episodeRunTime[0]) || undefined,
    firstAirDate,
    genreNames,
    language,
    id,
    lastEpisodeAirDate: lastEpisodeToAir?.air_date ?? null,
    name,
    network: networks?.[0]?.name,
    nextEpisodeAirDate: nextEpisodeToAir?.air_date ?? null,
    overview,
    posterPath,
    seasonsWithEpisodes: formatSeasons(seasonsWithEpisodes ?? {}),
    status: showStatus,
    videoTrailerKey: getVideoTrailerKey(videos),
    voteAverage: voteAverageForDisplay,
    voteCount,
    startYear,
  };
};

// Example: Netflix has a show where the whole season airs on one day. Instead of showing multiple
// individual events, show one event. Example: 'S1 E1-E10'.
export const formatSameDayEpisodes = (
  episodesForDisplay: CalendarEpisode[]
) => {
  if (!episodesForDisplay.length) {
    return [];
  }

  // Combine episode objects with same show name and date
  const sameDayEpisodesByEpisodeID: Record<number, CalendarEpisode> = {};
  episodesForDisplay.reduce((prev, next) => {
    if (prev?.showName === next.showName && prev?.date === next.date) {
      if (!sameDayEpisodesByEpisodeID[prev.episodeId]) {
        sameDayEpisodesByEpisodeID[prev.episodeId] = prev;
      }
      if (!sameDayEpisodesByEpisodeID[next.episodeId]) {
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
  const sameDayEpisodeIDs = Array.from(
    new Set(sameDayEpisodes.map(episode => episode.episodeId))
  );
  const episodesWithoutSameDay = episodesForDisplay.filter(
    episode => !sameDayEpisodeIDs.includes(episode.episodeId)
  );

  return episodesWithoutSameDay.concat(formattedSameDayEpisodes);
};
