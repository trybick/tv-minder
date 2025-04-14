import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

//
// After updating theme, run this command to update autocomplete typings
// npx @chakra-ui/cli typegen ./src/theme.ts
//

//
// Calendar styles
//
const calendarStyles = {
  // Add vertical space between calendar events
  '.fc-daygrid-event-harness': {
    marginBottom: '4px',
  },

  // Table row height. Setting this height along with <FullCalendar height="auto" /> seems like a good balance
  '.fc-scrollgrid tbody:first-of-type tr': {
    height: '170px',
  },
};

const darkModeCalendarStyles = {
  // day of the week headers, "more" popover, mobile day of the week headers
  '.dark .fc-col-header-cell, .dark .fc-more-popover, .dark .fc-list-day-cushion': {
    backgroundColor: '#1A202C !important',
  },

  // Event hover color on mobile
  '.dark .fc .fc-list-event:hover td': {
    backgroundColor: '#333333 !important',
  },
};

const customConfig = defineConfig({
  globalCss: {
    ...calendarStyles,
    ...darkModeCalendarStyles,
  },
  theme: {
    tokens: {
      colors: {
        black: { value: '#333333' },
        darkBlack: { value: '#1A202C' },
        white: { value: '#fff' },
        primary: { value: '#0099DB' },
        secondary: { value: '#034A85' },
        mode: {
          light: {
            primary: { value: '#659bc7' },
            secondary: { value: '#034A85' },
          },
          dark: {
            primary: { value: '#659bc7' },
            secondary: { value: '#0099DB' },
          },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
