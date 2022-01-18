import React from 'react';
import {
  Flex,
  Image,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  useColorMode,
} from '@chakra-ui/react';
import clock from 'images/clock.png';

const WelcomeMessage = () => {
  const { colorMode } = useColorMode();
  return (
    <Flex justifyContent="center" m="20px 35px 0">
      <StatGroup
        alignItems="center"
        bg={colorMode === 'light' ? 'white' : ''}
        borderRadius="8px"
        borderWidth="1px"
        d="flex"
        p="18px"
        shadow="sm"
      >
        <Image alt="clock logo" height="55px" mr="20px" objectFit="cover" src={clock} />
        <Stat alignItems="left" d="flex" flexDirection="column" p="0">
          <StatLabel fontSize="18px" fontWeight="500" textAlign="center">
            Follow your favorite shows!
          </StatLabel>
          <StatHelpText fontSize="16px" fontWeight="400" m="4px 0 0">
            Enter a show name or browse popular shows
          </StatHelpText>
        </Stat>
      </StatGroup>
    </Flex>
  );
};

export default WelcomeMessage;
