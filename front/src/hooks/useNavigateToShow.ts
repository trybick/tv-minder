import { MouseEvent, useCallback } from 'react';

import { ROUTES } from '~/app/routes';
import { useAppDispatch } from '~/store';
import { SET_IS_LOADING_SHOW_DETAILS } from '~/store/tv/actions';

import { useNavigateWithAnimation } from './useNavigateWithAnimation';

export type ShowNavigationState = {
  showId: number;
  name: string;
  posterSource: string;
};

export const useNavigateToShow = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigateWithAnimation();

  const navigateToShow = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, state: ShowNavigationState) => {
      e.preventDefault();
      dispatch({ type: SET_IS_LOADING_SHOW_DETAILS, payload: true });
      navigate(`${ROUTES.SHOW}/${state.showId}`, { state });
    },
    [dispatch, navigate]
  );

  return navigateToShow;
};
