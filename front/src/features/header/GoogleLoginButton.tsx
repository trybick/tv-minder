import { Flex } from '@chakra-ui/react';
import { type TokenResponse, useGoogleLogin } from '@react-oauth/google';
import GoogleButton from 'react-google-button';

import { showToast } from '~/components/ui/toaster';
import {
  useLazyGetGoogleUserInfoQuery,
  useLoginMutation,
  useRegisterMutation,
} from '~/store/rtk/api/auth.api';
import { trackEvent } from '~/utils/analytics';
import { handleRtkQueryError } from '~/utils/handleRtkQueryError';

export const GoogleLoginButton = () => {
  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  const [fetchGoogleUserInfo] = useLazyGetGoogleUserInfoQuery();

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
    const userInfo = await fetchGoogleUserInfo(
      response.access_token
    ).unwrap();
    const { email, sub: googleId } = userInfo;
    return { email, googleId };
  };

  const onGoogleLoginSuccess = async (response: TokenResponse) => {
    try {
      const { email, googleId } = await getGoogleUserDetails(response);
      await register({
        email,
        password: googleId,
        isGoogleUser: true,
      }).unwrap();
      await login({
        email,
        password: googleId,
        isGoogleUser: true,
      }).unwrap();
    } catch (err) {
      handleRtkQueryError(err);
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
    <Flex justifyContent="center" mt="2.5">
      <GoogleButton
        onClick={() => {
          trackEvent({
            category: 'Auth',
            action: 'Google Login Button Pressed',
          });
          handleClickGoogleLogin();
        }}
      />
    </Flex>
  );
};
