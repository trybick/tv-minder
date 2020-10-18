import React from 'react';
import { Box, Button, FormControl, FormLabel, Heading, Input, useColorMode } from '@chakra-ui/core';

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

const ChangePasswordContainer = () => {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === 'dark';

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

      <form>
        {formFields.map(({ name, labelName }, index) => (
          <FormControl key={index}>
            <FormLabel htmlFor={labelName} my={3} w="100%">
              {name}
            </FormLabel>
            <Input name={labelName} type="password" />
          </FormControl>
        ))}
        <Button
          bg={isDarkMode ? 'blue.900' : 'blue.300'}
          color="white"
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

export default ChangePasswordContainer;
