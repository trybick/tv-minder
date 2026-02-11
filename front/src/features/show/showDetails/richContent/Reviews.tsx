import { Box, Flex, Heading, Link, Text } from '@chakra-ui/react';

import { type ShowReview } from '~/store/tv/types/transformed';
import { dayjs } from '~/utils/dayjs';

const REVIEW_SNIPPET_MAX_CHARS = 360;

const toSnippet = (content: string) => {
  if (content.length <= REVIEW_SNIPPET_MAX_CHARS) {
    return content;
  }

  return `${content.slice(0, REVIEW_SNIPPET_MAX_CHARS).trimEnd()}...`;
};

type Props = {
  reviews: ShowReview[];
};

export const Reviews = ({ reviews }: Props) => {
  return (
    <Box
      border="1px solid"
      borderColor="whiteAlpha.100"
      borderRadius="xl"
      bg="whiteAlpha.50"
      p={4}
    >
      <Heading
        as="h3"
        fontSize={{ base: 'md', md: 'lg' }}
        fontWeight="700"
        letterSpacing="-0.01em"
        mb={3}
      >
        Reviews
      </Heading>
      <Flex direction="column" gap={3}>
        {reviews.slice(0, 3).map(review => (
          <Box
            key={review.id}
            border="1px solid"
            borderColor="whiteAlpha.200"
            borderRadius="lg"
            bg="whiteAlpha.100"
            p={3.5}
          >
            <Flex justify="space-between" gap={4} mb={2} wrap="wrap">
              <Text fontWeight="700" fontSize="sm">
                {review.author}
              </Text>
              <Text color="fg.muted" fontSize="xs">
                {dayjs(review.createdAt).format('MMM D, YYYY')}
              </Text>
            </Flex>
            <Text color="fg.muted" fontSize="sm" lineHeight="1.6" mb={2}>
              {toSnippet(review.content)}
            </Text>
            <Link
              color="cyan.300"
              fontSize="sm"
              href={review.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              Read full review
            </Link>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};
