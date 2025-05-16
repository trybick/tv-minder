import moment from 'moment';

export const isDateWithinRecentRange = (date: string | undefined): boolean => {
  if (!date) return false;
  return moment(date).isBetween(
    moment().subtract(1, 'months'),
    moment().add(1, 'months')
  );
};
