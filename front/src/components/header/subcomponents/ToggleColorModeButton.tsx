import React from 'react';
import { IconButton, useColorMode } from '@chakra-ui/core';

const ToggleColorModeButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="toggle color mode"
      icon={colorMode === 'light' ? 'moon' : 'sun'}
      ml=" 12px"
      onClick={toggleColorMode}
    />
  );
};

export default ToggleColorModeButton;
