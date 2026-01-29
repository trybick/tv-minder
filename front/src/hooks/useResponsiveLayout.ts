import { useLayoutEffect, useState } from 'react';

const mobileQuery = '(max-width: 768px)';
const compactDesktopQuery = '(min-width: 769px) and (max-width: 1024px)';

type ResponsiveLayout = {
  isMobile: boolean;
  isCompactDesktop: boolean;
};

export const useResponsiveLayout = (): ResponsiveLayout => {
  const calculate = (): ResponsiveLayout => ({
    isMobile: window.matchMedia(mobileQuery).matches,
    isCompactDesktop: window.matchMedia(compactDesktopQuery).matches,
  });

  const [state, setState] = useState<ResponsiveLayout>(calculate());

  useLayoutEffect(() => {
    const mobileMatch = window.matchMedia(mobileQuery);
    const compactDesktopMatch = window.matchMedia(compactDesktopQuery);
    const handleChange = () => setState(calculate());

    handleChange();

    mobileMatch.addEventListener('change', handleChange);
    compactDesktopMatch.addEventListener('change', handleChange);

    return () => {
      mobileMatch.removeEventListener('change', handleChange);
      compactDesktopMatch.removeEventListener('change', handleChange);
    };
  }, []);

  return state;
};
