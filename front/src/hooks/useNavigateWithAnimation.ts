import { useCallback } from 'react';
import { useLocation } from 'wouter';

type NavigateOptions = {
  /* State (data) to pass to the new page */
  state?: Record<string, unknown>;
  /* Whether to skip the image transition */
  skipImageTransition?: boolean;
};

export const useNavigateWithAnimation = () => {
  const [, navigate] = useLocation();

  const navigateWithAnimation = useCallback(
    (to: string, options?: NavigateOptions) => {
      if (!document.startViewTransition) {
        navigate(to, options);
        return;
      }

      if (options?.skipImageTransition) {
        document.body.classList.add('skip-image-transition');
      }

      const transition = document.startViewTransition(() => {
        navigate(to, options);
      });

      transition.finished.finally(() => {
        document.body.classList.remove('skip-image-transition');
      });
    },
    [navigate]
  );

  return navigateWithAnimation;
};
