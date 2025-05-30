import { useIsMobile } from '~/hooks/useIsMobile';
import placeholderImageLandscape from '~/images/placeholder-image-landscape.png';
import placeholderImage from '~/images/placeholder-image.png';

export const baseUrl = 'https://image.tmdb.org/t/p/w342';

export const createImageUrl = (path: string | undefined | null) => {
  const isMobile = useIsMobile();

  return path
    ? `${baseUrl}${path}`
    : isMobile
      ? placeholderImageLandscape
      : placeholderImage;
};
