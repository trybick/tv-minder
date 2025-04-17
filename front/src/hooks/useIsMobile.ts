import { useLayoutEffect, useState } from 'react';

// Modified from https://usehooks-ts.com/react-hook/use-media-query

const query = '(max-width: 768px)';

export function useIsMobile(): boolean {
  const calculateIsMobile = (): boolean => window.matchMedia(query).matches;

  const [isMobile, setIsMobile] = useState<boolean>(calculateIsMobile());

  useLayoutEffect(() => {
    const matchMedia = window.matchMedia(query);
    const handleChange = () => setIsMobile(calculateIsMobile());

    // Triggered at the first client-side load and if query changes
    handleChange();

    matchMedia.addEventListener('change', handleChange);
    return () => matchMedia.removeEventListener('change', handleChange);
  }, []);

  return isMobile;
}
