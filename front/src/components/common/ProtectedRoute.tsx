import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'wouter';
import { selectIsLoggedIn } from 'store/user/selectors';
import { ROUTES } from 'constants/routes';

type Props = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const isUserLoggedIn = useSelector(selectIsLoggedIn);

  return isUserLoggedIn ? <>{children}</> : <Redirect to={ROUTES.HOME} />;
};

export default ProtectedRoute;
