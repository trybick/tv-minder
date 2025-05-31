import { Flex, Heading, Image, Link } from '@chakra-ui/react';
import { useState } from 'react';

import { ROUTES } from '~/app/routes';
import { useNavigateWithAnimation } from '~/hooks/useNavigateWithAnimation';
import { ShowNavigationState } from '~/features/show/ShowPage';
import { useAppDispatch } from '~/store';
import { SET_IS_LOADING_BASIC_SHOW_INFO_FOR_SHOW } from '~/store/tv/actions';
import { BasicShowInfo } from '~/types/external';
import { createImageUrl } from '~/utils/createImageUrl';

type Props = {
  show: BasicShowInfo;
};

const Show = (props: Props) => {
  const {
    show: { id, name, posterPath },
  } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigateWithAnimation();
  const [isImageHovered, setIsImageHovered] = useState(false);

  const posterSource = createImageUrl(posterPath);

  const onShowClick = () => {
    dispatch({
      type: SET_IS_LOADING_BASIC_SHOW_INFO_FOR_SHOW,
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
      <Link onClick={onShowClick}>
        <Image
          alt={`show-${name}`}
          borderRadius="6px"
          onError={e => (e.currentTarget.src = createImageUrl(null))}
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
        >
          <Heading as="button" cursor="pointer" fontSize="md" lineClamp={1}>
            {name}
          </Heading>
        </Link>
      </Flex>
    </Flex>
  );
};

export default Show;
