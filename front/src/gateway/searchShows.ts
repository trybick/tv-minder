import axios, { CancelTokenSource } from 'axios';
import { MOVIE_DB_URL } from 'utils/constants';

//
// Our app calls searchShows
// It uses a request creator for results caching and cancel tokens
//

type RequestConfig = { api_key: string | undefined; query: string };
const cachedResults: any = {};

export const searchShows = async (query: string) => {
  const requestConfig: RequestConfig = {
    api_key: process.env.REACT_APP_API_KEY,
    query,
  };

  const { results, total_results: totalResults } =
    (await makeCachedRequest(MOVIE_DB_URL, requestConfig)) || {};

  return results ? { results, totalResults } : { results: null };
};

const makeCachedRequestCreator = () => {
  let cancelToken: CancelTokenSource;

  return (url: string, requestConfig: RequestConfig) => {
    if (cancelToken) {
      cancelToken.cancel();
    }
    cancelToken = axios.CancelToken.source();

    return cachedResults[requestConfig.query]
      ? cachedResults[requestConfig.query]
      : axios
          .get(url, {
            cancelToken: cancelToken.token,
            params: requestConfig,
          })
          .then((res) => {
            const { data } = res;
            cachedResults[requestConfig.query] = data;

            return data;
          })
          .catch((err: Error) => {
            if (axios.isCancel(err)) {
              console.log('Successfully canceled request');
            } else {
              console.log('General Axios error', err.message);
            }
          });
  };
};

const makeCachedRequest = makeCachedRequestCreator();
