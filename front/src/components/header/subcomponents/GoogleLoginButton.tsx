import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import GoogleButton from 'react-google-button';
import { Flex, useToast } from '@chakra-ui/react';
import { handleGoogleLoginSuccess } from 'utils/googleOAuth';
import { AppThunkPlainAction } from 'store';
import { PlainFunction } from 'types/common';

type Props = {
  onClose: PlainFunction;
  setIsLoggedIn: (email: string) => void;
  unregisteredClearFollowedShows: AppThunkPlainAction;
};

const GoogleLoginButton = (props: Props) => {
  const { onClose, setIsLoggedIn, unregisteredClearFollowedShows } = props;
  const toast = useToast();

  const onGoogleLoginError = () => {
    console.error('Google Login error');
    toast({
      title: 'Error in login',
      description: 'Could not login in. Please try again.',
      status: 'error',
      isClosable: true,
    });
  };

  const onGoogleLoginSuccess = (response: TokenResponse) => {
    handleGoogleLoginSuccess({
      response,
      setIsLoggedIn,
      unregisteredClearFollowedShows,
      onClose,
      toast,
    });
  };

  const handleClickGoogleLogin = useGoogleLogin({
    onError: onGoogleLoginError,
    onSuccess: onGoogleLoginSuccess,
  });

  return (
    <Flex justifyContent="center" mt="10px">
      <GoogleButton onClick={() => handleClickGoogleLogin()} />
    </Flex>
  );
};

export default GoogleLoginButton;
