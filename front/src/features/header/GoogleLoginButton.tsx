import { Flex } from '@chakra-ui/react';
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import GoogleButton from 'react-google-button';

import { showToast } from '~/components/ui/toaster';
import ENDPOINTS from '~/gateway/endpoints';
import { useAppDispatch } from '~/store';
import { setIsLoggedIn } from '~/store/user/user.slice';
import handleErrors from '~/utils/handleErrors';

type Props = {
  onClose: () => void;
};

const GoogleLoginButton = (props: Props) => {
  const { onClose } = props;
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
            dispatch(
              setIsLoggedIn({ email: res.data.email, isGoogleUser: true })
            );
          })
          .catch((error: any) => {
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
