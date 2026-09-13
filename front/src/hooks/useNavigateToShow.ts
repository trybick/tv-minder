import { type MouseEvent } from 'react';

import { ROUTES } from '~/app/routes';
import { useAppDispatch } from '~/store';
import { setIsLoadingShowDetails } from '~/store/tv/actions';
import { useNavigateWithAnimation } from '~/utils/viewTransition';

export type ShowNavigationState = {
  showId: number;
  name: string;
  posterSource: string;
};

export const useNavigateToShow = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigateWithAnimation();

  const navigateToShow = (
    e: MouseEvent<HTMLAnchorElement>,
    state: ShowNavigationState
  ) => {
    e.preventDefault();

    dispatch((innerDispatch, getState) => {
      if (!getState().tv.showDetails[state.showId]) {
        innerDispatch(setIsLoadingShowDetails(true));
      }
    });
    navigate(`${ROUTES.SHOW}/${state.showId}`, { state });
  };

  return navigateToShow;
};
