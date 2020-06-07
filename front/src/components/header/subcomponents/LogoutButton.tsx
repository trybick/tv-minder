import React from 'react';
import { connect } from 'react-redux';
import { Button } from '@chakra-ui/core';
import { AppThunkPlainAction, AppThunkDispatch } from 'store';
import { setIsLoggedOutAction } from 'store/user/actions';

interface OwnProps {
  closeHeader: () => void;
}

interface DispatchProps {
  setIsLoggedOut: AppThunkPlainAction;
}

type Props = OwnProps & DispatchProps;

const LogoutButton = ({ closeHeader, setIsLoggedOut }: Props) => {
  function onLogout() {
    localStorage.removeItem('jwt');
    closeHeader();
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

export default connect<{}, DispatchProps, OwnProps, {}>(null, mapDispatchToProps)(LogoutButton);
