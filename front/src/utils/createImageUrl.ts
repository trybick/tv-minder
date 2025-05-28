import placeholderImage from '~/images/placeholder-image.png';

export const baseUrl = 'https://image.tmdb.org/t/p/w342';

export const createImageUrl = (path: string | undefined | null) => {
  return path ? `${baseUrl}${path}` : placeholderImage;
};
