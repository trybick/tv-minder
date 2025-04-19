import axios from 'axios';
import moment from 'moment';
import ENDPOINTS from 'constants/endpoints';
import { formatSameDayEpisodes } from 'store/tv/tvUtils';
import { ID } from 'types/common';
import { CalendarEpisode } from 'types/external';
import { getUniqueColorsForShowIds } from 'utils/getColorForShowId';
import handleErrors from 'utils/handleErrors';

const queryParams = {
  api_key: import.meta.env.VITE_THE_MOVIE_DB_KEY,
};

/** Takes a list of showIds. Returns a list of episodes ready to display on calendar. */
export const getEpisodesForCalendar = async (showIds: ID[]) => {
  const latestAiredSeasons = await getLatestAiredSeasons(showIds);
  const fullSeasonData = await getFullSeasonData(latestAiredSeasons);
  const fetchedEpisodeData = calculateEpisodesForDisplay(fullSeasonData);
  const cache = createCache(fetchedEpisodeData, showIds);

  return { cache, fetchedEpisodeData };
};

const getLatestAiredSeasons = async (showIds: ID[]): Promise<any> => {
  // List of requests for each show's basic info
  const basicInfoRequests = showIds.map((showId: any) =>
    axios.get(`${ENDPOINTS.THE_MOVIE_DB}/tv/${showId}`, { params: queryParams })
  );

  // Get each show's basic info
  const basicInfoForShows = await axios
    .all(basicInfoRequests)
    .then(res => res.map(res => res.data))
    .catch(handleErrors);

  // Find latest season number(s) for each show
  const latestSeasons = (basicInfoForShows as any[]).map((showInfo: any) => {
    const {
      last_air_date: lastAirDate,
      last_episode_to_air: lastEpisodeToAir,
      id,
      name,
      networks,
      next_episode_to_air: nextEpisodeToAir,
      status,
    } = showInfo;

    const shouldSkipMoreFetching =
      status === 'Ended' &&
      moment(lastAirDate).isBefore(moment().subtract(6, 'months'));
    if (shouldSkipMoreFetching) {
      return null;
    }

    const lastSeasonNumberToAir = lastEpisodeToAir?.season_number || null;
    const nextSeasonNumberToAir = nextEpisodeToAir?.season_number || null;
    const isLastAndNextEpisodeInSameSeason =
      lastSeasonNumberToAir &&
      nextSeasonNumberToAir &&
      lastSeasonNumberToAir === nextSeasonNumberToAir;
    const latestSeasons = isLastAndNextEpisodeInSameSeason
      ? [lastSeasonNumberToAir]
      : [lastSeasonNumberToAir, nextSeasonNumberToAir].filter(Boolean);

    return { latestSeasons, id, name, network: networks[0]?.name };
  });

  return latestSeasons.filter(Boolean);
};

const getFullSeasonData = async (latestAiredSeasons: any[]) => {
  const fullSeasonDataForLatestSeasons = latestAiredSeasons.map(
    async (latestSeasonsForShow: any) => {
      const { id, name, latestSeasons, network } = latestSeasonsForShow;

      // List of requests for each season(s) for each show
      const latestSeasonsRequests = latestSeasons.map((seasonNum: ID) =>
        axios.get(`${ENDPOINTS.THE_MOVIE_DB}/tv/${id}/season/${seasonNum}`, {
          params: queryParams,
        })
      );

      // Get season data for each season for each show
      const fullSeasonData = await axios
        .all(latestSeasonsRequests)
        .then((res: any) => res.map((res: any) => res.data));

      // Store more props on season object
      fullSeasonData.forEach((fullSeason: any) => {
        fullSeason.name = name;
        fullSeason.showId = id;
        fullSeason.network = network;
      });

      return fullSeasonData;
    }
  );

  return Promise.all(fullSeasonDataForLatestSeasons);
};

const calculateEpisodesForDisplay = (fullSeasonDataForLatestSeasons: any[]) => {
  // Attach extra properties to each season object
  const showSeasonObject = fullSeasonDataForLatestSeasons
    .flat()
    .map((season: any) =>
      (({ episodes, name, network, showId }) => ({
        episodes,
        name,
        network,
        showId,
      }))(season)
    );

  // Calculate unique color based on showId
  const listOfShowIds: ID[] = showSeasonObject.map((show: any) => show.showId);
  const uniqueColorList = getUniqueColorsForShowIds(listOfShowIds);
  const showSeasonWithColors = showSeasonObject.map((show: any, i: any) => ({
    ...show,
    color: uniqueColorList[i],
  }));

  // Add extra properties on to each episode
  const flattenedEpisodeList = showSeasonWithColors.flatMap((season: any) => {
    const { color, episodes, name, network, showId } = season;
    return episodes.map((episode: any) => ({
      ...episode,
      color,
      network,
      showId,
      showName: name,
    }));
  });

  // Remove episodes outside of time range
  const recentEpisodes = flattenedEpisodeList.filter((episode: any) =>
    moment(moment(episode.air_date)).isBetween(
      moment().subtract(6, 'months'),
      moment().add(12, 'months')
    )
  );

  // Create properties ready for calendar to accept
  const episodesForDisplay: CalendarEpisode[] = recentEpisodes?.map(
    ({
      air_date: airDate,
      color,
      episode_number: episodeNumber,
      id: episodeId,
      name: episodeName,
      network,
      overview = '',
      runtime = '',
      season_number: seasonNumber,
      showId,
      showName,
    }) => ({
      color,
      date: airDate,
      episodeId,
      episodeName,
      episodeNumber,
      network,
      overview,
      runtime,
      seasonNumber,
      showId,
      showName,
      seasonAndEpisodeNumbersFull: `Season ${seasonNumber} Episode ${episodeNumber}`,
      title: `${showName}: S${seasonNumber} E${episodeNumber}`,
    })
  );

  return formatSameDayEpisodes(episodesForDisplay);
};

// Create a cache object which will be persisted to the redux store
const createCache = (episodesData: any, showIds: ID[]) => {
  const cache: { [key: ID]: any } = {};

  episodesData.forEach((episode: any) => {
    const { showId } = episode;
    if (cache.hasOwnProperty(showId)) {
      cache[showId].episodes.push(episode);
    } else {
      cache[showId] = {
        episodes: [episode],
        fetchedAt: moment(),
      };
    }
  });

  // If there are showIds missing from episode data, it means they were taken out because they
  // don't have active seasons. Add these showIds back in so we can cache that they are empty.
  showIds.forEach(id => {
    if (!cache.hasOwnProperty(id)) {
      cache[id] = {
        episodes: null,
        fetchedAt: moment(),
      };
    }
  });

  return cache;
};
