import { useCallback } from 'react';
import { useLocation } from 'wouter';

export const useViewTransition = () => {
  const [, navigate] = useLocation();

  const navigateWithTransition = useCallback(
    (to: string) => {
      if (!document.startViewTransition) {
        navigate(to);
        return;
      }

      document.startViewTransition(() => {
        navigate(to);
      });
    },
    [navigate]
  );

  return navigateWithTransition;
};
