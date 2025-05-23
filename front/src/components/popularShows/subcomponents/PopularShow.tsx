import { Flex, Heading, Image, Link } from '@chakra-ui/react';
import { useState } from 'react';

import FollowButton from '~/components/common/FollowButton';
import { ROUTES } from '~/constants/routes';
import { fallbackImagePath, imagePath342 } from '~/constants/strings';
import { useNavigateWithAnimation } from '~/hooks/useNavigateWithAnimation';
import { PopularShow as PopularShowType } from '~/types/external';

type Props = {
  show: PopularShowType;
  isMobile: boolean;
};

const PopularShow = ({ show: { id, name, posterPath }, isMobile }: Props) => {
  const navigate = useNavigateWithAnimation();
  const [isImageHovered, setIsImageHovered] = useState(false);

  return (
    <Flex
      border="1px solid"
      borderColor="border.emphasized"
      borderRadius="6px"
      direction="column"
      flexGrow="1"
      justifyContent="space-between"
      maxW="238px"
      w={isMobile ? '140px' : '190px'}
      shadow="sm"
    >
      <Link onClick={() => navigate(`${ROUTES.SHOW}/${id}`)}>
        <Image
          alt={`popular-show-${name}`}
          borderRadius="8px 8px 0 0"
          cursor="pointer"
          onError={e => (e.currentTarget.src = fallbackImagePath)}
          src={posterPath ? imagePath342 + posterPath : fallbackImagePath}
          w="100%"
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
          maxHeight="342px"
          objectFit="cover"
        />
      </Link>

      <Flex direction="column" mt="5px" p="8px 12px">
        <Link
          onClick={() => navigate(`${ROUTES.SHOW}/${id}`)}
          m="0 auto"
          textDecoration={isImageHovered ? 'underline' : 'none'}
          textUnderlineOffset="2px"
          _hover={{
            textDecoration: 'underline',
          }}
        >
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
};

export default PopularShow;
