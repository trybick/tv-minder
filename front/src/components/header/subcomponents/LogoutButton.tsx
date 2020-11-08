import React from 'react';
import { connect } from 'react-redux';
import { Button } from '@chakra-ui/core';
import { AppThunkDispatch, AppThunkPlainAction } from 'store';
import { setIsLoggedOutAction } from 'store/user/actions';
import { PlainFunction } from 'types/common';

interface OwnProps {
  closeHeader: PlainFunction;
}

interface DispatchProps {
  setIsLoggedOut: AppThunkPlainAction;
}

type Props = OwnProps & DispatchProps;

const LogoutButton = ({ closeHeader, setIsLoggedOut }: Props) => {
  const onLogout = () => {
    localStorage.removeItem('jwt');
    closeHeader();
    setIsLoggedOut();
  };

  return (
    <Button colorScheme="teal" onClick={onLogout} size="xs" variant="outline">
      Logout
    </Button>
  );
};

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
  setIsLoggedOut: () => dispatch(setIsLoggedOutAction()),
});

export default connect<{}, DispatchProps, OwnProps, {}>(null, mapDispatchToProps)(LogoutButton);
