import axios, { CancelTokenSource } from 'axios';

const cachedResults: any = {};

const makeRequestCreator = () => {
  let cancelToken: CancelTokenSource;

  return (url: string, requestConfig: any) => {
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
            cachedResults[requestConfig.query] = res.data.results;

            return res.data.results;
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
