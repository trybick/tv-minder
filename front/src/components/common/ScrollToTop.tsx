import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  // When the route changes, scroll to top of page to solve issue of Show page loading scrolled down
  useEffect(() => {
    // Allow the scroll the maintain when going back to My Shows page
    if (pathname !== '/my-shows') {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
