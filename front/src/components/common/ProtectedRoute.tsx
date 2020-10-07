import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'store';
import { Redirect } from 'react-router-dom';
import { selectIsLoggedIn } from 'store/user/selectors';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }: Props) => {
  const isUserLoggedIn = useSelector((state: AppState) => selectIsLoggedIn(state));

  return <>{isUserLoggedIn ? children : <Redirect to="/" />}</>;
};

export default ProtectedRoute;
