import { Flex } from '@chakra-ui/react';
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import ky from 'ky';
import GoogleButton from 'react-google-button';

import ENDPOINTS from '~/app/endpoints';
import { showToast } from '~/components/ui/toaster';
import { useAppDispatch } from '~/store';
import {
  useLoginMutation,
  useRegisterMutation,
} from '~/store/rtk/api/auth.api';
import {
  setIsLoginModalOpen,
  setIsSignUpModalOpen,
} from '~/store/rtk/slices/modals.slice';
import { setIsLoggedIn } from '~/store/rtk/slices/user.slice';
import handleErrors from '~/utils/handleErrors';

const GoogleLoginButton = () => {
  const dispatch = useAppDispatch();
  const [registerUser] = useRegisterMutation();
  const [login] = useLoginMutation();

  const onGoogleLoginError = () => {
    console.error('Google Login error');
    showToast({
      title: 'Error in login',
      description: 'Could not log in. Please try again.',
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
    // Using ky here since this is an external Google API endpoint
    const userInfo = await ky
      .get(ENDPOINTS.GOOGLE_USER_INFO, {
        headers: { Authorization: `Bearer ${response.access_token}` },
      })
      .json<{ email: string; sub: string }>();
    const { email, sub: googleId } = userInfo;
    return { email, googleId };
  };

  const onGoogleLoginSuccess = async (response: TokenResponse) => {
    try {
      const { email, googleId } = await getGoogleUserDetails(response);

      // Register (will succeed or fail silently if already registered)
      await registerUser({
        email,
        password: googleId,
        isGoogleUser: true,
      })
        .unwrap()
        .catch(() => {
          // Ignore registration errors - user might already exist
        });

      // Login
      const res = await login({
        email,
        password: googleId,
        isGoogleUser: true,
      }).unwrap();

      localStorage.setItem('jwt', res.token);
      dispatch(setIsLoginModalOpen(false));
      dispatch(setIsSignUpModalOpen(false));
      dispatch(setIsLoggedIn({ email: res.email, isGoogleUser: true }));
    } catch (err) {
      handleErrors(err);
      showToast({
        title: 'Error in login',
        description: 'Could not log in. Please try again.',
        type: 'error',
      });
    }
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
