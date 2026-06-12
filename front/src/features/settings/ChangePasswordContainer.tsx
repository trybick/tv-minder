import {
  Box,
  Button,
  Field,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
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

const inputStyles = {
  bg: 'blackAlpha.300',
  borderColor: 'whiteAlpha.300',
  _hover: { borderColor: 'whiteAlpha.400' },
} as const;

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
      px={{ base: 4, md: 6 }}
      py={{ base: 4, md: 5 }}
      borderRadius={{ base: 'xl', md: '2xl' }}
      borderWidth="1px"
      borderColor="whiteAlpha.200"
      bg="linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)"
      boxShadow="0 18px 45px rgba(0, 0, 0, 0.35)"
      backdropFilter="blur(6px)"
    >
      <Heading as="h2" fontSize="lg" fontWeight="700" color="fg">
        Change Password
      </Heading>
      {isGoogleUser && (
        <Text color="fg.muted" fontSize="sm" mt={1}>
          Not available when using a Google account
        </Text>
      )}

      <Stack as="form" gap={4} mt={5} onSubmit={onSubmit}>
        <Field.Root disabled={isGoogleUser} invalid={!!errors?.oldPassword}>
          <Field.Label>Current Password</Field.Label>
          <Input
            {...inputStyles}
            {...register('oldPassword', { ...formSchema.oldPassword })}
            type="password"
          />
          <Field.ErrorText>{errors?.oldPassword?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root disabled={isGoogleUser} invalid={!!errors?.newPassword}>
          <Field.Label>New Password</Field.Label>
          <Input
            {...inputStyles}
            {...register('newPassword', { ...formSchema.newPassword })}
            type="password"
          />
          <Field.ErrorText>{errors?.newPassword?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root
          disabled={isGoogleUser}
          invalid={!!errors?.newPasswordConfirmation}
        >
          <Field.Label>Confirm New Password</Field.Label>
          <Input
            {...inputStyles}
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
          mt={1}
          type="submit"
          width="100%"
        >
          Update Password
        </Button>
      </Stack>
    </Box>
  );
};
