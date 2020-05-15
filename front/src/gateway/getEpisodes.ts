import axios from 'axios';
import { MOVIE_DB_BASE_URL } from 'utils/constants';
import moment from 'moment';

type QueryParams = {
  api_key: string | undefined;
};

//
// Using The Movie DB (first API)
// getActiveSeasons --> getSeasonEpisodes --> calculate upcoming shows
//

export const getEpisodesForDisplay = async (showId: number) => {
  const currentActiveSeasons = await getActiveSeasons(showId);
  const fullEpisodeDataForSeasons = await getFullSeasonData(showId, currentActiveSeasons);
  const episodesForDisplay = calculateEpisodeDataForDisplay(fullEpisodeDataForSeasons);

  return episodesForDisplay;
};

// Get the season number of the latest and next episodes to air
const getActiveSeasons = async (showId: number): Promise<any> => {
  const url = `${MOVIE_DB_BASE_URL}/tv/${showId}`;
  const queryParams: QueryParams = {
    api_key: process.env.REACT_APP_API_KEY,
  };

  return (
    (await axios
      .get(url, {
        params: queryParams,
      })
      .then(({ data }) => {
        const {
          last_episode_to_air: lastEpisodeToAir,
          name,
          next_episode_to_air: nextEpisodeToAir,
        } = data;

        const lastSeasonNumberToAir = lastEpisodeToAir?.season_number || null;
        const nextSeasonNumberToAir = nextEpisodeToAir?.season_number || null;
        const activeSeasons = [lastSeasonNumberToAir, nextSeasonNumberToAir];
        const isLastAndNextSameSeason =
          lastSeasonNumberToAir &&
          nextSeasonNumberToAir &&
          lastSeasonNumberToAir === nextSeasonNumberToAir;

        return isLastAndNextSameSeason
          ? { name, activeSeasons: [lastSeasonNumberToAir] }
          : { name, activeSeasons };
      })
      .catch((err: Error) => {
        console.log('Axios error', err.message);
      })) || []
  );
};

const getFullSeasonData = async (showId: number, showData: any) => {
  const queryParams: QueryParams = {
    api_key: process.env.REACT_APP_API_KEY,
  };

  const { name, activeSeasons } = showData;

  const seasonRequests = activeSeasons
    .filter(Boolean)
    .map((seasonNum: any) =>
      axios.get(`${MOVIE_DB_BASE_URL}/tv/${showId}/season/${seasonNum}`, { params: queryParams })
    );

  // @ts-ignore
  const fullSeasonData = await axios.all(seasonRequests).then((res) => res.map((res) => res.data));

  // @ts-ignore
  fullSeasonData[0]['name'] = name;

  return fullSeasonData;
};

const calculateEpisodeDataForDisplay = (fullSeasonData: any) => {
  const fullEpisodes = {};

  fullSeasonData.forEach((season: any) => {
    // @ts-ignore
    fullEpisodes[`season${season.season_number}`] = season.episodes;
  });

  // @ts-ignore
  const recentEpisodes = Object.values(fullEpisodes)[0]?.filter((episode) => {
    return moment(moment(episode.air_date)).isBetween(
      moment().subtract(3, 'months'),
      moment().add(3, 'months')
    );
  });

  const episodesForDisplay = recentEpisodes?.map((episode: any) => {
    return (({ air_date, episode_number, season_number }) => ({
      airDate: air_date,
      episodeNumber: episode_number,
      seasonNumber: season_number,
      showName: fullSeasonData[0].name,
    }))(episode);
  });

  return episodesForDisplay;
};
