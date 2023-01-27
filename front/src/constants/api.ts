const { REACT_APP_API } = process.env;

export const API = {
  THE_MOVIE_DB: 'https://api.themoviedb.org/3',
  TV_MINDER: REACT_APP_API === 'local' ? 'http://localhost:5000' : 'https://api.tv-minder.com',
  GOOGLE_USER_INFO: 'https://www.googleapis.com/oauth2/v3/userinfo',
};
