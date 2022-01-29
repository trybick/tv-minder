import React from 'react';
import { Flex, Image, Stat, StatGroup, StatLabel, useColorMode } from '@chakra-ui/react';
import clock from 'images/clock.png';

const WelcomeMessage = () => {
  const { colorMode } = useColorMode();
  return (
    <Flex justifyContent="center" m="20px 10px 0">
      <StatGroup
        alignItems="center"
        bg={colorMode === 'light' ? 'white' : ''}
        borderRadius="8px"
        borderWidth="1px"
        d="flex"
        p="18px"
        shadow="sm"
      >
        <Image alt="clock logo" height="46px" mr="20px" objectFit="cover" src={clock} />
        <Stat alignItems="left" d="flex" flexDirection="column" p="0">
          <StatLabel fontSize="16px" fontStyle="italic" fontWeight="500" textAlign="center">
            Never miss an episode
          </StatLabel>
        </Stat>
      </StatGroup>
    </Flex>
  );
};

export default WelcomeMessage;
