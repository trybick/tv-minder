import { useEffect, useRef } from 'react';

import { createImageUrl } from '~/utils/createImageUrl';

import { useIsMobile } from './useIsMobile';

/**
 * Preloads backdrop images for mobile show pages.
 * Only runs on mobile since desktop uses poster images instead.
 */
export const usePreloadBackdrops = (
  backdropPaths: (string | null | undefined)[]
) => {
  const isMobile = useIsMobile();
  const preloadedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    backdropPaths.forEach(path => {
      if (path && !preloadedRef.current.has(path)) {
        preloadedRef.current.add(path);
        const img = new Image();
        img.src = createImageUrl(path, true, true);
      }
    });
  }, [isMobile, backdropPaths]);
};
