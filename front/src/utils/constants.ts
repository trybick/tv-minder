import { IToast } from '@chakra-ui/core';

export const API = {
  THE_MOVIE_DB: 'https://api.themoviedb.org/3',
  // For Hacktoberfest, changing default API to deployed API so people don't have to start backend
  TV_MINDER: 'https://api.tv-minder.com',
  // TV_MINDER:
  // process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://api.tv-minder.com',
};

export const emailRegex = /^([^.@]+)(\.[^.@]+)*@([^.@]+\.)+([^.@]+)$/;

export const fallbackImage = 'https://www.placecage.com/g/82/123';

export const gAnalyticsID = 'UA-156066902-04';

// Used in 'SearchResult'
export const localWarningToastMessage: IToast = {
  title: 'Temporarily saving',
  description: 'Be sure to sign up to save permanently',
  status: 'warning',
  duration: 7000,
  isClosable: true,
  position: window.innerWidth > 767 ? 'bottom-right' : 'bottom',
};
