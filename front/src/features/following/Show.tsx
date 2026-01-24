import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Flex,
  Image,
  Link,
  Text,
} from '@chakra-ui/react';
import { type MouseEvent, useCallback, useState } from 'react';

import { ROUTES } from '~/app/routes';
import { useImageUrl } from '~/hooks/useImageUrl';
import { useNavigateToShow } from '~/hooks/useNavigateToShow';
import { useAppDispatch, useAppSelector } from '~/store';
import { useUnfollowShowMutation } from '~/store/rtk/api/follow.api';
import {
  selectIsLoggedIn,
  unregisteredUnfollowShow,
} from '~/store/rtk/slices/user.slice';
import { type ShowForDisplay } from '~/store/tv/types/transformed';

type Props = {
  show: ShowForDisplay;
};

export const Show = (props: Props) => {
  const dispatch = useAppDispatch();
  const navigateToShow = useNavigateToShow();

  const {
    show: { id, name, posterPath, firstAirDate, status },
  } = props;
  const yearForDisplay = firstAirDate?.substring(0, 4);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const [unfollowShow] = useUnfollowShowMutation();

  const { getImageUrl, placeholder } = useImageUrl();
  const posterSource = getImageUrl({ path: posterPath });

  const statusForBadge = status.isActiveSeason
    ? ({ label: 'Airing Now', color: 'green.500' } as const)
    : status.isPremieringSoon
      ? ({ label: 'Premiering Soon', color: 'purple.500' } as const)
      : null;

  const onShowClick = (e: MouseEvent<HTMLAnchorElement>) => {
    navigateToShow(e, { showId: id, name, posterSource });
  };

  const onRequestUnfollow = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsConfirmOpen(true);
  }, []);

  const onConfirmUnfollow = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (isLoggedIn) {
        await unfollowShow(id);
      } else {
        dispatch(unregisteredUnfollowShow(id));
      }
      setIsConfirmOpen(false);
    },
    [dispatch, id, isLoggedIn, unfollowShow]
  );

  return (
    <Flex
      direction="column"
      key={id}
      h="100%"
      borderRadius="lg"
      border="1px solid"
      borderColor="whiteAlpha.100"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ borderColor: 'whiteAlpha.400' }}
      position="relative"
    >
      <CloseButton
        onClick={onRequestUnfollow}
        position="absolute"
        right="2"
        size="xs"
        top="2"
        variant="plain"
        color="fg.muted"
        bg="blackAlpha.600"
        _hover={{ color: 'white', bg: 'blackAlpha.800' }}
        zIndex="1"
      />
      <Dialog.Root
        open={isConfirmOpen}
        onOpenChange={e => setIsConfirmOpen(e.open)}
        size="sm"
        lazyMount
        unmountOnExit
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="bg.muted">
            <Dialog.Header>
              <Dialog.Title>Confirm Unfollow</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton color="fg.muted" />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body>
              <Text color="fg.muted" fontSize="md">
                {`Are you sure you want to unfollow ${name}?`}
              </Text>
            </Dialog.Body>
            <Dialog.Footer gap="4">
              <Button
                variant="ghost"
                onClick={() => setIsConfirmOpen(false)}
                color="fg.muted"
              >
                Back
              </Button>
              <Button
                colorPalette="red"
                onClick={onConfirmUnfollow}
                variant="surface"
              >
                Unfollow
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      <Link
        onClick={onShowClick}
        href={`${ROUTES.SHOW}/${id}`}
        display="block"
        position="relative"
      >
        <Image
          alt={`show-${name}`}
          aspectRatio={2 / 3}
          objectFit="cover"
          w="100%"
          onError={e => (e.currentTarget.src = placeholder)}
          src={posterSource}
          viewTransitionName={`show-image-${id}`}
        />

        {statusForBadge && (
          <Box
            position="absolute"
            top="2"
            left="2"
            bg={statusForBadge.color}
            color="white"
            fontSize="xs"
            fontWeight="bold"
            px="2"
            py="1"
            borderRadius="md"
            letterSpacing="0.2px"
            textTransform="uppercase"
          >
            {statusForBadge.label}
          </Box>
        )}
      </Link>
      <Flex direction="column" p="3" gap="2" flex="1" justify="space-between">
        <Box>
          <Link
            onClick={onShowClick}
            href={`${ROUTES.SHOW}/${id}`}
            _hover={{ textDecoration: 'underline' }}
          >
            <Text
              as="button"
              cursor="pointer"
              fontWeight="semibold"
              lineClamp={1}
              fontSize="sm"
            >
              {name}
            </Text>
          </Link>
          {yearForDisplay && (
            <Text fontSize="xs" color="fg.muted" mt="0.5">
              {yearForDisplay}
            </Text>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};
