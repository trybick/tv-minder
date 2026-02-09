import { flushSync } from 'react-dom';
import { useLocation } from 'wouter';

type ViewTransitionKind = 'route' | 'default';

type StartOptions = {
  kind?: ViewTransitionKind;
  skipImageTransition?: boolean;
};

type NavigateOptions = {
  state?: Record<string, unknown>;
  skipImageTransition?: boolean;
};

let activeTransition: ViewTransition | null = null;
let activeToken = 0;

const startViewTransition = (callback: () => void, options?: StartOptions) => {
  if (!document.startViewTransition) {
    callback();
    return null;
  }

  activeToken += 1;
  const token = activeToken;

  if (activeTransition) {
    activeTransition.skipTransition();
  }

  const kind: ViewTransitionKind = options?.kind ?? 'default';
  if (kind === 'route') {
    document.documentElement.dataset.viewTransitionKind = 'route';
  } else {
    delete document.documentElement.dataset.viewTransitionKind;
  }

  if (options?.skipImageTransition) {
    document.body.classList.add('skip-image-transition');
  } else {
    document.body.classList.remove('skip-image-transition');
  }

  const transition = document.startViewTransition(() => {
    flushSync(callback);
  });

  activeTransition = transition;

  transition.finished.finally(() => {
    if (token !== activeToken) {
      return;
    }

    activeTransition = null;
    delete document.documentElement.dataset.viewTransitionKind;
    document.body.classList.remove('skip-image-transition');
  });

  return transition;
};

export const applyViewTransition = (callback: () => void) => {
  startViewTransition(callback);
};

export const useNavigateWithAnimation = () => {
  const [, navigate] = useLocation();

  const navigateWithAnimation = (to: string, options?: NavigateOptions) => {
    startViewTransition(() => navigate(to, options), {
      kind: options?.skipImageTransition ? 'route' : 'default',
      skipImageTransition: options?.skipImageTransition,
    });
  };

  return navigateWithAnimation;
};
