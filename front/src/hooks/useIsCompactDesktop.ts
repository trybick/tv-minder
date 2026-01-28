import { useLayoutEffect, useState } from 'react';

// Compact desktop: between mobile (768px) and full desktop (1024px)
const query = '(min-width: 769px) and (max-width: 1024px)';

export function useIsCompactDesktop(): boolean {
  const calculate = (): boolean => window.matchMedia(query).matches;

  const [isCompact, setIsCompact] = useState<boolean>(calculate());

  useLayoutEffect(() => {
    const matchMedia = window.matchMedia(query);
    const handleChange = () => setIsCompact(calculate());

    handleChange();

    matchMedia.addEventListener('change', handleChange);
    return () => matchMedia.removeEventListener('change', handleChange);
  }, []);

  return isCompact;
}
