import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'store';
import { Redirect } from 'react-router-dom';

export interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }: ProtectedRouteProps) => {
  const isUserLoggedIn = useSelector((state: AppState) => state.user && state.user.isLoggedIn);

  return <>{isUserLoggedIn ? children : <Redirect to="/" />}</>;
};

export default ProtectedRoute;
