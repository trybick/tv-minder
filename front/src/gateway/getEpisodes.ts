import axios from 'axios';
import { MOVIE_DB_BASE_URL } from 'utils/constants';

type QueryParams = {
  api_key: string | undefined;
};

//
// **Deprecated** but leaving for now
// Now using a different API which should make getting episode data simpler
//

export const getSchedule = async (showId: number) => {
  const seasonsToFetch = await getActiveSeasons(showId);
  console.log('seasonsToFetch:', seasonsToFetch);

  // NEXT call getSeasonEpisodes here with the active seasons
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

        return activeSeasons;
      })
      .catch((err: Error) => {
        console.log('Axios error', err.message);
      })) || []
  );
};

// Get full episode details for one season
export const getSeasonEpisodes = async (showId: number, seasonNumbers: number[]) => {
  const queryParams: QueryParams = {
    api_key: process.env.REACT_APP_API_KEY,
  };

  return await seasonNumbers
    .filter((seasonNum) => !!seasonNum)
    .map(async (seasonNum) => {
      const url = `${MOVIE_DB_BASE_URL}/tv/${showId}/season/${seasonNum}`;

      return axios
        .get(url, {
          params: queryParams,
        })
        .then((res) => {
          const { data } = res;

          return data;
        })
        .catch((err: Error) => {
          console.log('Axios error', err.message);
        });
    });
};
