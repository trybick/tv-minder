// How long to keep cached data
const cacheDurationDays = {
  calendar: 1,
  // My Shows should be lower so that Upcoming and Recent can always have accurate data
  myShows: 1,
  popularShows: 5,
  search: 5,
};

export default cacheDurationDays;
