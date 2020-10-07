import React from 'react';
import { Box, Button, Divider, Flex, Link, Text, useDisclosure } from '@chakra-ui/core';
import { FaGithub, FaRegComment } from 'react-icons/fa';
import FeedbackModal from './FeedbackModal';

const Footer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const disclosureProps = { isOpen, onOpen, onClose };

  return (
    <>
      <Box height="50px" p=".6rem">
        <Divider />
        <Flex
          alignItems="center"
          fontSize=".85rem"
          justifyContent="space-between"
          p={{ xs: '1rem .3rem', sm: '1rem 2rem' }}
        >
          <Box fontWeight="700">
            <Link
              alignItems="baseline"
              display="flex"
              href="https://github.com/trybick/tv-minder"
              isExternal
            >
              <Box as={FaGithub} display="inline" mr="4px" size="12px" verticalAlign="sub" />
              <Text display="inline">GitHub</Text>
            </Link>
          </Box>

          <Box color="#a0a4a6" ml="auto">
            © {new Date().getFullYear()}
            {` `}
            <Text display="inline">TV-Minder</Text>
          </Box>

          <Button ml="auto" onClick={onOpen} rightIcon={FaRegComment} size="sm" variantColor="cyan">
            Feedback
          </Button>
          <FeedbackModal disclosureProps={disclosureProps} />
        </Flex>
      </Box>
    </>
  );
};

export default Footer;
