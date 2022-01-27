import moment from 'moment';

export const maybePluralize = (count: number | number, noun: string, suffix = 's') =>
  `${noun}${count !== 1 ? suffix : ''}`;

export const addLeadingZero = (item: string) => String(item).padStart(2, '0');

// Manually calculate time from air date because using Moment's timefromNow results in showing
// 'X hours ago' and API data doesn't include the episode time so it would be inaccurate.
export const getTimeFromNowForLastAired = (inputDate: string) => {
  if (!inputDate) {
    return;
  }
  let timeFromNow;
  const daysDiff = Math.abs(moment().startOf('day').diff(inputDate, 'days'));
  const weeksDiff = moment.duration(daysDiff, 'days').weeks();
  const monthsDiff = moment.duration(daysDiff, 'days').months();
  const yearsDiff = moment.duration(daysDiff, 'days').years();

  if (daysDiff === 0) {
    timeFromNow = 'Today';
  } else if (daysDiff === 1) {
    timeFromNow = 'Yesterday';
  } else if (daysDiff < 7) {
    timeFromNow = `${daysDiff} days ago`;
  } else if (daysDiff < 28) {
    timeFromNow = `${weeksDiff} ${maybePluralize(weeksDiff, 'week')} ago`;
  } else if (daysDiff < 31) {
    timeFromNow = '1 month ago';
  } else if (daysDiff < 365) {
    timeFromNow = `${monthsDiff} ${maybePluralize(monthsDiff, 'month')} ago`;
  } else {
    timeFromNow = `${yearsDiff} ${maybePluralize(yearsDiff, 'year')} ago`;
  }

  return timeFromNow;
};

export const getTimeFromNowForNextAiring = (inputDate: string) => {
  if (!inputDate) {
    return;
  }
  let timeFromNow;
  const daysDiff = moment(inputDate).diff(moment().startOf('day'), 'days');
  const weeksDiff = moment.duration(daysDiff, 'days').weeks();
  const monthsDiff = moment.duration(daysDiff, 'days').months();
  const yearsDiff = moment.duration(daysDiff, 'days').years();

  if (daysDiff === 0) {
    timeFromNow = 'Today';
  } else if (daysDiff === 1) {
    timeFromNow = 'Tomorrow';
  } else if (daysDiff < 7) {
    timeFromNow = `In ${daysDiff} days`;
  } else if (daysDiff < 28) {
    timeFromNow = `In ${weeksDiff} ${maybePluralize(weeksDiff, 'week')}`;
  } else if (daysDiff < 31) {
    timeFromNow = 'In 1 month';
  } else if (daysDiff < 365) {
    timeFromNow = `In ${monthsDiff} ${maybePluralize(monthsDiff, 'month')}`;
  } else {
    timeFromNow = `In ${yearsDiff} ${maybePluralize(yearsDiff, 'year')}`;
  }

  return timeFromNow;
};
