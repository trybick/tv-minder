const { VITE_API } = import.meta.env;

const ENDPOINTS = {
  THE_MOVIE_DB: 'https://api.themoviedb.org/3',
  TV_MINDER_SERVER: VITE_API === 'local' ? 'http://localhost:5000' : 'https://api.tv-minder.com',
  GOOGLE_USER_INFO: 'https://www.googleapis.com/oauth2/v3/userinfo',
};

export default ENDPOINTS;
