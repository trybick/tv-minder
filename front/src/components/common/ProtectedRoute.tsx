import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { selectIsLoggedIn } from 'store/user/selectors';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }: Props) => {
  const isUserLoggedIn = useSelector(selectIsLoggedIn);

  return <>{isUserLoggedIn ? children : <Redirect to="/" />}</>;
};

export default ProtectedRoute;
