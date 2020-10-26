import React from 'react';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login'

interface Props {
    onSuccess: (response: Responses) => void;
    onFailure: (error: any) => void;
}

type Responses = GoogleLoginResponse | GoogleLoginResponseOffline;

const GoogleLoginButton = ({onSuccess, onFailure}: Props) => {
    const GOOGLE_API: string | undefined = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID;
    const isValidApiKeyFormat = (key: string | undefined): key is string => typeof key === 'string';
    let id: string = '';
    if (isValidApiKeyFormat(GOOGLE_API))
        id = GOOGLE_API;
    
    return <GoogleLogin
        clientId={id}
        buttonText="Login with Google"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        type="submit"
    />
}

export default GoogleLoginButton;
