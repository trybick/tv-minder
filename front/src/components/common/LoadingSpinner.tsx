import { Flex, Spinner } from '@chakra-ui/react';

interface Props {
  isFullScreen?: boolean;
}

const LoadingSpinner = ({ isFullScreen }: Props) =>
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
  );

export default LoadingSpinner;
