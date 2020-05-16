import axios from 'axios';
import { MOVIE_DB_BASE_URL } from 'utils/constants';
import { getShowColor } from 'utils/getShowColor';
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
  const fullEpisodeDataForSeasons = await getFullSeasonData(showsWithActiveSeasons);
  const episodesForDisplay = calculateEpisodeDataForDisplay(fullEpisodeDataForSeasons);

  return episodesForDisplay;
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
          id,
          name,
          next_episode_to_air: nextEpisodeToAir,
        } = season;
        const lastSeasonNumberToAir = lastEpisodeToAir?.season_number || null;
        const nextSeasonNumberToAir = nextEpisodeToAir?.season_number || null;
        const isLastAndNextEpisodeInSameSeason =
          lastSeasonNumberToAir &&
          nextSeasonNumberToAir &&
          lastSeasonNumberToAir === nextSeasonNumberToAir;

        const activeSeasons = isLastAndNextEpisodeInSameSeason
          ? [lastSeasonNumberToAir]
          : [lastSeasonNumberToAir, nextSeasonNumberToAir].filter(Boolean);

        return { activeSeasons, id, name };
      });
    })
    .catch((err: Error) => {
      console.log('Axios error', err.message);
    });

  return showsWithActiveSeasons;
};

const getFullSeasonData = async (showsWithActiveSeasons: any) => {
  const mappedFullSeasonData = showsWithActiveSeasons.map(async (activeShow: any) => {
    const { id, name, activeSeasons } = activeShow;

    const seasonRequests = activeSeasons.map((seasonNum: any) =>
      axios.get(`${MOVIE_DB_BASE_URL}/tv/${id}/season/${seasonNum}`, { params: queryParams })
    );

    const fullSeasonData = await axios
      .all(seasonRequests)
      // @ts-ignore
      .then((res) => res.map((res) => res.data));

    fullSeasonData.forEach((fullSeason: any) => {
      fullSeason.name = name;
    });

    return fullSeasonData;
  });

  return Promise.all(mappedFullSeasonData);
};

const calculateEpisodeDataForDisplay = (fullSeasonData: any) => {
  const showWithEpisodes = fullSeasonData.flat().map((season: any) => ({
    episodes: season.episodes,
    name: season.name,
  }));

  const episodesWithName = showWithEpisodes
    .map((show: any) =>
      show.episodes.map((episode: any) => ({ ...episode, color: show.color, showName: show.name }))
    )
    .flat();

  const recentEpisodes = episodesWithName.filter((episode: any) =>
    moment(moment(episode.air_date)).isBetween(
      moment().subtract(3, 'months'),
      moment().add(3, 'months')
    )
  );

  const episodesForDisplay = recentEpisodes?.map((episode: any) => {
    return (({
      air_date: airDate,
      episode_number: episodeNumber,
      season_number: seasonNumber,
      show_id: showId,
      showName,
    }) => ({
      color: getShowColor(showId),
      date: airDate,
      title: `${showName} S${seasonNumber} E${episodeNumber}`,
    }))(episode);
  });

  return episodesForDisplay;
};
