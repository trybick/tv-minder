import { Flex } from '@chakra-ui/react';
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import ky from 'ky';
import GoogleButton from 'react-google-button';

import ENDPOINTS from '~/app/endpoints';
import { showToast } from '~/components/ui/toaster';
import { useAppDispatch } from '~/store';
import { setIsSignUpModalOpen } from '~/store/rtk/slices/modals.slice';
import { setIsLoggedIn } from '~/store/rtk/slices/user.slice';
import handleErrors from '~/utils/handleErrors';

const GoogleLoginButton = () => {
  const dispatch = useAppDispatch();

  const onGoogleLoginError = () => {
    console.error('Google Login error');
    showToast({
      title: 'Error in login',
      description: 'Could not login in. Please try again.',
      type: 'error',
    });
  };

  const getGoogleUserDetails = async (response: TokenResponse) => {
    if (
      !('access_token' in response) ||
      !(typeof response.access_token === 'string')
    ) {
      throw Error('Expected field access_token from google response');
    }
    const userInfo = await ky
      .get(ENDPOINTS.GOOGLE_USER_INFO, {
        headers: { Authorization: `Bearer ${response.access_token}` },
      })
      .json<{ email: string; sub: string }>();
    const { email, sub: googleId } = userInfo;
    return { email, googleId };
  };

  const onGoogleLoginSuccess = async (response: TokenResponse) => {
    const { email, googleId } = await getGoogleUserDetails(response);
    ky.post(`${ENDPOINTS.TV_MINDER_SERVER}/register`, {
      json: { email, password: googleId, isGoogleUser: true },
    }).then(() => {
      ky.post(`${ENDPOINTS.TV_MINDER_SERVER}/login`, {
        json: { email, password: googleId, isGoogleUser: true },
      })
        .json<{ token: string; email: string }>()
        .then(res => {
          localStorage.setItem('jwt', res.token);
          dispatch(setIsSignUpModalOpen(false));
          dispatch(setIsLoggedIn({ email: res.email, isGoogleUser: true }));
        })
        .catch(error => {
          handleErrors(error);
          showToast({
            title: 'Error in login',
            description: 'Could not login in. Please try again.',
            type: 'error',
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
