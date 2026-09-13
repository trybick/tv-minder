import { flushSync } from 'react-dom';
import { useLocation } from 'wouter';

type ViewTransitionKind = 'route' | 'image' | 'default';

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
  if (kind === 'default') {
    delete document.documentElement.dataset.viewTransitionKind;
  } else {
    document.documentElement.dataset.viewTransitionKind = kind;
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

export const afterViewTransition = (callback: () => void) => {
  if (!activeTransition) {
    callback();
    return;
  }

  activeTransition.finished.finally(callback);
};

export const SHOW_IMAGE_TRANSITION_CLASS = 'show-image';

export const getShowImageTransitionName = (showId: number) => {
  return `show-image-${showId}`;
};

export const applyViewTransition = (callback: () => void) => {
  startViewTransition(callback);
};

export const useNavigateWithAnimation = () => {
  const [, navigate] = useLocation();

  const navigateWithAnimation = (to: string, options?: NavigateOptions) => {
    startViewTransition(() => navigate(to, options), {
      kind: options?.skipImageTransition ? 'route' : 'image',
      skipImageTransition: options?.skipImageTransition,
    });
  };

  return navigateWithAnimation;
};
