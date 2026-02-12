import { type TmdbSeason, type TmdbShow } from '~/store/tv/types/tmdbSchema';
import { type CalendarEpisode } from '~/store/tv/types/transformed';
import { formatSameDayEpisodes } from '~/store/tv/utils/formatting';
import { tmdbApi } from '~/store/tv/utils/tmdbApi';
import { isDateWithinOneMonth } from '~/utils/dates';
import { dayjs } from '~/utils/dayjs';
import { getUniqueColorsForShowIds } from '~/utils/getUniqueColorsForShowIds';

type ShowWithLatestSeasons = {
  id: number;
  name: string;
  network: string | undefined;
  latestSeasons: number[];
};

type SeasonWithShowInfo = TmdbSeason & {
  name: string;
  showId: number;
  network: string | undefined;
};

type LatestAiredSeasonData = {
  latestSeasons: ShowWithLatestSeasons[];
  recentShowIds: Set<number>;
};

/** Takes a list of showIds. Returns a list of episodes ready to display on calendar. */
export const getEpisodesForCalendar = async (showIds: number[]) => {
  const { latestSeasons, recentShowIds } = await getLatestAiredSeasons(showIds);
  const fullSeasonData = await getFullSeasonData(latestSeasons);
  const fetchedEpisodeData = calculateEpisodesForDisplay(
    fullSeasonData,
    recentShowIds
  );

  return { fetchedEpisodeData };
};

const getLatestAiredSeasons = async (
  showIds: number[]
): Promise<LatestAiredSeasonData> => {
  // Get each show's basic info
  const results = await Promise.allSettled(
    showIds.map(showId => tmdbApi.getShow(showId))
  );

  const sixMonthsAgo = dayjs().subtract(6, 'month');

  // Filter out failed requests and extract successful results.
  const shows = results
    .filter(
      (result): result is PromiseFulfilledResult<TmdbShow> =>
        result.status === 'fulfilled'
    )
    .map(result => result.value);

  const recentShowIds = new Set<number>();

  // Find latest season number(s) for each show
  const latestSeasons = shows
    .map((showInfo): ShowWithLatestSeasons | null => {
      const {
        last_air_date: lastAirDate,
        last_episode_to_air: lastEpisodeToAir,
        id,
        name,
        networks,
        next_episode_to_air: nextEpisodeToAir,
        status,
      } = showInfo;

      const nextEpisodeAirDate = nextEpisodeToAir?.air_date;
      const isRecent =
        isDateWithinOneMonth(lastAirDate) ||
        isDateWithinOneMonth(nextEpisodeAirDate);
      if (isRecent) {
        recentShowIds.add(id);
      }

      const shouldSkipMoreFetching =
        status === 'Ended' &&
        lastAirDate &&
        dayjs(lastAirDate).isBefore(sixMonthsAgo);
      if (shouldSkipMoreFetching) {
        return null;
      }

      let seasonNumbers: number[] = [];

      const lastSeasonNumberToAir = lastEpisodeToAir?.season_number ?? null;
      const nextSeasonNumberToAir = nextEpisodeToAir?.season_number ?? null;
      const isLastAndNextEpisodeInSameSeason =
        lastSeasonNumberToAir &&
        nextSeasonNumberToAir &&
        lastSeasonNumberToAir === nextSeasonNumberToAir;

      if (lastAirDate && dayjs(lastAirDate).isBefore(sixMonthsAgo)) {
        seasonNumbers = nextSeasonNumberToAir ? [nextSeasonNumberToAir] : [];
      } else if (isLastAndNextEpisodeInSameSeason) {
        seasonNumbers = [lastSeasonNumberToAir];
      } else {
        seasonNumbers = [lastSeasonNumberToAir, nextSeasonNumberToAir].filter(
          (n): n is number => n !== null
        );
      }

      if (!seasonNumbers.length) {
        return null;
      }

      return {
        latestSeasons: seasonNumbers,
        id,
        name,
        network: networks?.[0]?.name,
      };
    })
    .filter((item): item is ShowWithLatestSeasons => item !== null);

  return { latestSeasons, recentShowIds };
};

