import { Box, Button, Field, Heading, Input } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { showToast } from '~/components/ui/toaster';
import { useAppSelector } from '~/store';
import { useChangePasswordMutation } from '~/store/rtk/api/auth.api';
import { selectEmail, selectIsGoogleUser } from '~/store/rtk/slices/user.slice';
import { handleRtkQueryError } from '~/utils/handleRtkQueryError';
import { isFetchError } from '~/utils/isFetchError';

type FormInputs = {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
};

export const ChangePasswordContainer = () => {
  const email = useAppSelector(selectEmail);
  const isGoogleUser = useAppSelector(selectIsGoogleUser);

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset: resetForm,
  } = useForm<FormInputs>();

  const formSchema = {
    oldPassword: {
      required: 'Current password field is required',
    },
    newPassword: {
      required: 'New password field is required',
    },
    newPasswordConfirmation: {
      required: 'Confirm Password field is required',
      validate: (value: string, formValues: FormInputs) => {
        if (value !== formValues.newPassword) {
          return 'Passwords do not match';
        }
        return true;
      },
    },
  };

  const formErrorForDisplay =
    errors?.['oldPassword']?.message ||
    errors?.['newPassword']?.message ||
    errors?.['newPasswordConfirmation']?.message;

  const onSubmit = handleSubmit(
    async ({ oldPassword, newPassword }: FormInputs) => {
      try {
        await changePassword({ email, oldPassword, newPassword }).unwrap();
        showToast({
          title: 'Password Changed!',
          description: 'Your Password has been updated.',
          type: 'success',
        });
      } catch (error) {
        handleRtkQueryError(error);
        const isUnauthorizedError = isFetchError(error) && error.status === 401;
        const errorDescription = isUnauthorizedError
          ? 'Your current password was not correct.'
          : 'Your Password could not be updated.';
        showToast({
          title: 'An error occurred',
          description: errorDescription,
          type: 'error',
        });
      } finally {
        resetForm();
      }
    }
  );

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
        <Heading
          as="h6"
          fontSize="1rem"
          fontStyle="italic"
          mt="14px"
          textAlign="center"
        >
          Not available when using a Google account
        </Heading>
      )}

      <Box as="form" onSubmit={onSubmit}>
        <Field.Root disabled={isGoogleUser} invalid={!!errors?.oldPassword}>
          <Field.Label mt="1.5rem" w="100%">
            Current Password
          </Field.Label>
          <Input
            {...register('oldPassword', { ...formSchema.oldPassword })}
            type="password"
          />
          <Field.ErrorText>{errors?.oldPassword?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root disabled={isGoogleUser} invalid={!!errors?.newPassword}>
          <Field.Label mt="1rem" w="100%">
            New Password
          </Field.Label>
          <Input
            {...register('newPassword', { ...formSchema.newPassword })}
            type="password"
          />
          <Field.ErrorText>{errors?.newPassword?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root
          disabled={isGoogleUser}
          invalid={!!errors?.newPasswordConfirmation}
        >
          <Field.Label mt="1rem" w="100%">
            Confirm New Password
          </Field.Label>
          <Input
            {...register('newPasswordConfirmation', {
              ...formSchema.newPasswordConfirmation,
            })}
            type="password"
          />
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
