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
  // Smooth and consistent view transitions for show images
  '::view-transition-old(root)': {
    animationDuration: '0.25s',
    animationTimingFunction: 'ease-in-out',
  },
  '::view-transition-new(root)': {
    animationDuration: '0.25s',
    animationTimingFunction: 'ease-in-out',
  },
  // Specific styling for show image transitions
  '::view-transition-group(show-image)': {
    animationDuration: '0.3s',
    animationTimingFunction: 'ease-in-out',
  },
  '::view-transition-old(show-image)': {
    animationDuration: '0.3s',
    mixBlendMode: 'normal',
  },
  '::view-transition-new(show-image)': {
    animationDuration: '0.3s',
    mixBlendMode: 'normal',
  },
  // Prevent layout shift during transitions
  '::view-transition-image-pair(show-image)': {
    isolation: 'isolate',
  },
};

export const globalCss = {
  ...calendarStyles,
  ...viewTransitionStyles,
};
