const desktopCalendarStyles = {
  // Height of each table row. Setting this height along with
  // <FullCalendar height="auto" /> seems like a good balance.
  '.fc-scrollgrid tbody:first-of-type tr': {
    height: '170px',
  },

  // Add vertical space between calendar events
  '.fc-daygrid-event-harness': {
    marginBottom: '4px',
  },

  // Day of the week headers background color
  '.fc-col-header-cell': {
    backgroundColor: 'gray.100 !important',
  },
  '.dark .fc-col-header-cell': {
    backgroundColor: '#1A202C !important',
  },

  // Set the "more" popover color which appears when there's more than four
  // events in a day.
  '.dark .fc-more-popover': {
    backgroundColor: '#1A202C !important',
  },
};

const mobileCalendarStyles = {
  // Day of the week headers background color
  '.fc-list-day-cushion': {
    backgroundColor: 'gray.300 !important',
  },
  '.dark .fc-list-day-cushion': {
    backgroundColor: 'gray.700 !important',
  },

  // Event hover color
  '.dark .fc .fc-list-event:hover td': {
    backgroundColor: '#333333 !important',
  },
};

const calendarStyles = {
  ...desktopCalendarStyles,
  ...mobileCalendarStyles,
};

export const globalCss = {
  ...calendarStyles,
};
