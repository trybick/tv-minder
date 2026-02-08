import { flushSync } from 'react-dom';
import { useLocation } from 'wouter';

type NavigateOptions = {
  /* State (data) to pass to the new page */
  state?: Record<string, unknown>;
  /* Whether to skip the image transition */
  skipImageTransition?: boolean;
};

let activeTransition: ViewTransition | null = null;

export const useNavigateWithAnimation = () => {
  const [, navigate] = useLocation();

  const navigateWithAnimation = (to: string, options?: NavigateOptions) => {
    if (!document.startViewTransition) {
      navigate(to, options);
      return;
    }

    if (activeTransition) {
      activeTransition.skipTransition();
    }

    if (options?.skipImageTransition) {
      document.body.classList.add('skip-image-transition');
    }

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        navigate(to, options);
      });
    });

    activeTransition = transition;

    transition.finished.finally(() => {
      activeTransition = null;
      document.body.classList.remove('skip-image-transition');
    });
  };

  return navigateWithAnimation;
};
