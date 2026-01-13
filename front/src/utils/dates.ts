import { dayjs } from './dayjs';

export const isDateWithinOneMonth = (
  date: string | null | undefined
): boolean => {
  if (!date) return false;
  return dayjs(date).isBetween(
    dayjs().subtract(1, 'month'),
    dayjs().add(1, 'month')
  );
};
