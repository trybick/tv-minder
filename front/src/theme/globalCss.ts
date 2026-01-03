const customColors = {
  darkBg: '#1A202C',
  darkHover: '#333333',
};

const whiteWithOpacity = (opacity: number) => `rgba(255, 255, 255, ${opacity})`;

const desktopCalendarStyles = {
  // Height of each table row. Works with `height: auto` on <FullCalendar>.
  '.fc-scrollgrid tbody:first-of-type tr': {
    height: 'clamp(90px, 15vh, 190px)',
  },

  // Add vertical space between calendar events
  '.fc-daygrid-event-harness': {
    marginBottom: '4px',
  },

  '.fc-col-header-cell': {
    backgroundColor: `${customColors.darkBg} !important`,
  },

  // This popover appears when there's more than four events in a day
  '.fc-more-popover': {
    backgroundColor: `${customColors.darkBg} !important`,
  },

  // Subtle gray colors instead of pure white
  ':root': {
    '--fc-border-color': `${whiteWithOpacity(0.2)} !important`,
    '--fc-page-bg-color': `${whiteWithOpacity(0.2)} !important`,
  },
  // Header day labels (Sun, Mon, etc.)
  '.fc-col-header-cell-cushion': {
    color: `${whiteWithOpacity(0.6)} !important`,
  },
  // Day numbers (1, 2, etc.)
  '.fc-daygrid-day-number': {
    color: `${whiteWithOpacity(0.7)} !important`,
  },
};

const mobileCalendarStyles = {
  '.fc-list-day-cushion': {
    backgroundColor: 'gray.700 !important',
  },

  // Event hover color
  '.fc .fc-list-event:hover td': {
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
