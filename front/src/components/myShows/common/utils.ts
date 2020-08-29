import moment from 'moment';
import { maybePluralize } from 'utils/formatting';

// Manually calculate time from air date because using Moment's timefromNow results in showing
// 'X hours ago' and API data doesn't include the episode time so it would be inaccurate.
export const getTimeFromNowForUpcoming = (airDate: string) => {
  let timeFromNow;
  const daysDiff = moment(airDate).diff(moment().startOf('day'), 'days');
  const weeksDiff = moment.duration(daysDiff, 'days').weeks();
  const monthsDiff = moment.duration(daysDiff, 'days').months();

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
  } else {
    timeFromNow = `In ${monthsDiff} ${maybePluralize(monthsDiff, 'month')}`;
  }

  return timeFromNow;
};

export const getTimeFromNowForRecent = (airDate: string) => {
  let timeFromNow;
  const daysDiff = moment(moment().startOf('day')).diff(airDate, 'days');
  const weeksDiff = moment.duration(daysDiff, 'days').weeks();
  const monthsDiff = moment.duration(daysDiff, 'days').months();

  if (daysDiff === 1) {
    timeFromNow = 'Yesterday';
  } else if (daysDiff < 7) {
    timeFromNow = `${daysDiff} days ago`;
  } else if (daysDiff < 28) {
    timeFromNow = `${weeksDiff} ${maybePluralize(weeksDiff, 'week')} ago`;
  } else if (daysDiff < 31) {
    timeFromNow = 'In 1 month';
  } else {
    timeFromNow = `${monthsDiff} ${maybePluralize(monthsDiff, 'month')} ago`;
  }

  return timeFromNow;
};
