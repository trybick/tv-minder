import { IconButton } from '@chakra-ui/react';
import { IoMoon, IoSunny } from 'react-icons/io5';
import { useColorMode, useColorModeValue } from 'components/ui/color-mode';
const ToggleColorModeButton = () => {
  const { toggleColorMode } = useColorMode();

  return (
    <IconButton
      alignSelf="center"
      aria-label="toggle color mode"
      mr="14px"
      onClick={toggleColorMode}
      size="sm"
    >
      {useColorModeValue(<IoMoon />, <IoSunny />)}
    </IconButton>
  );
};

export default ToggleColorModeButton;
