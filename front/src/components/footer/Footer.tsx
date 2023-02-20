import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Image,
  Link,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { FaGithub, FaRegComment } from 'react-icons/fa';
import TMDBLogo from 'images/TMDB-logo.svg';
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
        <Flex flexDirection="column" gap="3px">
          <Text fontSize="11px" fontWeight="600">
            Data provided by
          </Text>
          <Link href="https://www.themoviedb.org/" isExternal>
            <Image alt="The Movie DB logo" h="13px" src={TMDBLogo} />
          </Link>
        </Flex>

        <Link
          aria-label="GitHub"
          display="flex"
          href="https://github.com/trybick/tv-minder"
          isExternal
        >
          <Icon as={FaGithub} h="1.7rem" transition="color 0.2s" w="1.3rem" />
        </Link>

        <Button
          bg="primary"
          color="white"
          // ml="auto"
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
