export const MOVIE_DB_URL = 'https://api.themoviedb.org/3/search/tv';

export const baseUrl =
  process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://tv-minder.com';

export const emailRegex = /^([^.@]+)(\.[^.@]+)*@([^.@]+\.)+([^.@]+)$/;
