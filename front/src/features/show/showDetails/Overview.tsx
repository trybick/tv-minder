import { Box, Text } from '@chakra-ui/react';

import { DelayedSkeletonText } from '~/components/DelayedSkeletonText';
import { useAppSelector } from '~/store';
import { selectIsLoadingShowDetails } from '~/store/tv/selectors';
import type { ShowForDisplay } from '~/store/tv/types/transformed';

type Props = {
  show?: ShowForDisplay | null;
};

export const Overview = ({ show }: Props) => {
  const isLoading = useAppSelector(selectIsLoadingShowDetails);
  const { overview } = show || {};

  if (!isLoading && !overview) {
    return null;
  }

  return (
    <Box mb={5}>
      {isLoading ? (
        <DelayedSkeletonText isLoading={isLoading} noOfLines={6} w="100%" />
      ) : (
        <Text color="fg" fontSize="md" lineHeight="1.7" letterSpacing="0.01em">
          {overview}
        </Text>
      )}
    </Box>
  );
};
