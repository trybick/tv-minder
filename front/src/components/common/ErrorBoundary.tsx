import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Box, Text } from '@chakra-ui/core';

interface Props extends RouteComponentProps<any> {
  children: ReactNode;
}
interface States {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, States> {
  constructor(props: Props) {
    super(props);
    const { history } = this.props;

    history.listen(() => {
      if (this.state.hasError) {
        this.setState({
          hasError: false,
        });
      }
    });

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ hasError: true, error: error, errorInfo: errorInfo });
  }

  render() {
    const { error, errorInfo, hasError } = this.state;

    if (hasError) {
      return (
        <Box>
          <Text color={'#034A85'} fontSize="5xl" p={8} textAlign="center">
            Something Went Wrong
          </Text>
          <Text color={'#034A85'} fontSize="md" p={3} textAlign="center">
            {typeof error === 'object' && error !== null ? JSON.stringify(error) : ''}
          </Text>
          <Text color={'#034A85'} fontSize="md" p={3}>
            {typeof errorInfo === 'object' && errorInfo !== null ? JSON.stringify(errorInfo) : ''}
          </Text>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);
