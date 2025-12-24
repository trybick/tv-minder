import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Separator,
  Text,
} from '@chakra-ui/react';
import { FaGithub, FaRegComment } from 'react-icons/fa';

import TMDBLogo from '~/assets/images/TMDB-logo.svg';
import { useAppDispatch } from '~/store';
import { setIsFeedbackModalOpen } from '~/store/rtk/slices/modals.slice';

import FeedbackModal from './FeedbackModal';

const Footer = () => {
  const dispatch = useAppDispatch();

  return (
    <Box mb="6px">
      <Separator size="md" />
      <Flex
        alignItems="center"
        fontSize=".85rem"
        p={{ base: '1.4rem', sm: '1.2rem 2rem' }}
      >
        <Flex flex="1" justifyContent="flex-start">
          <Flex flexDirection="column" gap="3px">
            <Text fontSize="10px" fontWeight="600">
              Data provided by
            </Text>
            <Link
              href="https://www.themoviedb.org/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Image alt="The Movie DB logo" h="11px" src={TMDBLogo} />
            </Link>
          </Flex>
        </Flex>

        <Flex flex="1" justifyContent="center">
          <Link
            aria-label="GitHub"
            display="flex"
            href="https://github.com/trybick/tv-minder"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icon
              as={FaGithub}
              color="fg.subtle"
              h="1.7rem"
              transition="color 0.2s"
              w="1.3rem"
            />
          </Link>
        </Flex>

        <Flex flex="1" justifyContent="flex-end">
          <Button
            colorPalette="cyan"
            onClick={() => dispatch(setIsFeedbackModalOpen(true))}
            size="sm"
          >
            Feedback
            <FaRegComment />
          </Button>
        </Flex>
      </Flex>
      <FeedbackModal />
    </Box>
  );
};

export default Footer;
