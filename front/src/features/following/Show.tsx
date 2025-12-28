import { Flex, Heading, Image, Link } from '@chakra-ui/react';
import { MouseEvent, useState } from 'react';

import { ROUTES } from '~/app/routes';
import { ShowNavigationState } from '~/features/show/ShowPage';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useNavigateWithAnimation } from '~/hooks/useNavigateWithAnimation';
import { useAppDispatch } from '~/store';
import { SET_IS_LOADING_SHOW_DETAILS } from '~/store/legacy/tv/actions';
import { ShowForDisplay } from '~/store/legacy/tv/types/transformed';
import { createImageUrl } from '~/utils/createImageUrl';

type Props = {
  show: ShowForDisplay;
};

const Show = (props: Props) => {
  const {
    show: { id, name, posterPath },
  } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigateWithAnimation();
  const isMobile = useIsMobile();
  const [isImageHovered, setIsImageHovered] = useState(false);

  const posterSource = createImageUrl(posterPath, isMobile);

  const onShowClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch({
      type: SET_IS_LOADING_SHOW_DETAILS,
      payload: true,
    });
    const state: ShowNavigationState = {
      posterSource,
      name,
    };
    navigate(`${ROUTES.SHOW}/${id}`, { state });
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
      <Link onClick={onShowClick} href={`${ROUTES.SHOW}/${id}`}>
        <Image
          alt={`show-${name}`}
          borderRadius="6px"
          onError={e => (e.currentTarget.src = createImageUrl(null, isMobile))}
          src={posterSource}
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
          viewTransitionName={`show-image-${id}`}
        />
      </Link>
      <Flex direction="column" p="14px">
        <Link
          fontSize="16px"
          fontWeight="500"
          m="0 auto"
          onClick={onShowClick}
          textAlign="center"
          textDecoration={isImageHovered ? 'underline' : 'none'}
          textUnderlineOffset="2px"
          _hover={{
            textDecoration: 'underline',
          }}
          href={`${ROUTES.SHOW}/${id}`}
        >
          <Heading
            as="button"
            cursor="pointer"
            fontSize="md"
            lineClamp={1}
            color="fg.muted"
          >
            {name}
          </Heading>
        </Link>
      </Flex>
    </Flex>
  );
};

export default Show;
