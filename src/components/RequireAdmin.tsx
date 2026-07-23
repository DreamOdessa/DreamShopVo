import React, { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface RequireAdminProps {
  children: ReactElement;
}

const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user?.isAdmin) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default RequireAdmin;
