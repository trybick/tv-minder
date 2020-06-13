import axios from 'axios';
import { API_URLS } from 'utils/constants';
import { getUniqueColorsForShowIds } from 'utils/getColorForShowId';
import moment from 'moment';

const queryParams = {
  api_key: process.env.REACT_APP_MOVIE_DB_KHEE,
};

// Takes a list of showIds. Returns a list of episodes ready to display on calendar
export const getEpisodesForDisplay = async (showIds: number[]) => {
  const latestAiredSeasons = await getLatestAiredSeasons(showIds);
  const fullSeasonData = await getFullSeasonData(latestAiredSeasons);
  const episodesForDisplay = calculateEpisodesForDisplay(fullSeasonData);

  return episodesForDisplay;
};

const getLatestAiredSeasons = async (showIds: number[]): Promise<any> => {
  // List of requests for each show's basic info
  const basicInfoRequests = showIds.map((showId: any) =>
    axios.get(`${API_URLS.MOVIE_DB}/tv/${showId}`, { params: queryParams })
  );

  // Get each show's basic info
  const basicInfoForShows = await axios
    .all(basicInfoRequests)
    .then(res => res.map(res => res.data))
    .catch((err: Error) => {
      console.log('Axios error', err.message);
    });

  // Find latest season number(s) for each show
  const latestSeasons = (basicInfoForShows as any[]).map((showInfo: any) => {
    const {
      last_air_date: lastAirDate,
      last_episode_to_air: lastEpisodeToAir,
      id,
      name,
      next_episode_to_air: nextEpisodeToAir,
      status,
    } = showInfo;

    const shouldSkipMoreFetching =
      status === 'Ended' && moment(lastAirDate).isBefore(moment().subtract(6, 'months'));
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

    return { latestSeasons, id, name };
  });

  return latestSeasons.filter(Boolean);
};

const getFullSeasonData = async (latestAiredSeasons: any[]) => {
  const fullSeasonDataForLatestSeasons = latestAiredSeasons.map(
    async (latestSeasonsForShow: any) => {
      const { id, name, latestSeasons } = latestSeasonsForShow;

      // List of requests for each season(s) for each show
      const latestSeasonsRequests = latestSeasons.map((seasonNum: number) =>
        axios.get(`${API_URLS.MOVIE_DB}/tv/${id}/season/${seasonNum}`, { params: queryParams })
      );

      // Get season data for each season for each show
      const fullSeasonData = await axios
        .all(latestSeasonsRequests)
        // @ts-ignore
        .then(res => res.map(res => res.data));

      // Store show name and ID on season object
      fullSeasonData.forEach((fullSeason: any) => {
        fullSeason.name = name;
        fullSeason.showId = id;
      });

      return fullSeasonData;
    }
  );

  return Promise.all(fullSeasonDataForLatestSeasons);
};

const calculateEpisodesForDisplay = (fullSeasonDataForLatestSeasons: any[]) => {
  // Attach extra properties to each season object
  const showSeasonObject = fullSeasonDataForLatestSeasons.flat().map((season: any) =>
    (({ episodes, name, showId }) => ({
      episodes,
      name,
      showId,
    }))(season)
  );

  // Calculate unique color based on showId
  const listOfShowIds: number[] = showSeasonObject.map((show: any) => show.showId);
  const uniqueColorList = getUniqueColorsForShowIds(listOfShowIds);
  const showSeasonWithColors = showSeasonObject.map((show: any, i: any) => ({
    ...show,
    color: uniqueColorList[i],
  }));

  // Add extra properties on to each episode
  const flattenedEpisodeList = showSeasonWithColors.flatMap((show: any) => {
    const { color, episodes, name, showId } = show;
    return episodes.map((episode: any) => ({
      ...episode,
      color,
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
  const episodesForDisplay = recentEpisodes?.map((episode: any) =>
    (({
      air_date: airDate,
      color,
      episode_number: episodeNumber,
      season_number: seasonNumber,
      showId,
      showName,
    }) => ({
      color,
      date: airDate,
      extendedProps: {
        showId,
      },
      title: `${showName} S${seasonNumber} E${episodeNumber}`,
    }))(episode)
  );

  // Send episodesForDisplay and showIds to new function here which will save this data to store
  // Map thru

  return episodesForDisplay;
};
