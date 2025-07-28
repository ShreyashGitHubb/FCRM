import { useAuth } from '../context/AuthContext';
import { hasPermission, getAllowedPaths } from '../permissions/rolePermissions';

export const usePermissions = () => {
  const { user } = useAuth();

  const canAccess = (path) => {
    if (!user?.role) return false;
    return hasPermission(user.role, path);
  };

  const getAllowedNavigation = () => {
    if (!user?.role) return [];
    return getAllowedPaths(user.role);
  };

  const isAuthorized = (requiredRoles = []) => {
    if (!user?.role) return false;
    if (requiredRoles.length === 0) return true;
    return requiredRoles.includes(user.role);
  };

  const getUserRole = () => {
    return user?.role || null;
  };

  const hasAnyPermission = (paths) => {
    if (!user?.role) return false;
    return paths.some(path => hasPermission(user.role, path));
  };

  return {
    canAccess,
    getAllowedNavigation,
    isAuthorized,
    getUserRole,
    hasAnyPermission,
    userRole: user?.role,
  };
};
