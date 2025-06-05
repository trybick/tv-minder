import placeholderImageLandscape from '~/assets/images/placeholder-image-landscape.png';
import placeholderImage from '~/assets/images/placeholder-image.png';
import { useIsMobile } from '~/hooks/useIsMobile';

export const baseUrl = 'https://image.tmdb.org/t/p/w342';
const higherQualityUrl = 'https://image.tmdb.org/t/p/w780';

export const createImageUrl = (
  path: string | undefined | null,
  higherQuality = false
) => {
  const isMobile = useIsMobile();

  return path
    ? `${higherQuality ? higherQualityUrl : baseUrl}${path}`
    : isMobile
      ? placeholderImageLandscape
      : placeholderImage;
};
