import React from 'react';
import { IconButton, useColorMode } from '@chakra-ui/core';

const ToggleColorModeButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="toggle color mode"
      ml=" 12px"
      onClick={toggleColorMode}
      icon={colorMode === 'light' ? 'moon' : 'sun'}
    />
  );
};

export default ToggleColorModeButton;
