import { ReactNode } from 'react';
import { Redirect } from 'wouter';

import { ROUTES } from '~/constants/routes';
import { useAppSelector } from '~/store';
import { selectIsLoggedIn } from '~/store/user/selectors';

type Props = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const isUserLoggedIn = useAppSelector(selectIsLoggedIn);

  return isUserLoggedIn ? <>{children}</> : <Redirect to={ROUTES.HOME} />;
};

export default ProtectedRoute;
