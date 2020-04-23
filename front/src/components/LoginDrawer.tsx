import React from 'react';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/core';

interface Props {
  disclosureProps: any;
}

const LoginDrawer = ({ disclosureProps }: Props) => {
  const { isDrawerOpen, onDrawerOpen, onDrawerClose } = disclosureProps;

  return (
    <Drawer isOpen={isDrawerOpen} placement="right" onClose={onDrawerClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">Create a new account</DrawerHeader>

        <DrawerBody>
          <Stack spacing="24px">
            <Box>
              <FormLabel htmlFor="username">Name</FormLabel>
              <Input id="username" placeholder="Please enter user name" />
            </Box>
          </Stack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Button variant="outline" mr={3} onClick={onDrawerClose}>
            Cancel
          </Button>
          <Button variantColor="blue">Submit</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default LoginDrawer;
