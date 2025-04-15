import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { Box, Button, Field, Heading, Input } from '@chakra-ui/react';
import { selectIsGoogleUser, selectUserEmail } from 'store/user/selectors';
import ENDPOINTS from 'constants/endpoints';
import { toaster } from '../ui/toaster';

type FormData = {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
};

const ChangePasswordContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const email = useSelector(selectUserEmail);
  const isGoogleUser = useSelector(selectIsGoogleUser);
  const { getValues, handleSubmit, errors, register } = useForm<FormData>();

  const formSchema = {
    oldPassword: {
      required: 'Current password field is required',
    },
    newPassword: {
      required: 'New password field is required',
    },
    newPasswordConfirmation: {
      required: 'Confirm Password field is required',
      validate: {
        matchesPreviousPassword: (value: string) => {
          const { newPassword } = getValues();
          return newPassword === value || 'New passwords do not match';
        },
      },
    },
  };

  const formErrorForDisplay =
    errors?.['oldPassword']?.message ||
    errors?.['newPassword']?.message ||
    errors?.['newPasswordConfirmation']?.message;

  const onSubmit = handleSubmit(({ oldPassword, newPassword }: FormData) => {
    setIsLoading(true);
    axios
      .post(
        `${ENDPOINTS.TV_MINDER_SERVER}/changepassword`,
        {
          email,
          oldPassword,
          newPassword,
        },
        { timeout: 8000 }
      )
      .then(() => {
        setIsLoading(false);
        toaster.create({
          title: 'Password Changed!',
          description: 'Your Password has been updated.',
          type: 'success',
          duration: 3000,
          meta: { closable: true },
        });
      })
      .catch((error: AxiosError) => {
        setIsLoading(false);
        const isUnauthorizedError = error.response && error.response.status === 401;
        const errorDescription = isUnauthorizedError
          ? 'Your current password was not correct.'
          : 'Your Password could not be updated.';
        toaster.create({
          title: 'An error occurred',
          description: errorDescription,
          type: 'error',
          meta: { closable: true },
        });
      });
  });

  return (
    <Box
      as="section"
      borderRadius="4px"
      borderWidth="1px"
      margin="20px auto"
      p={5}
      w={['80%', '75%', '50%', '30%']}
    >
      <Heading as="h4" fontSize="1.6rem" textAlign="center">
        Change Password
      </Heading>
      {isGoogleUser && (
        <Heading as="h6" fontSize="1rem" fontStyle="italic" mt="14px" textAlign="center">
          Not available when using a Google account
        </Heading>
      )}

      <Box as="form" onSubmit={onSubmit}>
        <Field.Root disabled={isGoogleUser} invalid={!!errors?.oldPassword}>
          <Field.Label mt="1.5rem" w="100%">
            Current Password
          </Field.Label>
          <Input {...register('oldPassword')} type="password" />
          <Field.ErrorText>{errors?.oldPassword?.message}</Field.ErrorText>
        </Field.Root>
        <Field.Root disabled={isGoogleUser} invalid={!!errors?.newPassword}>
          <Field.Label mt="1rem" w="100%">
            New Password
          </Field.Label>
          <Input {...register('newPassword')} type="password" />
          <Field.ErrorText>{errors?.newPassword?.message}</Field.ErrorText>
        </Field.Root>
        <Field.Root disabled={isGoogleUser} invalid={!!errors?.newPasswordConfirmation}>
          <Field.Label mt="1rem" w="100%">
            Confirm New Password
          </Field.Label>
          <Input {...register('newPasswordConfirmation')} type="password" />
          <Field.ErrorText>{formErrorForDisplay}</Field.ErrorText>
        </Field.Root>

        <Button
          colorPalette="cyan"
          disabled={isGoogleUser}
          loading={isLoading}
          mt={4}
          type="submit"
          width="100%"
        >
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default ChangePasswordContainer;
