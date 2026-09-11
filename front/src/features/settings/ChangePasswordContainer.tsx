import { Box, Button, Field, Heading, Stack, Text } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { showToast } from '~/components/ui/toaster';
import { AuthPasswordInput } from '~/features/header/auth/AuthInputs';
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
      w="100%"
      px={{ base: 5, md: 7 }}
      py={{ base: 5, md: 6 }}
      rounded="2xl"
      borderWidth="1px"
      borderColor="whiteAlpha.100"
      bg="whiteAlpha.50"
    >
      <Heading
        as="h2"
        fontSize="lg"
        fontWeight="semibold"
        letterSpacing="tight"
        color="fg"
      >
        Change password
      </Heading>
      <Text color="fg.muted" fontSize="sm" mt={1}>
        {isGoogleUser
          ? 'Not available when using a Google account.'
          : 'Choose something secure that you will remember.'}
      </Text>

      <Stack as="form" gap={4} mt={6} onSubmit={onSubmit}>
        <Field.Root disabled={isGoogleUser} invalid={!!errors?.oldPassword}>
          <Field.Label>Current password</Field.Label>
          <AuthPasswordInput
            autoComplete="current-password"
            {...register('oldPassword', { ...formSchema.oldPassword })}
          />
          <Field.ErrorText>{errors?.oldPassword?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root disabled={isGoogleUser} invalid={!!errors?.newPassword}>
          <Field.Label>New password</Field.Label>
          <AuthPasswordInput
            autoComplete="new-password"
            {...register('newPassword', { ...formSchema.newPassword })}
          />
          <Field.ErrorText>{errors?.newPassword?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root
          disabled={isGoogleUser}
          invalid={!!errors?.newPasswordConfirmation}
        >
          <Field.Label>Confirm new password</Field.Label>
          <AuthPasswordInput
            autoComplete="new-password"
            {...register('newPasswordConfirmation', {
              ...formSchema.newPasswordConfirmation,
            })}
          />
          <Field.ErrorText>{formErrorForDisplay}</Field.ErrorText>
        </Field.Root>

        <Button
          colorPalette="cyan"
          disabled={isGoogleUser}
          loading={isLoading}
          mt={2}
          type="submit"
          size="lg"
          width="full"
          rounded="lg"
          fontWeight="semibold"
        >
          Update Password
        </Button>
      </Stack>
    </Box>
  );
};
