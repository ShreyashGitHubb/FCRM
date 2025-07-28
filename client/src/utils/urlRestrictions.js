import { hasPermission } from '../permissions/rolePermissions';

// List of all protected routes
export const PROTECTED_ROUTES = [
  '/',
  '/leads',
  '/deals', 
  '/tasks',
  '/tickets',
  '/users',
  '/portal'
];

// List of public routes that don't require authentication
export const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/403'
];

// Check if a route is protected
export const isProtectedRoute = (path) => {
  return PROTECTED_ROUTES.includes(path);
};

// Check if a route is public
export const isPublicRoute = (path) => {
  return PUBLIC_ROUTES.includes(path);
};

// Validate user access to a specific route
export const validateRouteAccess = (userRole, path) => {
  // Allow access to public routes
  if (isPublicRoute(path)) {
    return { allowed: true, reason: 'public_route' };
  }

  // Check if it's a protected route
  if (isProtectedRoute(path)) {
    const hasAccess = hasPermission(userRole, path);
    return {
      allowed: hasAccess,
      reason: hasAccess ? 'authorized' : 'unauthorized'
    };
  }

  // Default to denied for unknown routes
  return { allowed: false, reason: 'unknown_route' };
};

// Get redirect URL for unauthorized access
export const getRedirectUrl = (userRole, currentPath) => {
  // If user has no role, redirect to login
  if (!userRole) {
    return '/login';
  }

  // If accessing a public route, allow it
  if (isPublicRoute(currentPath)) {
    return null; // No redirect needed
  }

  // Check if user has access to current path
  const access = validateRouteAccess(userRole, currentPath);
  if (access.allowed) {
    return null; // No redirect needed
  }

  // Redirect to first available page for user's role
  const allowedPaths = ['/', '/leads', '/deals', '/tasks', '/tickets', '/users', '/portal'];
  for (const path of allowedPaths) {
    if (hasPermission(userRole, path)) {
      return path;
    }
  }

  // Fallback to login if no accessible pages
  return '/login';
};

// Prevent direct URL access by checking on route change
export const setupRouteProtection = (navigate, userRole) => {
  const handleRouteChange = (location) => {
    const currentPath = location.pathname;
    const redirectUrl = getRedirectUrl(userRole, currentPath);
    
    if (redirectUrl && redirectUrl !== currentPath) {
      navigate(redirectUrl, { replace: true });
    }
  };

  return handleRouteChange;
};
