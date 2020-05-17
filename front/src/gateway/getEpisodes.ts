import axios from 'axios';
import { MOVIE_DB_BASE_URL } from 'utils/constants';
import { getColorForShowId } from 'utils/getColorForShowId';
import moment from 'moment';

const queryParams = {
  api_key: process.env.REACT_APP_API_KEY,
};

// Takes a list of showIds
// Returns a list of episodes ready to display on calendar
export const getEpisodesForDisplay = async (showIds: number[]) => {
  const latestAiredSeasons = await getLatestAiredSeasons(showIds);
  const fullSeasonData = await getFullSeasonData(latestAiredSeasons);
  const episodesForDisplay = calculateEpisodesForDisplay(fullSeasonData);

  return episodesForDisplay;
};

const getLatestAiredSeasons = async (showIds: number[]): Promise<any> => {
  // List of requests for each show's basic info
  const basicInfoRequests = showIds.map((showId: any) =>
    axios.get(`${MOVIE_DB_BASE_URL}/tv/${showId}`, { params: queryParams })
  );

  // Get each show's basic info
  const basicInfoForShows = await axios
    .all(basicInfoRequests)
    .then((res) => res.map((res) => res.data))
    .catch((err: Error) => {
      console.log('Axios error', err.message);
    });

  // Find latest season number(s) for each show
  const latestSeasons = (basicInfoForShows as any[]).map((showInfo: any) => {
    const {
      last_episode_to_air: lastEpisodeToAir,
      id,
      name,
      next_episode_to_air: nextEpisodeToAir,
      status,
    } = showInfo;

    if (status === 'Ended') {
      return;
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
        axios.get(`${MOVIE_DB_BASE_URL}/tv/${id}/season/${seasonNum}`, { params: queryParams })
      );

      // Get season data for each season for each show
      const fullSeasonData = await axios
        .all(latestSeasonsRequests)
        // @ts-ignore
        .then((res) => res.map((res) => res.data));

      // Store show name on season object
      fullSeasonData.forEach((fullSeason: any) => {
        fullSeason.name = name;
      });

      return fullSeasonData;
    }
  );

  return Promise.all(fullSeasonDataForLatestSeasons);
};

const calculateEpisodesForDisplay = (fullSeasonDataForLatestSeasons: any[]) => {
  // Add name property to episodes object
  const showEpisodesAndNameObject = fullSeasonDataForLatestSeasons.flat().map((season: any) => ({
    episodes: season.episodes,
    name: season.name,
  }));

  // Add name and color properties to each episode
  const episodesListWithNameAndColor = showEpisodesAndNameObject
    .map((show: any) => {
      const { color, episodes, name } = show;

      return episodes.map((episode: any) => ({
        ...episode,
        color,
        showName: name,
      }));
    })
    .flat();

  // Remove episodes outside of time range
  const recentEpisodes = episodesListWithNameAndColor.filter((episode: any) =>
    moment(moment(episode.air_date)).isBetween(
      moment().subtract(6, 'months'),
      moment().add(12, 'months')
    )
  );

  // Create properties ready for calendar to accept
  const episodesForDisplay = recentEpisodes?.map((episode: any) =>
    (({
      air_date: airDate,
      episode_number: episodeNumber,
      season_number: seasonNumber,
      show_id: showId,
      showName,
    }) => ({
      color: getColorForShowId(showId),
      date: airDate,
      title: `${showName} S${seasonNumber} E${episodeNumber}`,
    }))(episode)
  );

  return episodesForDisplay;
};
