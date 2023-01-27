import { UseToastOptions } from '@chakra-ui/react';
import { CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import { Buffer } from 'buffer';
import { API } from 'constants/api';
import handleErrors from './handleErrors';
import { AppThunkPlainAction } from 'store';
import { PlainFunction } from 'types/common';

type Props = {
  onClose: PlainFunction;
  setIsLoggedIn: (email: string) => void;
  toast: (props: UseToastOptions) => void;
  unregisteredClearFollowedShows: AppThunkPlainAction;
};

const decodeGooglePayload = (credential: string) => {
  const base64Payload = credential.split('.')[1];
  const bufferPayload = Buffer.from(base64Payload, 'base64');
  const { email, sub: googleId } = JSON.parse(bufferPayload.toString());
  return { email, googleId };
};

export const handleGoogleLoginSuccess = (
  response: CredentialResponse,
  { onClose, setIsLoggedIn, toast, unregisteredClearFollowedShows }: Props
) => {
  if (!('credential' in response) || !(typeof response.credential === 'string')) {
    throw Error('credential field missing');
  }
  const { email, googleId } = decodeGooglePayload(response.credential);

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
