import placeholderImageLarge from '~/images/placeholder-image-large.png';
import placeholderImage from '~/images/placeholder-image.png';

export const imagePath342 = 'https://image.tmdb.org/t/p/w342';

export const fallbackImagePath = placeholderImage;
export const fallbackImagePathLarge = placeholderImageLarge;

export const createImageUrl = (
  path: string | undefined | null,
  useLargeFallback = false
) => {
  if (!path) {
    return useLargeFallback ? fallbackImagePathLarge : fallbackImagePath;
  }
  return `${imagePath342}${path}`;
};
