import { Box, Button, Divider, Flex, Icon, Link, Text, useDisclosure } from '@chakra-ui/react';
import { FaGithub, FaRegComment } from 'react-icons/fa';
import FeedbackModal from './FeedbackModal';

const Footer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const disclosureProps = { isOpen, onOpen, onClose };

  return (
    <Box mb="6px">
      <Divider />
      <Flex
        alignItems="center"
        fontSize=".85rem"
        justifyContent="space-between"
        p={{ base: '1.4rem', sm: '1rem 2rem' }}
      >
        <Link aria-label="GitHub" href="https://github.com/trybick/tv-minder" isExternal>
          <Icon as={FaGithub} h="1.7rem" id="bubbles" transition="color 0.2s" w="1.3rem" />
        </Link>

        <Box color="#a0a4a6" ml="auto">
          © {new Date().getFullYear()}
          {` `}
          <Text display="inline">TV-Minder</Text>
        </Box>

        <Button
          bg="primary"
          color="white"
          ml="auto"
          onClick={onOpen}
          rightIcon={<FaRegComment />}
          size="sm"
        >
          Feedback
        </Button>
        <FeedbackModal disclosureProps={disclosureProps} />
      </Flex>
    </Box>
  );
};

export default Footer;
