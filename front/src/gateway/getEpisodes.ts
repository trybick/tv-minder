import axios from 'axios';
import { MOVIE_DB_BASE_URL } from 'utils/constants';

type QueryParams = {
  api_key: string | undefined;
};

//
// Using The Movie DB (first API)
//

export const getSchedule = async (showId: number) => {
  const seasonsToFetch = await getActiveSeasons(showId);

  const seasonEpisodes = await getSeasonEpisodes(showId, seasonsToFetch);
  console.log('seasonEpisodes:', seasonEpisodes);
};

// Get the season number of the latest and next episodes to air
export const getActiveSeasons = async (showId: number): Promise<number[]> => {
  const url = `${MOVIE_DB_BASE_URL}/tv/${showId}`;
  const queryParams: QueryParams = {
    api_key: process.env.REACT_APP_API_KEY,
  };

  return (
    (await axios
      .get(url, {
        params: queryParams,
      })
      .then((res) => {
        const { data } = res;
        const lastSeasonNumberToAir = data.last_episode_to_air?.season_number || null;
        const nextSeasonNumberToAir = data.next_episode_to_air?.season_number || null;
        const activeSeasons = [lastSeasonNumberToAir, nextSeasonNumberToAir];

        // If last and next are the same season number, only return a single value
        return lastSeasonNumberToAir &&
          nextSeasonNumberToAir &&
          lastSeasonNumberToAir === nextSeasonNumberToAir
          ? [lastSeasonNumberToAir]
          : activeSeasons;
      })
      .catch((err: Error) => {
        console.log('Axios error', err.message);
      })) || []
  );
};

// Get full episode details for seasons
export const getSeasonEpisodes = async (showId: number, seasonNumbers: number[]) => {
  const queryParams: QueryParams = {
    api_key: process.env.REACT_APP_API_KEY,
  };

  const seasonRequests = seasonNumbers
    .filter(Boolean)
    .map((seasonNum) =>
      axios.get(`${MOVIE_DB_BASE_URL}/tv/${showId}/season/${seasonNum}`, { params: queryParams })
    );

  return axios.all(seasonRequests).then((res) => res.map((res) => res.data));
};
