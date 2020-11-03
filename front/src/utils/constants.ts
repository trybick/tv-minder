export const emailRegex = /^([^.@]+)(\.[^.@]+)*@([^.@]+\.)+([^.@]+)$/;
export const fallbackImage = 'https://www.placecage.com/g/82/123';
export const gAnalyticsID = 'UA-156066902-04';

const { REACT_APP_API, REACT_APP_GOOGLE_OAUTH_CLIENT_ID } = process.env;

export const API = {
  GOOGLE_0AUTH: REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
  THE_MOVIE_DB: 'https://api.themoviedb.org/3',
  TV_MINDER: REACT_APP_API === 'local' ? 'http://localhost:5000' : 'https://api.tv-minder.com',
};