const getFullSeasonData = async (
  latestAiredSeasons: ShowWithLatestSeasons[]
): Promise<SeasonWithShowInfo[][]> => {
  const fullSeasonDataForLatestSeasons = latestAiredSeasons.map(
    async (latestSeasonsForShow): Promise<SeasonWithShowInfo[]> => {
      const { id, name, latestSeasons, network } = latestSeasonsForShow;

      // Get season data for each season for each show
      const results = await Promise.allSettled(
        latestSeasons.map(seasonNum => tmdbApi.getSeason(id, seasonNum))
      );

      // Filter successful results and add show info
      return results
        .filter(
          (result): result is PromiseFulfilledResult<TmdbSeason> =>
            result.status === 'fulfilled'
        )
        .map(result => ({
          ...result.value,
          name,
          showId: id,
          network,
        }));
    }
  );

  return Promise.all(fullSeasonDataForLatestSeasons);
};

const calculateEpisodesForDisplay = (
  fullSeasonDataForLatestSeasons: SeasonWithShowInfo[][],
  recentShowIds: Set<number>
): CalendarEpisode[] => {
  const allSeasons = fullSeasonDataForLatestSeasons.flat().map(season => ({
    episodes: season.episodes,
    name: season.name,
    network: season.network,
    showId: season.showId,
  }));

  // Sort shows based on recent and upcoming episodes to avoid duplicate colors.
  // If the recent shows are in the front of the list they have a lower chance
  // of reusing the same color.
  const sortedAllSeasons = [...allSeasons].sort((a, b) => {
    const isShowARecent = recentShowIds.has(a.showId);
    const isShowBRecent = recentShowIds.has(b.showId);

    if (isShowARecent === isShowBRecent) {
      return 0;
    }
    if (isShowARecent) {
      return -1;
    }
    return 1;
  });

  const sortedShowIds = sortedAllSeasons.map(show => show.showId);
  const uniqueColorList = getUniqueColorsForShowIds(sortedShowIds);
  const showSeasonWithColors = sortedAllSeasons.map((show, i) => ({
    ...show,
    color: uniqueColorList[i],
  }));

  // Add extra properties on to each episode
  const flattenedEpisodeList = showSeasonWithColors.flatMap(season => {
    const { color, episodes, name, network, showId } = season;
    return episodes.map(episode => ({
      ...episode,
      color,
      network,
      showId,
      showName: name,
    }));
  });

  // Remove episodes outside of time range
  const sixMonthsAgo = dayjs().subtract(6, 'month');
  const oneYearFromNow = dayjs().add(12, 'month');
  const recentEpisodes = flattenedEpisodeList.filter(episode =>
    episode.air_date
      ? dayjs(episode.air_date).isBetween(sixMonthsAgo, oneYearFromNow)
      : false
  );

  // Create properties ready for calendar to accept
  const episodesForDisplay: CalendarEpisode[] = recentEpisodes.map(
    ({
      air_date: airDate,
      color,
      episode_number: episodeNumber,
      id: episodeId,
      name: episodeName,
      network,
      overview,
      runtime,
      season_number: seasonNumber,
      showId,
      showName,
    }) => ({
      color,
      date: airDate ?? '',
      episodeId,
      episodeName,
      episodeNumber,
      network: network ?? '',
      overview: overview ?? '',
      runtime: runtime ?? 0,
      seasonNumber,
      showId,
      showName,
      seasonAndEpisodeNumbersFull: `Season ${seasonNumber} Episode ${episodeNumber}`,
      title: `${showName}: S${seasonNumber} E${episodeNumber}`,
    })
  );

  return formatSameDayEpisodes(episodesForDisplay);
};
