export const SET_IS_LOGGED_IN_TRUE = 'SET_IS_LOGGED_IN_TRUE';
export const SET_IS_LOGGED_IN_FALSE = 'SET_IS_LOGGED_IN_FALSE';

export function setIsLoggedInAction() {
  return (dispatch: any) => {
    dispatch({
      type: SET_IS_LOGGED_IN_TRUE,
    });
  };
}

export function setIsLoggedOutAction() {
  return (dispatch: any) => {
    dispatch({
      type: SET_IS_LOGGED_IN_FALSE,
    });
  };
}
