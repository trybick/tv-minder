import { useCallback } from 'react';

import placeholderImageLandscape from '~/assets/images/placeholder-image-landscape.png';
import placeholderImage from '~/assets/images/placeholder-image.png';

import { useIsMobile } from './useIsMobile';

const BASE_URL = 'https://image.tmdb.org/t/p/w342';
const HIGH_QUALITY_URL = 'https://image.tmdb.org/t/p/w780';

type Quality = 'low' | 'high';

type GetImageUrlParams = {
  path: string | undefined | null;
  quality?: Quality;
};

export const useImageUrl = () => {
  const isMobile = useIsMobile();
  const placeholder = isMobile ? placeholderImageLandscape : placeholderImage;

  const getImageUrl = useCallback(
    ({ path, quality = 'low' }: GetImageUrlParams) => {
      if (!path) return placeholder;
      const baseUrl = quality === 'high' ? HIGH_QUALITY_URL : BASE_URL;
      return `${baseUrl}${path}`;
    },
    [placeholder]
  );

  return { getImageUrl, placeholder };
};
