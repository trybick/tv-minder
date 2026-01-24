import { AspectRatio, Flex, Heading, Image, Link } from '@chakra-ui/react';
import { type MouseEvent, useState } from 'react';

import { ROUTES } from '~/app/routes';
import { FollowButton } from '~/components/FollowButton';
import { useImageUrl } from '~/hooks/useImageUrl';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useNavigateToShow } from '~/hooks/useNavigateToShow';
import { type PopularShow as PopularShowType } from '~/store/tv/types/transformed';

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
      <Link
        onClick={onShowClick}
        href={`${ROUTES.SHOW}/${showId}`}
        display="block"
      >
        <AspectRatio ratio={2 / 3} w="100%">
          <Image
            alt={`popular-show-${name}`}
            borderRadius="8px 8px 0 0"
            cursor="pointer"
            onError={e => (e.currentTarget.src = placeholder)}
            src={posterSource}
            w="100%"
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
            objectFit="cover"
            viewTransitionName={`show-image-${showId}`}
          />
        </AspectRatio>
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
