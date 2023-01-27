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

export const handleGoogleLoginSuccess = (
  response: CredentialResponse,
  { onClose, setIsLoggedIn, toast, unregisteredClearFollowedShows }: Props
) => {
  if ('credential' in response && typeof response.credential === 'string') {
    const base64Payload = response.credential.split('.')[1];
    const bufferPayload = Buffer.from(base64Payload, 'base64');
    const { email, sub: googleId } = JSON.parse(bufferPayload.toString());

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
          });
      });
  }
};
