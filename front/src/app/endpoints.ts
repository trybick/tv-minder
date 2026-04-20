const { VITE_API } = import.meta.env;

export const ENDPOINTS = {
  THE_MOVIE_DB: 'https://api.themoviedb.org/3',
  TV_MINDER_SERVER:
    VITE_API === 'local'
      ? 'http://localhost:4500'
      : 'https://api.tv-minder.com',
  TV_MINDER_SERVER_V2: 'http://localhost:4600',
  GOOGLE_USER_INFO: 'https://www.googleapis.com/oauth2/v3/userinfo',
};
