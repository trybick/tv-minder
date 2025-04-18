import axios from 'axios';
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import GoogleButton from 'react-google-button';
import { Flex } from '@chakra-ui/react';
import { AppThunkPlainAction } from 'store';
import { PlainFunction } from 'types/common';
import handleErrors from 'utils/handleErrors';
import ENDPOINTS from 'constants/endpoints';
import { toaster } from '../../ui/toaster';

type Props = {
  onClose: PlainFunction;
  setIsLoggedIn: (email: string, isGoogleUser?: boolean) => void;
  unregisteredClearFollowedShows: AppThunkPlainAction;
};

const GoogleLoginButton = (props: Props) => {
  const { onClose, setIsLoggedIn, unregisteredClearFollowedShows } = props;

  const onGoogleLoginError = () => {
    console.error('Google Login error');
    toaster.create({
      title: 'Error in login',
      description: 'Could not login in. Please try again.',
      type: 'error',
      meta: { closable: true },
    });
  };

  const getGoogleUserDetails = async (response: TokenResponse) => {
    if (!('access_token' in response) || !(typeof response.access_token === 'string')) {
      throw Error('Expected field access_token from google response');
    }
    const userInfo = await axios.get(ENDPOINTS.GOOGLE_USER_INFO, {
      headers: { Authorization: `Bearer ${response.access_token}` },
    });
    const { email, sub: googleId } = userInfo.data;
    return { email, googleId };
  };

  const onGoogleLoginSuccess = async (response: TokenResponse) => {
    const { email, googleId } = await getGoogleUserDetails(response);
    axios
      .post(`${ENDPOINTS.TV_MINDER_SERVER}/register`, {
        email,
        password: googleId,
        isGoogleUser: true,
      })
      .then(() => {
        axios
          .post(`${ENDPOINTS.TV_MINDER_SERVER}/login`, {
            email,
            password: googleId,
            isGoogleUser: true,
          })
          .then(res => {
            localStorage.setItem('jwt', res.data.token);
            onClose();
            setIsLoggedIn(res.data.email, true);
            unregisteredClearFollowedShows();
          })
          .catch((error: any) => {
            handleErrors(error);
            toaster.create({
              title: 'Error in login',
              description: 'Could not login in. Please try again.',
              type: 'error',
              meta: { closable: true },
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
