import { Link as RouterLink } from 'react-router-dom';
import { Box, Heading, Image, Link } from '@chakra-ui/react';
import { PopularShow as PopularShowType } from 'types/external';
import { imagePath154 } from 'constants/strings';
import FollowButton from './FollowButton';

interface Props {
  show: PopularShowType;
}

const PopularShow = ({ show: { id, name, posterPath } }: Props) => (
  <Box borderRadius="8px" borderWidth="1px" mb="18px" minW="0" ml="20px" w="144px">
    <Link as={RouterLink} to={`/show/${id}`}>
      <Image
        borderRadius="8px 8px 0 0"
        cursor="pointer"
        h="213px"
        src={imagePath154 + posterPath}
      />
    </Link>
    <Box p="8px 12px">
      <Link as={RouterLink} to={`/show/${id}`}>
        <Heading fontSize="sm" textAlign="center" isTruncated>
          {name}
        </Heading>
      </Link>
      <FollowButton showId={id} />
    </Box>
  </Box>
);

export default PopularShow;