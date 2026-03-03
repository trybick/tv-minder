import { type ShowStatus } from '~/store/tv/utils/formatting';

export const getStatusForDisplay = (status: ShowStatus | undefined) => {
  if (!status) {
    return null;
  }

  if (status.isEnded) {
    return { label: 'Show Ended', color: 'gray' } as const;
  }
  if (status.isActiveSeason) {
    return { label: 'Show Airing Now', color: 'green' } as const;
  }
  if (status.isPremieringSoon) {
    return { label: 'Show Premiering Soon', color: 'blue' } as const;
  }
  if (status.isInProduction) {
    return { label: 'Show In Production', color: 'orange' } as const;
  }

  return null;
};
