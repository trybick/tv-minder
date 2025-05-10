import { useCallback } from 'react';
import { useLocation } from 'wouter';

export const useNavigateWithAnimation = () => {
  const [, navigate] = useLocation();

  const navigateWithAnimation = useCallback(
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

  return navigateWithAnimation;
};
