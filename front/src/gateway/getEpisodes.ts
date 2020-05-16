import axios from 'axios';
import { MOVIE_DB_BASE_URL } from 'utils/constants';
import moment from 'moment';

type QueryParams = {
  api_key: string | undefined;
};

const queryParams: QueryParams = {
  api_key: process.env.REACT_APP_API_KEY,
};

//
// Using The Movie DB (first API)
// getShowsWithActiveSeasons --> getSeasonEpisodes --> calculate upcoming shows
//

export const getEpisodesForDisplay = async (showIds: number[]) => {
  const showsWithActiveSeasons = await getShowsWithActiveSeasons(showIds);
  // const fullEpisodeDataForSeasons = await getFullSeasonData(showIds, currentActiveSeasons);
  // const episodesForDisplay = calculateEpisodeDataForDisplay(fullEpisodeDataForSeasons);

  // return episodesForDisplay;
};

// Returns an array of shows with their active seasons
const getShowsWithActiveSeasons = async (showIds: number[]): Promise<any> => {
  const fullSeasonRequests = showIds.map((showId: any) =>
    axios.get(`${MOVIE_DB_BASE_URL}/tv/${showId}`, { params: queryParams })
  );

  const showsWithActiveSeasons = await axios
    .all(fullSeasonRequests)
    .then((res) => res.map((res) => res.data))
    .then((arrayOfSeasons) => {
      return arrayOfSeasons.map((season: any) => {
        const {
          last_episode_to_air: lastEpisodeToAir,
          name,
          next_episode_to_air: nextEpisodeToAir,
        } = season;

        const lastSeasonNumberToAir = lastEpisodeToAir?.season_number || null;
        const nextSeasonNumberToAir = nextEpisodeToAir?.season_number || null;
        const activeSeasons = [lastSeasonNumberToAir, nextSeasonNumberToAir].filter(Boolean);
        const isLastAndNextSameSeason =
          lastSeasonNumberToAir &&
          nextSeasonNumberToAir &&
          lastSeasonNumberToAir === nextSeasonNumberToAir;

        return isLastAndNextSameSeason
          ? { name, activeSeasons: [lastSeasonNumberToAir] }
          : { name, activeSeasons };
      });
    })
    .catch((err: Error) => {
      console.log('Axios error', err.message);
    });

  return showsWithActiveSeasons;
};

const getFullSeasonData = async (showId: number, showData: any) => {
  const { name, activeSeasons } = showData;

  const seasonRequests = activeSeasons.map((seasonNum: any) =>
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
    return (({
      air_date: airDate,
      episode_number: episodeNumber,
      season_number: seasonNumber,
    }) => ({
      date: airDate,
      title: `${fullSeasonData[0].name} S${seasonNumber} E${episodeNumber}`,
    }))(episode);
  });

  return episodesForDisplay;
};
