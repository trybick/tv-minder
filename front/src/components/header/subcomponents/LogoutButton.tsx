import { connect } from 'react-redux';
import { Button } from '@chakra-ui/react';
import { AppThunkDispatch, AppThunkPlainAction } from 'store';
import { setIsLoggedOutAction } from 'store/user/actions';
import { PlainFunction } from 'types/common';

type OwnProps = {
  closeHeader: PlainFunction;
};

type DispatchProps = {
  setIsLoggedOut: AppThunkPlainAction;
};

type Props = OwnProps & DispatchProps;

const LogoutButton = ({ closeHeader, setIsLoggedOut }: Props) => {
  const onLogout = () => {
    localStorage.removeItem('jwt');
    closeHeader();
    setIsLoggedOut();
  };

  return (
    <Button colorPalette="red" onClick={onLogout} size="xs" variant="surface">
      Logout
    </Button>
  );
};

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
  setIsLoggedOut: () => dispatch(setIsLoggedOutAction()),
});

export default connect<{}, DispatchProps, OwnProps, {}>(
  null,
  mapDispatchToProps
)(LogoutButton);
