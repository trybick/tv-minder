import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  useToast,
} from '@chakra-ui/react';
import { selectUserEmail } from 'store/user/selectors';
import ENDPOINTS from 'constants/endpoints';

type FormDataType = {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
};

const ChangePasswordContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const email = useSelector(selectUserEmail);
  const toast = useToast();
  const { getValues, handleSubmit, errors, register } = useForm<FormDataType>();

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
    errors['oldPassword']?.message ||
    errors['newPassword']?.message ||
    errors['newPasswordConfirmation']?.message;

  const onSubmit = handleSubmit(({ oldPassword, newPassword }) => {
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
        toast({
          title: 'Password Changed!',
          description: 'Your Password has been updated.',
          status: 'success',
          isClosable: true,
        });
      })
      .catch((error: AxiosError) => {
        setIsLoading(false);
        const isUnauthorizedError = error.response && error.response.status === 401;
        const errorDescription = isUnauthorizedError
          ? 'Your current password was not correct.'
          : 'Your Password could not be updated.';
        toast({
          title: 'An error occurred',
          description: errorDescription,
          status: 'error',
          isClosable: true,
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
      <Heading as="h4" fontSize="1.8rem" textAlign="center">
        Change Password
      </Heading>

      <Box as="form" onSubmit={onSubmit}>
        <FormControl isInvalid={!!errors.oldPassword}>
          <FormLabel mt="1.5rem" w="100%">
            Current Password
          </FormLabel>
          <Input name="oldPassword" ref={register(formSchema.oldPassword)} type="password" />
        </FormControl>
        <FormControl isInvalid={!!errors.newPassword}>
          <FormLabel mt="1rem" w="100%">
            New Password
          </FormLabel>
          <Input name="newPassword" ref={register(formSchema.newPassword)} type="password" />
        </FormControl>
        <FormControl isInvalid={!!errors.newPasswordConfirmation}>
          <FormLabel mt="1rem" w="100%">
            Confirm New Password
          </FormLabel>
          <Input
            name="newPasswordConfirmation"
            ref={register(formSchema.newPasswordConfirmation)}
            type="password"
          />
          <FormErrorMessage>{formErrorForDisplay}</FormErrorMessage>
        </FormControl>

        <Button bg="primary" color="white" isLoading={isLoading} mt={4} type="submit" width="100%">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default ChangePasswordContainer;
