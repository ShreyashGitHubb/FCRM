// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../permissions/rolePermissions';

const ProtectedRoute = ({ element: Component, allowedRoles = null }) => {
  const location = useLocation();
  
  try {
    const { user, isAuthenticated } = useAuth();
    const currentPath = location.pathname;

    // Check if user is authenticated
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    // Security check for path traversal
    const isPathSafe = (path) => {
      return !path.includes('\\') && !path.includes('..') && !path.includes('//');
    };

    if (!isPathSafe(currentPath)) {
      return <Navigate to="/403" replace />;
    }

    // If allowedRoles is specified, check if user's role is in the allowed list
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
      return <Navigate to="/403" replace />;
    }

    // Check if user has permission to access this specific path
    if (!hasPermission(user?.role, currentPath)) {
      return <Navigate to="/403" replace />;
    }

    return <Component />;
  } catch (error) {
    console.error('ProtectedRoute error:', error);
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
