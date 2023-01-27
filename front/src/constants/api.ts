const { REACT_APP_API, REACT_APP_GOOGLE_OAUTH_CLIENT_ID } = process.env;

export const API = {
  GOOGLE_0AUTH: REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_USER_INFO: 'https://www.googleapis.com/oauth2/v3/userinfo',
  THE_MOVIE_DB: 'https://api.themoviedb.org/3',
  TV_MINDER: REACT_APP_API === 'local' ? 'http://localhost:5000' : 'https://api.tv-minder.com',
};
