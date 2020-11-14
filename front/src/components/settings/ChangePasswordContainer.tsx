import React, { ChangeEvent, FormEvent } from 'react';
import { connect, MapStateToProps } from 'react-redux';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useColorMode,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { AppState } from 'store';
import { selectUserEmail } from 'store/user/selectors';
import { API } from 'utils/constants';

interface StateProps {
  email: string;
}

const formFields = [
  {
    name: 'Old Password',
    labelName: 'oldPassword',
  },
  {
    name: 'New Password',
    labelName: 'newPassword',
  },
  {
    name: 'Confirm New Password',
    labelName: 'newPasswordConfirmation',
  },
];

const ChangePasswordContainer = ({ email }: StateProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState(['', '', '']);
  const toast = useToast();
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === 'dark';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formData[0] && formData[1] && formData[2] && formData[1] === formData[2]) {
      changePassword(email, formData[0], formData[1]);
    } else {
      toast({
        title: 'Invalid input fields',
        description: 'Check your input fields.',
        status: 'error',
        isClosable: true,
      });
    }
  };

  const changePassword = (email: string, oldPassword: string, newPassword: string) => {
    setIsLoading(true);
    axios
      .post(
        `${API.TV_MINDER}/changepassword`,
        {
          email,
          oldPassword,
          newPassword,
        },
        { timeout: 8000 }
      )
      .then(() => {
        toast({
          title: 'Password Changed!',
          description: 'Your Password has been updated.',
          status: 'success',
          isClosable: true,
        });
        setFormData(['', '', '']);
        setIsLoading(false);
      })
      .catch(() => {
        toast({
          title: 'An Error occurred!',
          description: 'Your Password cannot be updated.',
          status: 'error',
          isClosable: true,
        });
        setFormData(['', '', '']);
        setIsLoading(false);
      });
  };

  return (
    <Box
      as="section"
      borderRadius="4px"
      borderWidth="1px"
      margin="20px auto"
      p={5}
      width={['80%', '75%', '50%', '30%']}
    >
      <Heading as="h4" fontSize="1.8rem" textAlign="left">
        Change Password
      </Heading>

      <form onSubmit={handleSubmit}>
        {formFields.map(({ name, labelName }, index) => (
          <FormControl key={index}>
            <FormLabel htmlFor={labelName} my={3} w="100%">
              {name}
            </FormLabel>
            <Input
              name={labelName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData([
                  ...formData.slice(0, index),
                  e.target.value,
                  ...formData.slice(index + 1),
                ])
              }
              type="password"
              value={formData[index]}
            />
          </FormControl>
        ))}

        <Button
          bg={isDarkMode ? 'blue.900' : 'blue.300'}
          color="white"
          isLoading={isLoading}
          mt={4}
          type="submit"
          width="100%"
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};

const mapStateToProps: MapStateToProps<StateProps, {}, AppState> = (
  state: AppState
): StateProps => ({
  email: selectUserEmail(state),
});

export default connect<StateProps, {}, {}, AppState>(mapStateToProps, {})(ChangePasswordContainer);
