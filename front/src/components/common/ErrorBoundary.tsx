import { Box, Text } from '@chakra-ui/react';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
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
    const { hasError } = this.state;

    return hasError ? (
      <Box>
        <Text color="#034A85" fontSize="5xl" p={8} textAlign="center">
          Something went wrong
        </Text>
        <Text color="#034A85" fontSize="2xl" textAlign="center">
          This has been recorded and we are working on it.
        </Text>
      </Box>
    ) : (
      children
    );
  }
}

export default ErrorBoundary;
