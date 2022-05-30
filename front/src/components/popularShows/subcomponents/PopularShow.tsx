import { Link as RouterLink } from 'react-router-dom';
import { Box, Flex, Heading, Image, Link } from '@chakra-ui/react';
import { PopularShow as PopularShowType } from 'types/external';
import { fallbackImagePath } from 'constants/strings';
import { ROUTES } from 'constants/routes';
import { imagePath154 } from 'constants/strings';
import FollowButton from 'components/common/FollowButton';

interface Props {
  show: PopularShowType;
}

const PopularShow = ({ show: { id, name, posterPath } }: Props) => (
  <Box borderRadius="8px" borderWidth="1px" mb="18px" minW="0" ml="20px" w="144px">
    <Link as={RouterLink} to={`${ROUTES.SHOW}/${id}`}>
      <Image
        alt={`popular-show-${name}`}
        borderRadius="8px 8px 0 0"
        cursor="pointer"
        fallbackSrc={fallbackImagePath}
        fallbackStrategy="onError"
        h="213px"
        src={posterPath ? imagePath154 + posterPath : fallbackImagePath}
        w="142px"
      />
    </Link>
    <Flex direction="column" p="8px 12px">
      <Link as={RouterLink} to={`${ROUTES.SHOW}/${id}`}>
        <Heading fontSize="sm" noOfLines={1} textAlign="center">
          {name}
        </Heading>
      </Link>
      <FollowButton m="12px auto 6px" minW="108px" showId={id} size="sm" />
    </Flex>
  </Box>
);

export default PopularShow;
