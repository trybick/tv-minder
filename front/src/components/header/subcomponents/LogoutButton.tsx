import React from 'react';
import { connect } from 'react-redux';
import { Button } from '@chakra-ui/core';
import { AppThunkPlainAction, AppThunkDispatch } from 'store';
import { setIsLoggedOutAction } from 'store/user/actions';

interface DispatchProps {
  setIsLoggedOut: AppThunkPlainAction;
}

const LogoutButton = ({ setIsLoggedOut }: DispatchProps) => {
  function onLogout() {
    localStorage.removeItem('jwt');
    setIsLoggedOut();
  }

  return (
    <Button variant="outline" onClick={onLogout}>
      Logout
    </Button>
  );
};

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
  setIsLoggedOut: () => dispatch(setIsLoggedOutAction()),
});

export default connect(null, mapDispatchToProps)(LogoutButton);
