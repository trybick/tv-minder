import { UseToastOptions } from '@chakra-ui/react';
import { TokenResponse } from '@react-oauth/google';
import axios from 'axios';
import { API } from 'constants/api';
import handleErrors from './handleErrors';
import { AppThunkPlainAction } from 'store';
import { PlainFunction } from 'types/common';

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

export const handleGoogleLoginSuccess = async ({
  response,
  onClose,
  setIsLoggedIn,
  toast,
  unregisteredClearFollowedShows,
}: {
  response: TokenResponse;
  onClose: PlainFunction;
  setIsLoggedIn: (email: string) => void;
  toast: (props: UseToastOptions) => void;
  unregisteredClearFollowedShows: AppThunkPlainAction;
}) => {
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
