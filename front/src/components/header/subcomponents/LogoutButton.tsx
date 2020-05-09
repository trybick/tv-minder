import React from 'react';
import { connect } from 'react-redux';
import { Button } from '@chakra-ui/core';
import { setIsLoggedOutAction } from 'store/user/actions';

interface DispatchProps {
  setIsLoggedOut: typeof setIsLoggedOutAction;
}

const LogoutButton = ({ setIsLoggedOut }: DispatchProps) => {
  function onLogout() {
    localStorage.removeItem('jwt');
    setIsLoggedOut();
    // Using a manual reload here. Otherwise search results continue to show after logout.
    window.location.reload();
  }

  return (
    <Button variant="outline" onClick={onLogout}>
      Logout
    </Button>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  setIsLoggedOut: () => dispatch(setIsLoggedOutAction()),
});

export default connect(null, mapDispatchToProps)(LogoutButton);
