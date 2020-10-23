import { Box, Text } from '@chakra-ui/core';
import React, { Component } from 'react';

interface Props {
  children: React.ReactNode;
}
interface States {
  hasError: boolean;
  error: any;
  errorInfo: any;
}

class ErrorBoundary extends Component<Props, States> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({ hasError: true, error: error, errorInfo: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box>
          <Text color={'#034A85'} fontSize="5xl" p={8} textAlign="center">
            Something Went Wrong
          </Text>
          <Text color={'#034A85'} fontSize="md" p={3} textAlign="center">
            {typeof this.state.error === 'object' && this.state.error !== null
              ? JSON.stringify(this.state.error)
              : ''}
          </Text>
          <Text color={'#034A85'} fontSize="md" p={3}>
            {typeof this.state.errorInfo === 'object' && this.state.errorInfo !== null
              ? JSON.stringify(this.state.errorInfo)
              : ''}
          </Text>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
