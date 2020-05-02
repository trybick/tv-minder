import { AxiosError } from 'axios';

// Sourced from https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253

export default function handleErrors(error: AxiosError) {
  if (error.response) {
    /*
     * The request was made and the server responded with a
     * status code that falls out of the range of 2xx
     */
    console.log('error status', error.response.status);
    console.log('error data:', error.response.data);
    console.log('error headers:', error.response.headers);
  } else if (error.request) {
    /*
     * The request was made but no response was received, `error.request`
     * is an instance of XMLHttpRequest in the browser and an instance
     * of http.ClientRequest in Node.js
     */
    console.log(error.request);
  } else {
    // Something happened in setting up the request and triggered an Error
    console.log('Error', error.message);
  }
  console.log('error config', error.config);
}
