import { AspectRatio, Flex, Heading, Image, Link } from '@chakra-ui/react';
import { type MouseEvent, useState } from 'react';

import { ROUTES } from '~/app/routes';
import { useImageUrl } from '~/hooks/useImageUrl';
import { useNavigateToShow } from '~/hooks/useNavigateToShow';
import { type ShowForDisplay } from '~/store/tv/types/transformed';

type Props = {
  show: ShowForDisplay;
};

export const Show = (props: Props) => {
  const {
    show: { id, name, posterPath },
  } = props;
  const navigateToShow = useNavigateToShow();
  const [isImageHovered, setIsImageHovered] = useState(false);

  const { getImageUrl, placeholder } = useImageUrl();
  const posterSource = getImageUrl({ path: posterPath });

  const onShowClick = (e: MouseEvent<HTMLAnchorElement>) => {
    navigateToShow(e, { showId: id, name, posterSource });
  };

  return (
    <Flex
      border="1px solid"
      borderColor="border.emphasized"
      borderRadius="6px"
      direction="column"
      key={id}
      shadow="sm"
    >
      <Link onClick={onShowClick} href={`${ROUTES.SHOW}/${id}`} display="block">
        <AspectRatio ratio={2 / 3} w="100%">
          <Image
            alt={`show-${name}`}
            borderRadius="6px 6px 0 0"
            onError={e => (e.currentTarget.src = placeholder)}
            src={posterSource}
            objectFit="cover"
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
            viewTransitionName={`show-image-${id}`}
          />
        </AspectRatio>
      </Link>
      <Flex direction="column" p="14px">
        <Link
          fontSize="16px"
          fontWeight="500"
          m="0 auto"
          onClick={onShowClick}
          textAlign="center"
          textDecoration={isImageHovered ? 'underline' : 'none'}
          _hover={{
            textDecoration: 'underline',
          }}
          href={`${ROUTES.SHOW}/${id}`}
        >
          <Heading as="button" cursor="pointer" fontSize="md" lineClamp={1}>
            {name}
          </Heading>
        </Link>
      </Flex>
    </Flex>
  );
};
