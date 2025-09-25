import { Flex, Heading, Image, Link } from '@chakra-ui/react';
import { MouseEvent, useState } from 'react';

import { ROUTES } from '~/app/routes';
import FollowButton from '~/components/FollowButton';
import { ShowNavigationState } from '~/features/show/ShowPage';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useNavigateWithAnimation } from '~/hooks/useNavigateWithAnimation';
import { useAppDispatch } from '~/store';
import { SET_IS_LOADING_BASIC_SHOW_INFO_FOR_SHOW } from '~/store/tv/actions';
import { PopularShow as PopularShowType } from '~/types/external';
import { createImageUrl } from '~/utils/createImageUrl';

type Props = {
  show: PopularShowType;
};

const PopularShow = ({ show }: Props) => {
  const { id, name, posterPath } = show;
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const navigate = useNavigateWithAnimation();
  const [isImageHovered, setIsImageHovered] = useState(false);
  const posterSource = createImageUrl(posterPath);

  const onShowClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
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
      flexGrow="1"
      justifyContent="space-between"
      maxW="238px"
      w={isMobile ? '140px' : '190px'}
      shadow="sm"
    >
      <Link onClick={onShowClick} href={`${ROUTES.SHOW}/${id}`}>
        <Image
          alt={`popular-show-${name}`}
          borderRadius="8px 8px 0 0"
          cursor="pointer"
          onError={e => (e.currentTarget.src = createImageUrl(null))}
          src={posterSource}
          w="100%"
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
          maxHeight="342px"
          objectFit="cover"
          viewTransitionName={`show-image-${id}`}
        />
      </Link>

      <Flex direction="column" mt="5px" p="8px 12px">
        <Link
          href={`${ROUTES.SHOW}/${id}`}
          onClick={onShowClick}
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
