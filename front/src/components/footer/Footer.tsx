import React from 'react';
import { Box, Button, Grid, Link, Text, useDisclosure } from '@chakra-ui/core';
import { FaGithub, FaRegComment } from 'react-icons/fa';
import FeedbackModal from './FeedbackModal';

const Footer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const disclosureProps = { isOpen, onOpen, onClose };

  return (
    <Box backgroundColor="#F3F5F6" marginTop="30px" height="76px" padding=".5rem">
      <Grid
        alignItems="center"
        fontSize=".85rem"
        justifyContent="space-between"
        padding="1rem 2rem"
        templateColumns="repeat(auto-fit, minmax(200px,240px))"
      >
        <Box color="#333" fontWeight="700">
          <Link href="https://github.com/trybick/tv-minder" isExternal>
            <Box as={FaGithub} display="inline" mr="4px" size="16px" verticalAlign="sub" />
            <Text display="inline">GitHub</Text>
          </Link>
        </Box>

        <Box color="#a0a4a6" textAlign="center">
          © {new Date().getFullYear()}
          {` `}
          <Text display="inline">TV-Minder</Text>
        </Box>

        <Button rightIcon={FaRegComment} ml="auto" onClick={onOpen} size="sm" variantColor="green">
          Feedback?
        </Button>
        <FeedbackModal disclosureProps={disclosureProps} />
      </Grid>
    </Box>
  );
};

export default Footer;
