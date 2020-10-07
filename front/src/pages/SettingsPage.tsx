import React from 'react';
import { Avatar } from '@chakra-ui/core';

const SettingsPage: React.FC<{}> = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '25px' }}>
      <Avatar name="TV Minder User" size="2xl" src="https://bit.ly/broken-link" />
    </div>
  );
};

export default SettingsPage;
