import { GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login";
import { API } from "./constants";
import axios from 'axios';
import handleErrors from "./handleErrors";
import { AppThunkPlainAction } from "store";


interface DispatchProps {
  setIsLoggedIn: (email: string) => void;
  unregisteredClearFollowedShows: AppThunkPlainAction;
}

type Responses = GoogleLoginResponse | GoogleLoginResponseOffline;
export const HandleGoogleLoginOnSuccess = (response: Responses, {setIsLoggedIn, unregisteredClearFollowedShows}: DispatchProps, onClose: Function, toast: Function) => {
  const isValidGoogleResponse = (response: Responses): response is GoogleLoginResponse => 'googleId' in response;
  if (isValidGoogleResponse(response)) {
    const email = response.profileObj.email;
    const googleId = response.profileObj.googleId;
    axios
      .post(`${API.TV_MINDER}/register`, {
        email,
        password: googleId,
      })
      .catch((error) => {
         if (error.response) {
           console.log("User already exists, continuing to Login.")
         }
      })
      .finally(() => {
          axios
            .post(`${API.TV_MINDER}/login`, {
              email,
              password: googleId,
            })
            .then((res) => {
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

export const HandleGoogleLoginOnFailure = (error: any, toast: Function) => {
    console.log(error);
    toast({
      title: 'Error in login',
      description: 'Could not login in. Please try again.',
      status: 'error',
      isClosable: true
    });
}
