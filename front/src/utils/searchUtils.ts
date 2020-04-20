import axios, { CancelTokenSource } from 'axios';

type RequestConfig = { api_key: string | undefined; query: string };

const cachedResults: any = {};

const makeRequestCreator = () => {
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
            const {
              data: { results, total_results: totalResults },
            } = res;
            cachedResults[requestConfig.query] = results;

            return { results, totalResults };
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

export const makeRequest = makeRequestCreator();
