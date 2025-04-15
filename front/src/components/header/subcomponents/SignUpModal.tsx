import { MutableRefObject, useRef, useState } from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Box, Button, CloseButton, Dialog, Field, Input, InputGroup } from '@chakra-ui/react';
import { AppState, AppThunkDispatch, AppThunkPlainAction } from 'store';
import { setIsLoggedInAction, unregisteredClearFollowedShowsAction } from 'store/user/actions';
import { selectUnregisteredFollowedShows } from 'store/user/selectors';
import { DisclosureProps, ID } from 'types/common';
import ENDPOINTS from 'constants/endpoints';
import handleErrors from 'utils/handleErrors';
import { useCloseModalOnPressEscape } from 'hooks/useCloseModalOnPressEscape';
import GoogleLoginButton from './GoogleLoginButton';
import { toaster } from '../../ui/toaster';
import Separator from '../../common/Separator';

type OwnProps = {
  disclosureProps: DisclosureProps;
};

type StateProps = {
  unregisteredFollowedShows: ID[];
};

type DispatchProps = {
  setIsLoggedIn: (email: string) => void;
  unregisteredClearFollowedShows: AppThunkPlainAction;
};

type Props = DispatchProps & StateProps & OwnProps;

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  signUp?: string;
};

const SignUpModal = ({
  disclosureProps,
  setIsLoggedIn,
  unregisteredClearFollowedShows,
  unregisteredFollowedShows,
}: Props) => {
  // Modal
  const { isOpen, onClose } = disclosureProps;
  const [isLoading, setIsLoading] = useState(false);
  useCloseModalOnPressEscape({ onClose });

  // Form
  const { errors, handleSubmit, reset, setError, register } = useForm<FormData>();
  const emailRef = useRef() as MutableRefObject<HTMLInputElement>;

  // Password fields
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisible = () => setPasswordVisible(!passwordVisible);

  const onSubmit = handleSubmit(({ email, password }: FormData) => {
    setIsLoading(true);
    axios
      .post(`${ENDPOINTS.TV_MINDER_SERVER}/register`, {
        email,
        password,
        unregisteredFollowedShows,
      })
      .then(() => {
        return axios.post(`${ENDPOINTS.TV_MINDER_SERVER}/login`, {
          email,
          password,
        });
      })
      .then(res => {
        localStorage.setItem('jwt', res.data.token);
        onClose();
        setIsLoggedIn(res.data.email);
        unregisteredClearFollowedShows();

        toaster.create({
          title: 'Logged in',
          description: "We've created your account for you.",
          type: 'success',
          meta: { closable: true },
        });
      })
      .catch(err => {
        handleErrors(err);
        setIsLoading(false);
        reset({}, { errors: true });
        emailRef.current?.focus();

        if (err.response?.status === 409) {
          setError('signUp', 'emailTaken', 'Email already registered. Please try again.');
        } else {
          setError('signUp', 'generic', 'Could not sign up. Please try again.');
        }
      });
  });

  const handleFormClose = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  return (
    <Dialog.Root onOpenChange={e => handleFormClose(e.open)} open={isOpen} lazyMount unmountOnExit>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Sign Up</Dialog.Title>
          </Dialog.Header>

          <Dialog.CloseTrigger asChild>
            <CloseButton />
          </Dialog.CloseTrigger>

          <GoogleLoginButton
            onClose={onClose}
            setIsLoggedIn={setIsLoggedIn}
            unregisteredClearFollowedShows={unregisteredClearFollowedShows}
          />

          <Box as="form" onSubmit={onSubmit}>
            <Dialog.Body pb={6}>
              <Separator alignItems="center" fontSize="14px" m="26px 0" textAlign="center">
                OR
              </Separator>

              <Field.Root invalid={Boolean(errors?.email)}>
                <Field.Label htmlFor="email">Email</Field.Label>
                <Input placeholder="Email" {...register('email')} ref={emailRef} autoFocus />
                <Field.ErrorText>{errors?.email?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={Boolean(errors?.password)} mt={4}>
                <Field.Label>Password</Field.Label>
                <InputGroup
                  endElement={
                    <Button onClick={togglePasswordVisible} size="sm" tabIndex={-1} variant="plain">
                      {passwordVisible ? 'Hide' : 'Show'}
                    </Button>
                  }
                >
                  <Input
                    placeholder="Password"
                    {...register('password')}
                    type={passwordVisible ? 'text' : 'password'}
                  />
                </InputGroup>
                <Field.ErrorText>{errors?.password?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={Boolean(errors?.confirmPassword)} mt={4}>
                <Field.Label>Confirm Password</Field.Label>
                <InputGroup
                  endElement={
                    <Button onClick={togglePasswordVisible} size="sm" tabIndex={-1} variant="plain">
                      {passwordVisible ? 'Hide' : 'Show'}
                    </Button>
                  }
                >
                  <Input
                    placeholder="Confirm Password"
                    {...register('confirmPassword')}
                    type={passwordVisible ? 'text' : 'password'}
                  />
                </InputGroup>
                <Field.ErrorText>{errors?.confirmPassword?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={Boolean(errors?.signUp)} mt={4}>
                <Field.ErrorText>{errors?.signUp?.message}</Field.ErrorText>
              </Field.Root>
            </Dialog.Body>

            <Dialog.Footer>
              <Button mr={3} onClick={onClose} variant="ghost">
                Cancel
              </Button>
              <Button colorPalette="cyan" loading={isLoading} type="submit" variant="solid">
                Sign Up
              </Button>
            </Dialog.Footer>
          </Box>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = (state: AppState) => ({
  unregisteredFollowedShows: selectUnregisteredFollowedShows(state),
});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
  setIsLoggedIn: (email: string, isGoogleUser = false) =>
    dispatch(setIsLoggedInAction(email, isGoogleUser)),
  unregisteredClearFollowedShows: () => dispatch(unregisteredClearFollowedShowsAction()),
});

export default connect<StateProps, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(SignUpModal);
