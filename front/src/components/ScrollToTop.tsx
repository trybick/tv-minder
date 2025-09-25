import { useEffect } from 'react';
import { useLocation } from 'wouter';

import { ROUTES } from '~/app/routes';

/**
  When the route changes, scroll to top of page to solve issue of Show page
  loading scrolled down.
*/
const ScrollToTop = () => {
  const [location] = useLocation();

  useEffect(() => {
    // Allow the scroll to maintain when going back to Manage page
    if (location !== ROUTES.MANAGE) {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return null;
};

export default ScrollToTop;
