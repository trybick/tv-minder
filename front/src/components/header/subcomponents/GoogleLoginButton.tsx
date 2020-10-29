import React from 'react';
import GoogleLogin from 'react-google-login';
import { GoogleLoginResponses } from 'types/external';

interface Props {
  onSuccess: (response: GoogleLoginResponses) => void;
  onFailure: (error: Error) => void;
}

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
