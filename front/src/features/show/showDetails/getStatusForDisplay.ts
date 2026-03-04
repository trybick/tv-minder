import { type ShowStatus } from '~/store/tv/utils/formatting';

export const getStatusForDisplay = (status: ShowStatus | undefined) => {
  if (!status) {
    return null;
  }

  if (status.isEnded) {
    return { label: 'Show Ended', color: 'red' } as const;
  }
  if (status.isActiveSeason) {
    return { label: 'Airing Now', color: 'green' } as const;
  }
  if (status.isPremieringSoon) {
    return { label: 'Premiering Soon', color: 'purple' } as const;
  }
  if (status.isInProduction) {
    return { label: 'In Production', color: 'yellow' } as const;
  }

  return null;
};
