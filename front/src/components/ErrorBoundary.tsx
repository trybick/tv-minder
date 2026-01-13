import { Box, Container, Icon, Text, VStack } from '@chakra-ui/react';
import { Component, ErrorInfo, ReactNode } from 'react';
import { TbFileSad } from 'react-icons/tb';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error });
  }

  render() {
    const { children } = this.props;
    const { hasError, error } = this.state;

    if (!hasError) {
      return children;
    }

    return (
      <Container maxW="container.md" py={20} m="0 auto">
        <VStack gap={6}>
          <Icon as={TbFileSad} boxSize={16} color="cyan.500" />
          <Text
            color="cyan.500"
            fontSize={{ base: '3xl', md: '5xl' }}
            fontWeight="bold"
          >
            Oops! Something went wrong
          </Text>
          <Text color="cyan.500" fontSize={{ base: 'lg', md: '2xl' }}>
            Please refresh the page or try again later.
          </Text>
          {error && (
            <Box
              mt={2}
              p={6}
              borderRadius="md"
              fontSize="sm"
              maxW="600px"
              w="full"
            >
              <Text
                fontFamily="mono"
                whiteSpace="pre-wrap"
                color="red.500"
                fontWeight="semibold"
                fontSize="sm"
                textAlign="center"
              >
                {error.message.length > 150
                  ? `${error.message.slice(0, 150)}...`
                  : error.message}
              </Text>
            </Box>
          )}
        </VStack>
      </Container>
    );
  }
}
