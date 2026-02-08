import { flushSync } from 'react-dom';

export const applyViewTransition = (callback: () => void) => {
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      flushSync(callback);
    });
  } else {
    callback();
  }
};
