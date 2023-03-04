import { Component, ErrorInfo, ReactNode } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Box, Text } from '@chakra-ui/react';

interface Props extends RouteComponentProps<any> {
  children: ReactNode;
}

type State = {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
};

class ErrorBoundary extends Component<Props, State> {
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

export default withRouter(ErrorBoundary);
