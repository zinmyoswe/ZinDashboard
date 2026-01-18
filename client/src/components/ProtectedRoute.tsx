import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();

  // Check if user is authenticated
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');

  if (!token || !userData) {
    // Not authenticated, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const user = JSON.parse(userData);

    // Check if user has admin role (role 1)
    // Handle both string and number types
    const userRole = typeof user.role === 'string' ? parseInt(user.role) : user.role;
    if (userRole !== 1) {
      // Not an admin, redirect to home
      return <Navigate to="/" replace />;
    }

    // User is authenticated and is admin, allow access
    return <>{children}</>;
  } catch (error) {
    // Invalid user data, clear storage and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

export default ProtectedRoute;