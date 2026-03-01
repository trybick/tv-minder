import ReactGA from 'react-ga4';
import type { UaEventOptions } from 'react-ga4/types/ga4';

import { getIsProduction } from './env';

export const initAnalytics = (id: string) => {
  if (getIsProduction()) {
    ReactGA.initialize(id);
  }
};

export const trackPageview = (path: string) => {
  if (getIsProduction()) {
    ReactGA.send({ hitType: 'pageview', page: path });
  }
};

export const trackEvent = (options: UaEventOptions) => {
  if (getIsProduction()) {
    ReactGA.event(options);
  }
};

export const setAnalyticsUserId = (userId: string | null) => {
  if (getIsProduction()) {
    ReactGA.set({ userId });
  }
};
