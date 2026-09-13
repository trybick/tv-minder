import ReactGA from 'react-ga4';

import { getIsProduction } from '~/utils/env';

type EventOptions = Exclude<Parameters<typeof ReactGA.event>[0], string>;

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

export const trackEvent = (options: EventOptions) => {
  if (getIsProduction()) {
    ReactGA.event(options);
  }
};

export const setAnalyticsUserId = (userId: string | null) => {
  if (getIsProduction()) {
    ReactGA.set({ userId });
  }
};
