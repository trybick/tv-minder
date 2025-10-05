import { Box, Flex, Icon, Spinner, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';

type CalendarLoadingIndicatorProps = {
  isLoading: boolean;
};

const CalendarLoadingIndicator = ({
  isLoading,
}: CalendarLoadingIndicatorProps) => {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isLoading && !showSuccess) {
      // Show success message when loading completes
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000); // Show for 3 seconds only

      return () => clearTimeout(timer);
    }
  }, [isLoading, showSuccess]);

  if (!isLoading && !showSuccess) {
    return null;
  }

  return (
    <Box
      position="fixed"
      top="70px"
      right="20px"
      zIndex={1000}
      bg={isLoading ? 'blue.50' : 'green.50'}
      borderRadius="md"
      boxShadow="md"
      p={3}
      border="1px solid"
      borderColor={isLoading ? 'blue.200' : 'green.200'}
    >
      <Flex align="center" gap={2}>
        {isLoading ? (
          <>
            <Spinner size="sm" color="blue.500" />
            <Text fontSize="sm" fontWeight="medium" color="blue.700">
              Fetching episodes...
            </Text>
          </>
        ) : (
          <>
            <Icon as={FiCheckCircle} color="green.500" boxSize={5} />
            <Text fontSize="sm" fontWeight="medium" color="green.700">
              Up to date
            </Text>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default CalendarLoadingIndicator;
