import React, { useState } from 'react';
import { connect, MapStateToProps } from 'react-redux';
import axios from 'axios';
import { Badge, Box, Button, Flex, Heading, Text, useToast } from '@chakra-ui/core';
import { setHasLocalWarningToastBeenShownAction } from 'store/follows/actions';
import { FollowReducerState } from 'store/follows/reducers';
import { baseUrl } from 'utils/constants';
import handleErrors from 'utils/handleErrors';
import { isLoggedIn, saveShowToLocalStorage } from 'utils/localStorage';

interface OwnProps {
  show: any;
  userFollows: any;
}

interface StateProps {
  hasLocalWarningToastBeenShown: boolean;
}

interface DispatchProps {
  setHasLocalWarningToastBeenShown: typeof setHasLocalWarningToastBeenShownAction;
}

type Props = StateProps & DispatchProps & OwnProps;

const SearchResult = ({
  hasLocalWarningToastBeenShown,
  setHasLocalWarningToastBeenShown,
  show,
  userFollows,
}: Props) => {
  const isInitiallyFollowed = isLoggedIn && userFollows.includes(String(show.id));
  const [isFollowed, setIsFollowed] = useState(isInitiallyFollowed);
  const [isLoading, setIsLoading] = React.useState(false);
  const toast = useToast();

  const { first_air_date: firstAirDate, id: externalId, name, popularity } = show;
  const yearForDisplay = firstAirDate?.substr(0, 4);
  const popularityForDisplay =
    popularity >= 10 && String(popularity)?.substr(0, 2).replace(/\.$/, '');

  function onFollowShow() {
    setIsLoading(true);
    axios
      .post(
        `${baseUrl}/follow`,
        {
          externalId,
          token: localStorage.getItem('jwt'),
        },
        { timeout: 8000 }
      )
      .then(() => {
        setIsLoading(false);
        setIsFollowed(true);
      })
      .catch((error) => {
        handleErrors(error);
        setIsLoading(false);
      });
  }

  function onUnFollowShow() {
    setIsLoading(true);
    axios
      .delete(`${baseUrl}/follow`, {
        data: {
          externalId,
          token: localStorage.getItem('jwt'),
        },
        timeout: 8000,
      })
      .then(() => {
        setIsLoading(false);
        setIsFollowed(false);
      })
      .catch((error) => {
        handleErrors(error);
        setIsLoading(false);
      });
  }

  // If a user is not signed in, we allow them to click Follow show and we save the shows locally
  // which are later retrieved during the sign up process
  function onLocalSaveShow() {
    saveShowToLocalStorage(externalId);
    setIsFollowed(true);

    if (!hasLocalWarningToastBeenShown) {
      setHasLocalWarningToastBeenShown();

      toast({
        title: `We'll keep track for now.`,
        description: `Be sure to login to save permanently.`,
        status: 'warning',
        duration: 8000,
        isClosable: true,
        position: 'bottom-right',
      });
    }
  }

  function onLocalUnsaveShow() {
    saveShowToLocalStorage(externalId, 'unsave');
    setIsFollowed(false);
  }

  return (
    <Box p={3} mb={4} shadow="md" borderWidth="1px">
      <Flex justify="space-between">
        <Flex align="center">
          <Heading size="md" isTruncated>
            {name}
          </Heading>
        </Flex>

        {isFollowed ? (
          <Button
            minW="88px"
            size="sm"
            leftIcon="check"
            variantColor="teal"
            variant="solid"
            onClick={isLoggedIn ? onUnFollowShow : onLocalUnsaveShow}
            isLoading={isLoading}
          >
            Followed
          </Button>
        ) : (
          <Button
            minW="88px"
            size="sm"
            leftIcon="small-add"
            variantColor="teal"
            variant="outline"
            onClick={isLoggedIn ? onFollowShow : onLocalSaveShow}
            isLoading={isLoading}
          >
            Follow
          </Button>
        )}
      </Flex>

      <Flex mt="6px">
        <Text fontSize=".83rem">{yearForDisplay}</Text>
        {popularityForDisplay && (
          <Flex ml="6px" align="center">
            <Badge variant="subtle" color="green.400">
              {popularityForDisplay}% watching now
            </Badge>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps, FollowReducerState> = (
  state: any
): StateProps => ({
  hasLocalWarningToastBeenShown: state.followReducer.hasLocalWarningToastBeenShown,
});

const mapDispatchToProps = (dispatch: any) => ({
  setHasLocalWarningToastBeenShown: () => dispatch(setHasLocalWarningToastBeenShownAction()),
});

export default connect<StateProps, DispatchProps, OwnProps, FollowReducerState>(
  mapStateToProps,
  mapDispatchToProps
)(SearchResult);
