import React from 'react';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';

interface Props {
  onSuccess: (response: Responses) => void;
  onFailure: (error: any) => void;
}

type Responses = GoogleLoginResponse | GoogleLoginResponseOffline;

const GoogleLoginButton = ({ onSuccess, onFailure }: Props) => {
  const GOOGLE_API: string | undefined = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID;
  const isValidApiKeyFormat = (key: string | undefined): key is string => typeof key === 'string';
  let id = '';
  if (isValidApiKeyFormat(GOOGLE_API)) id = GOOGLE_API;

  return (
    <GoogleLogin
      buttonText="Login with Google"
      clientId={id}
      cookiePolicy={'single_host_origin'}
      onFailure={onFailure}
      onSuccess={onSuccess}
      type="submit"
    />
  );
};

export default GoogleLoginButton;
