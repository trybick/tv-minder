export const API = {
  THE_MOVIE_DB: 'https://api.themoviedb.org/3',
  TV_MINDER:
    process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://api.tv-minder.com',
};

export const emailRegex = /^([^.@]+)(\.[^.@]+)*@([^.@]+\.)+([^.@]+)$/;
