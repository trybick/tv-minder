import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'wouter';

import { ROUTES } from '~/constants/routes';
import { selectIsLoggedIn } from '~/store/user/selectors';

type Props = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const isUserLoggedIn = useSelector(selectIsLoggedIn);

  return isUserLoggedIn ? <>{children}</> : <Redirect to={ROUTES.HOME} />;
};

export default ProtectedRoute;
