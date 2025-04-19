import { Flex, Heading, Image, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'wouter';
import FollowButton from '~/components/common/FollowButton';
import { ROUTES } from '~/constants/routes';
import { fallbackImagePath, imagePath342 } from '~/constants/strings';
import { PopularShow as PopularShowType } from '~/types/external';

type Props = {
  show: PopularShowType;
  isMobile: boolean;
};

const PopularShow = ({ show: { id, name, posterPath }, isMobile }: Props) => (
  <Flex
    borderRadius="8px"
    borderWidth="1px"
    direction="column"
    flexGrow="1"
    justifyContent="space-between"
    maxW="270px"
    w={isMobile ? '140px' : '190px'}
  >
    <Link as={RouterLink} href={`${ROUTES.SHOW}/${id}`}>
      <Image
        alt={`popular-show-${name}`}
        borderRadius="8px 8px 0 0"
        cursor="pointer"
        onError={e => (e.currentTarget.src = fallbackImagePath)}
        src={posterPath ? imagePath342 + posterPath : fallbackImagePath}
        w="100%"
      />
    </Link>
    <Flex direction="column" mt="5px" p="8px 12px">
      <Link as={RouterLink} href={`${ROUTES.SHOW}/${id}`} m="0 auto">
        <Heading as="button" cursor="pointer" fontSize="md" lineClamp={1}>
          {name}
        </Heading>
      </Link>
      <FollowButton
        m="14px auto 9px"
        minW="108px"
        showId={id}
        size={isMobile ? 'sm' : 'md'}
      />
    </Flex>
  </Flex>
);

export default PopularShow;
