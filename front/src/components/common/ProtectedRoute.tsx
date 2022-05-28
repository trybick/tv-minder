import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { selectIsLoggedIn } from 'store/user/selectors';
import { ROUTES } from 'constants/routes';

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const isUserLoggedIn = useSelector(selectIsLoggedIn);

  return isUserLoggedIn ? <>{children}</> : <Redirect to={ROUTES.HOME} />;
};

export default ProtectedRoute;
