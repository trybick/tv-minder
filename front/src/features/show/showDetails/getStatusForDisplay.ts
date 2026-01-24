import { type ShowStatus } from '~/store/tv/utils/formatting';

export const getStatusForDisplay = (status: ShowStatus | undefined) => {
  if (!status) {
    return null;
  }

  if (status.isEnded) {
    return { label: 'Ended', color: 'gray' } as const;
  }
  if (status.isActiveSeason) {
    return { label: 'Airing Now', color: 'green' } as const;
  }
  if (status.isPremieringSoon) {
    return { label: 'Premiering Soon', color: 'blue' } as const;
  }
  if (status.isInProduction) {
    return { label: 'In Production', color: 'orange' } as const;
  }

  return null;
};
