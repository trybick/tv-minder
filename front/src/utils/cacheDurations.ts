// How long to keep cached data
const cacheDurationDays = {
  calendar: 5,
  // My Shows should be lower so that Upcoming and Recent can always have accurate data
  myShows: 1,
  search: 5,
};

export default cacheDurationDays;
