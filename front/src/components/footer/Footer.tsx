import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Separator,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { FaGithub, FaRegComment } from 'react-icons/fa';
import TMDBLogo from 'images/TMDB-logo.svg';
import FeedbackModal from './FeedbackModal';

const Footer = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const disclosureProps = { isOpen: open, onOpen, onClose };

  return (
    <Box mb="6px">
      <Separator />
      <Flex
        alignItems="center"
        fontSize=".85rem"
        justifyContent="space-between"
        p={{ base: '1.4rem', sm: '1.2rem 2rem' }}
      >
        <Flex flexDirection="column" gap="3px">
          <Text fontSize="10px" fontWeight="600">
            Data provided by
          </Text>
          <Link href="https://www.themoviedb.org/" rel="noopener noreferrer" target="_blank">
            <Image alt="The Movie DB logo" h="11px" src={TMDBLogo} />
          </Link>
        </Flex>

        <Link
          aria-label="GitHub"
          display="flex"
          href="https://github.com/trybick/tv-minder"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon as={FaGithub} h="1.7rem" transition="color 0.2s" w="1.3rem" />
        </Link>

        <Button bg="primary" color="white" onClick={onOpen} size="sm">
          Feedback
          <FaRegComment />
        </Button>
        <FeedbackModal disclosureProps={disclosureProps} />
      </Flex>
    </Box>
  );
};

export default Footer;
