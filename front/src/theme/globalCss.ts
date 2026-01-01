const customColors = {
  darkBg: '#1A202C',
  darkHover: '#333333',
};

const whiteWithOpacity = (opacity: number) => `rgba(255, 255, 255, ${opacity})`;

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
    backgroundColor: `${customColors.darkBg} !important`,
  },

  // This popover appears when there's more than four events in a day
  '.dark .fc-more-popover': {
    backgroundColor: `${customColors.darkBg} !important`,
  },

  // Subtle gray colors instead of pure white
  '.dark': {
    '--fc-border-color': `${whiteWithOpacity(0.2)} !important`,
    '--fc-page-bg-color': `${whiteWithOpacity(0.2)} !important`,
  },
  // Header day labels (Sun, Mon, etc.)
  '.dark .fc-col-header-cell-cushion': {
    color: `${whiteWithOpacity(0.6)} !important`,
  },
  // Day numbers (1, 2, etc.)
  '.dark .fc-daygrid-day-number': {
    color: `${whiteWithOpacity(0.7)} !important`,
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
    backgroundColor: `${customColors.darkHover} !important`,
  },
};

const calendarStyles = {
  ...desktopCalendarStyles,
  ...mobileCalendarStyles,
};

const viewTransitionStyles = {
  'body.skip-image-transition *': {
    viewTransitionName: 'none !important',
  },
};

export const globalCss = {
  ...calendarStyles,
  ...viewTransitionStyles,
};
