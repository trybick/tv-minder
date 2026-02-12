import {
  type TmdbSeason,
  type TmdbShowWatchProvider,
  type TmdbShowWatchProviders,
} from '~/store/tv/types/tmdbSchema';
import {
  type CalendarEpisode,
  type EpisodeForDisplay,
  type EpisodeForSeason,
  type Genre,
  type SeasonWithEpisodes,
  type ShowForDisplay,
  type ShowReview,
  type ShowVideo,
  type ShowWatchProvider,
  type ShowWatchProviders,
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

type VideoPayload = {
  results: Array<{
    key: string;
    type: string;
    site: string;
    name: string;
    official?: boolean;
  }>;
};

export const getShowStatus = (
  originalStatus: string,
  lastEpisodeForDisplay: EpisodeForDisplay | null | undefined,
  nextEpisodeForDisplay: EpisodeForDisplay | null | undefined
): ShowStatus => {
  const isActiveSeason = !!(
    lastEpisodeForDisplay &&
    ((nextEpisodeForDisplay &&
      dayjs(nextEpisodeForDisplay.airDate).diff(
        lastEpisodeForDisplay.airDate,
        'day'
      ) < 45) ||
      dayjs().diff(lastEpisodeForDisplay.airDate, 'day') < 14)
  );
  const isPremieringSoon = !!(
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
  videos: VideoPayload | undefined
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

const formatVideos = (videos: VideoPayload | undefined): ShowVideo[] => {
  if (!videos?.results.length) {
    return [];
  }

  const onlyYoutube = videos.results.filter(video => video.site === 'YouTube');
  if (!onlyYoutube.length) {
    return [];
  }

  return onlyYoutube
    .sort((a, b) => {
      const aScore = Number(!!a.official) + Number(a.type === 'Trailer');
      const bScore = Number(!!b.official) + Number(b.type === 'Trailer');
      return bScore - aScore;
    })
    .map<ShowVideo>(video => ({
      key: video.key,
      name: video.name,
      type: video.type,
    }));
};

const formatReviews = (
  reviews: TmdbShowWithSeasons['showReviews']
): ShowReview[] =>
  reviews?.results?.slice(0, 4).map(review => ({
    id: review.id,
    author: review.author,
    content: review.content,
    createdAt: review.created_at,
    url: review.url,
  })) ?? [];

const mapWatchProviders = (
  providers: TmdbShowWatchProviders | undefined,
  requestedRegion: string | undefined
): ShowWatchProviders | null => {
  const regions = providers?.results;
  if (!regions) {
    return null;
  }

  const preferredRegion = requestedRegion?.toUpperCase();
  const regionCandidates = [
    preferredRegion,
    'US',
    ...Object.keys(regions),
  ].filter((region): region is string => !!region);

  const regionCode = regionCandidates.find(region => {
    const entry = regions[region];
    return !!(
      entry &&
      (entry.flatrate?.length || entry.rent?.length || entry.buy?.length)
    );
  });

  if (!regionCode) {
    return null;
  }

  const regionData = regions[regionCode];
  if (!regionData) {
    return null;
  }

  const mapProviders = (
    entries: TmdbShowWatchProvider[] | undefined
  ): ShowWatchProvider[] => {
    if (!entries?.length) {
      return [];
    }

    const seen = new Set<number>();
    return entries
      .filter(entry => {
        if (seen.has(entry.provider_id)) {
          return false;
        }
        seen.add(entry.provider_id);
        return true;
      })
      .map(entry => ({
        id: entry.provider_id,
        name: entry.provider_name,
        logoPath: entry.logo_path,
      }));
  };

  return {
    region: regionCode,
    link: regionData.link,
    flatrate: mapProviders(regionData.flatrate),
    rent: mapProviders(regionData.rent),
    buy: mapProviders(regionData.buy),
  };
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
      episodes: episodes?.length ? formatEpisodesForSeason(episodes) : [],
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
    showReviews,
    showVideos,
    showWatchProviders,
    spoken_languages: spokenLanguages,
    status,
    videos,
    watchRegion,
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
  const videosForDisplay = formatVideos(showVideos ?? videos);
  const reviews = formatReviews(showReviews);
  const watchProviders = mapWatchProviders(showWatchProviders, watchRegion);

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
    reviews,
    seasonsWithEpisodes: formatSeasons(seasonsWithEpisodes ?? {}),
    status: showStatus,
    videos: videosForDisplay,
    videoTrailerKey: getVideoTrailerKey(showVideos ?? videos),
    voteAverage: voteAverageForDisplay,
    voteCount,
    watchProviders,
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

  // Group episodes by show and date so we can collapse full-season drops into one event.
  const episodesByShowAndDate = new Map<string, CalendarEpisode[]>();
  for (const episode of episodesForDisplay) {
    const key = `${episode.showId}-${episode.date}`;
    const existing = episodesByShowAndDate.get(key);
    if (existing) {
      existing.push(episode);
    } else {
      episodesByShowAndDate.set(key, [episode]);
    }
  }

  const singleEpisodes: CalendarEpisode[] = [];
  const formattedSameDayEpisodes: CalendarEpisode[] = [];

  episodesByShowAndDate.forEach(episodes => {
    if (episodes.length === 1) {
      singleEpisodes.push(episodes[0]);
      return;
    }

    const baseEpisode = episodes[0];
    const seasonNumber = baseEpisode.seasonNumber;
    const episodeNumbers = episodes.map(episode => episode.episodeNumber);
    const lowestEpisode = Math.min(...episodeNumbers);
    const highestEpisode = Math.max(...episodeNumbers);

    formattedSameDayEpisodes.push({
      ...baseEpisode,
      seasonAndEpisodeNumbersFull: `Season ${seasonNumber} Episodes ${lowestEpisode}-${highestEpisode}`,
      title: `${baseEpisode.showName}: S${seasonNumber} E${lowestEpisode}-${highestEpisode}`,
      isMulipleEvent: true,
      multipleEventSpanAmount: episodeNumbers.length,
    });
  });

  return singleEpisodes.concat(formattedSameDayEpisodes);
};
