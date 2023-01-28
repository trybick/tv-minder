const { REACT_APP_API } = process.env;

const ENDPOINTS = {
  THE_MOVIE_DB: 'https://api.themoviedb.org/3',
  TV_MINDER_SERVER:
    REACT_APP_API === 'local' ? 'http://localhost:5000' : 'https://api.tv-minder.com',
  GOOGLE_USER_INFO: 'https://www.googleapis.com/oauth2/v3/userinfo',
};

export default ENDPOINTS;
