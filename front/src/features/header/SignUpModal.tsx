import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import InlineTextSeparator from '~/components/InlineTextSeparator';
import { PasswordInput } from '~/components/ui/password-input';
import ENDPOINTS from '~/gateway/endpoints';
import { useCloseModalOnPressEscape } from '~/hooks/useCloseModalOnPressEscape';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppDispatch, useAppSelector } from '~/store';
import {
  setIsLoggedInAction,
  unregisteredClearFollowedShowsAction,
} from '~/store/user/actions';
import { selectUnregisteredFollowedShows } from '~/store/user/selectors';
import { DisclosureProps } from '~/types/common';
import { emailRegex } from '~/utils/constants';
import handleErrors from '~/utils/handleErrors';

import GoogleLoginButton from './GoogleLoginButton';

type Props = {
  disclosureProps: DisclosureProps;
};

type FormInputs = {
  email: string;
  password: string;
  confirmPassword: string;
};

const formValidation = {
  email: {
    required: { value: true, message: 'Email is required' },
    pattern: { value: emailRegex, message: 'Please enter a valid email' },
  },
  password: {
    required: 'Password is required',
  },
  confirmPassword: {
    required: 'Confirm password is required',
    validate: (value: string, formValues: FormInputs) => {
      if (value !== formValues.password) {
        return 'Passwords do not match';
      }
      return true;
    },
  },
};

const SignUpModal = ({ disclosureProps }: Props) => {
  const dispatch = useAppDispatch();
  const unregisteredFollowedShows = useAppSelector(
    selectUnregisteredFollowedShows
  );
  const isMobile = useIsMobile();
  // Modal
  const { isOpen, onClose } = disclosureProps;
  const [isLoading, setIsLoading] = useState(false);
  useCloseModalOnPressEscape({ onClose });

  // Form
  const {
    formState: { errors },
    handleSubmit,
    reset,
    setError,
    register,
    reset: resetForm,
  } = useForm<FormInputs>();

  const onSubmit = handleSubmit(({ email, password }: FormInputs) => {
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
        dispatch(setIsLoggedInAction(res.data.email));
        dispatch(unregisteredClearFollowedShowsAction());
      })
      .catch(err => {
        handleErrors(err);
        setIsLoading(false);
        reset(undefined, { keepErrors: true });

        if (err.response?.status === 409) {
          setError('root', {
            type: 'manual',
            message: 'Email already registered. Please try again.',
          });
        } else {
          setError('root', {
            type: 'manual',
            message: 'Could not sign up. Please try again.',
          });
        }
      });
  });

  const handleFormClose = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
      resetForm();
    }
  };

  return (
    <Dialog.Root
      onOpenChange={e => handleFormClose(e.open)}
      open={isOpen}
      lazyMount
      unmountOnExit
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content bg="bg.muted">
          <Dialog.Header>
            <Dialog.Title>Sign Up</Dialog.Title>
          </Dialog.Header>

          <Dialog.CloseTrigger asChild>
            <CloseButton />
          </Dialog.CloseTrigger>

          {/* Do not render the Google button during playwright tests.
              It causes the page to go blank  */}
          {import.meta.env.VITE_CI !== 'true' && (
            <GoogleLoginButton
              onClose={onClose}
              unregisteredClearFollowedShows={() =>
                dispatch(unregisteredClearFollowedShowsAction())
              }
            />
          )}

          <Box as="form" onSubmit={onSubmit}>
            <Dialog.Body pb={6}>
              <InlineTextSeparator
                alignItems="center"
                fontSize="14px"
                m="26px 0"
                textAlign="center"
              >
                OR
              </InlineTextSeparator>

              <Field.Root invalid={!!errors?.email}>
                <Field.Label>Email</Field.Label>
                <Input
                  _focus={{ borderColor: 'cyan.500' }}
                  borderColor="gray.500"
                  {...register('email', { ...formValidation.email })}
                  autoFocus={!isMobile}
                />
                <Field.ErrorText>{errors?.email?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors?.password} mt={4}>
                <Field.Label>Password</Field.Label>
                <PasswordInput
                  _focus={{ borderColor: 'cyan.500' }}
                  borderColor="gray.500"
                  {...register('password', { ...formValidation.password })}
                />
                <Field.ErrorText>{errors?.password?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors?.confirmPassword} mt={4}>
                <Field.Label>Confirm Password</Field.Label>
                <PasswordInput
                  _focus={{ borderColor: 'cyan.500' }}
                  borderColor="gray.500"
                  {...register('confirmPassword', {
                    ...formValidation.confirmPassword,
                  })}
                />
                <Field.ErrorText>
                  {errors?.confirmPassword?.message}
                </Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors?.root} mt={4}>
                <Field.ErrorText>{errors?.root?.message}</Field.ErrorText>
              </Field.Root>
            </Dialog.Body>

            <Dialog.Footer>
              <Button mr={3} onClick={onClose} variant="ghost">
                Cancel
              </Button>
              <Button
                colorPalette="cyan"
                loading={isLoading}
                type="submit"
                variant="solid"
              >
                Sign Up
              </Button>
            </Dialog.Footer>
          </Box>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default SignUpModal;
