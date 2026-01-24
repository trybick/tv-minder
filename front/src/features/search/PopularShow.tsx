import { Flex, Heading, Image, Link } from '@chakra-ui/react';
import { MouseEvent, useState } from 'react';

import { ROUTES } from '~/app/routes';
import { FollowButton } from '~/components/FollowButton';
import { useImageUrl } from '~/hooks/useImageUrl';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useNavigateToShow } from '~/hooks/useNavigateToShow';
import { PopularShow as PopularShowType } from '~/store/tv/types/transformed';

type Props = {
  show: PopularShowType;
};

export const PopularShow = ({ show }: Props) => {
  const { id: showId, name, posterPath } = show;
  const isMobile = useIsMobile();
  const navigateToShow = useNavigateToShow();
  const [isImageHovered, setIsImageHovered] = useState(false);

  const { getImageUrl, placeholder } = useImageUrl();
  const posterSource = getImageUrl({ path: posterPath });

  const onShowClick = (e: MouseEvent<HTMLAnchorElement>) => {
    navigateToShow(e, { showId, name, posterSource });
  };

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
      <Link onClick={onShowClick} href={`${ROUTES.SHOW}/${showId}`}>
        <Image
          alt={`popular-show-${name}`}
          borderRadius="8px 8px 0 0"
          cursor="pointer"
          onError={e => (e.currentTarget.src = placeholder)}
          src={posterSource}
          w="100%"
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
          maxHeight="342px"
          objectFit="cover"
          viewTransitionName={`show-image-${showId}`}
        />
      </Link>

      <Flex direction="column" mt="5px" p="8px 12px">
        <Link
          href={`${ROUTES.SHOW}/${showId}`}
          onClick={onShowClick}
          m="0 auto"
          textDecoration={isImageHovered ? 'underline' : 'none'}
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
          showId={showId}
          size={isMobile ? 'sm' : 'md'}
        />
      </Flex>
    </Flex>
  );
};
