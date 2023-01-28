import axios from 'axios';
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import GoogleButton from 'react-google-button';
import { Flex, useToast } from '@chakra-ui/react';
import { AppThunkPlainAction } from 'store';
import { PlainFunction } from 'types/common';
import handleErrors from 'utils/handleErrors';
import { API } from 'constants/api';

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

  const getGoogleUserDetails = async (response: TokenResponse) => {
    if (!('access_token' in response) || !(typeof response.access_token === 'string')) {
      throw Error('Expected field access_token from google response');
    }
    const userInfo = await axios.get(API.GOOGLE_USER_INFO, {
      headers: { Authorization: `Bearer ${response.access_token}` },
    });
    const { email, sub: googleId } = userInfo.data;
    return { email, googleId };
  };

  const onGoogleLoginSuccess = async (response: TokenResponse) => {
    const { email, googleId } = await getGoogleUserDetails(response);
    axios
      .post(`${API.TV_MINDER}/register`, {
        email,
        password: googleId,
        isGoogleLogin: true,
      })
      .then(() => {
        axios
          .post(`${API.TV_MINDER}/login`, {
            email,
            password: googleId,
          })
          .then(res => {
            localStorage.setItem('jwt', res.data.token);
            onClose();
            setIsLoggedIn(res.data.email);
            unregisteredClearFollowedShows();
            toast({
              title: 'Login Successful',
              description: 'You are now logged in with Google.',
              status: 'success',
              isClosable: true,
            });
          })
          .catch((error: any) => {
            handleErrors(error);
            toast({
              title: 'Error in login',
              description: 'Could not login in. Please try again.',
              status: 'error',
              isClosable: true,
            });
          });
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
