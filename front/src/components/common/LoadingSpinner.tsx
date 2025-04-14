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
        <Spinner animationDuration="0.65s" borderWidth="4px" color="blue.500" size="xl" />
      </Flex>
    ) : (
      <Spinner animationDuration="0.65s" borderWidth="4px" color="blue.500" mt="26px" size="xl" />
    )
  ) : null;
};

export default LoadingSpinner;
