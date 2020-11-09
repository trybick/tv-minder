import React from 'react';
import { IconButton, useColorMode } from '@chakra-ui/core';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const ToggleColorModeButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="toggle color mode"
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      ml=" 12px"
      onClick={toggleColorMode}
    />
  );
};

export default ToggleColorModeButton;
