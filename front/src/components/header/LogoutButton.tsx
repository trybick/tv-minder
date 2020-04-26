import React from 'react';
import { Button } from '@chakra-ui/core';

const LogoutButton = () => {
  const onLogout = () => {
    localStorage.removeItem('jwt');
    window.location.reload();
  };

  return (
    <>
      <Button variant="outline" onClick={onLogout}>
        Logout
      </Button>
    </>
  );
};

export default LogoutButton;
