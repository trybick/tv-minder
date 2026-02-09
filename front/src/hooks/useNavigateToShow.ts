import { type MouseEvent } from 'react';

import { ROUTES } from '~/app/routes';
import { useAppDispatch } from '~/store';
import { SET_IS_LOADING_SHOW_DETAILS } from '~/store/tv/actions';
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
    // Preventing default prevents the link's href from being triggered
    e.preventDefault();

    dispatch({ type: SET_IS_LOADING_SHOW_DETAILS, payload: true });
    navigate(`${ROUTES.SHOW}/${state.showId}`, { state });
  };

  return navigateToShow;
};
