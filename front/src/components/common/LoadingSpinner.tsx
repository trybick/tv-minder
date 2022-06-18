import { useEffect, useState } from 'react';
import { Flex, Spinner } from '@chakra-ui/react';

type Props = {
  delay?: number;
  isFullScreen?: boolean;
};

const LoadingSpinner = ({ delay, isFullScreen }: Props) => {
  const [shouldShow, setShouldShow] = useState<boolean>(!delay);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShouldShow(true);
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return shouldShow ? (
    isFullScreen ? (
      <Flex align="center" h="80vh" justify="center">
        <Spinner color="blue.500" emptyColor="gray.200" size="xl" speed="0.65s" thickness="4px" />
      </Flex>
    ) : (
      <Spinner
        color="blue.500"
        emptyColor="gray.200"
        mt="26px"
        size="xl"
        speed="0.65s"
        thickness="4px"
      />
    )
  ) : null;
};

export default LoadingSpinner;
