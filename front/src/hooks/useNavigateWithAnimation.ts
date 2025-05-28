import { useCallback } from 'react';
import { useLocation } from 'wouter';

export const useNavigateWithAnimation = () => {
  const [, navigate] = useLocation();

  const navigateWithAnimation = useCallback(
    (to: string, options?: { state?: Record<string, unknown> }) => {
      if (!document.startViewTransition) {
        navigate(to, options);
        return;
      }

      document.startViewTransition(() => {
        navigate(to, options);
      });
    },
    [navigate]
  );

  return navigateWithAnimation;
};
