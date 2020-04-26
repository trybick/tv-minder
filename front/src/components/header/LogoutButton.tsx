import React from 'react';
import { Button } from '@chakra-ui/core';

function onLogout() {
  localStorage.removeItem('jwt');
  window.location.reload();
}

const LogoutButton = () => (
  <Button variant="outline" onClick={onLogout}>
    Logout
  </Button>
);

export default LogoutButton;
