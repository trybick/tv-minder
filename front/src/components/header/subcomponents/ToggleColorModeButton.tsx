import { IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const ToggleColorModeButton = () => {
  const { toggleColorMode } = useColorMode();

  return (
    <IconButton
      alignSelf="center"
      aria-label="toggle color mode"
      icon={useColorModeValue(<MoonIcon />, <SunIcon />)}
      mr="14px"
      onClick={toggleColorMode}
      size="sm"
    />
  );
};

export default ToggleColorModeButton;
