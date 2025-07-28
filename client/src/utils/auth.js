// src/utils/auth.js
import jwt_decode from 'jwt-decode';
import { hasPermission, getAllowedPaths } from '../permissions/rolePermissions';

export function getUserRoleFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwt_decode(token);
    return decoded.role || null;
  } catch (err) {
    return null;
  }
}

// Check if a user can access a specific URL
export function canAccessUrl(userRole, url) {
  return hasPermission(userRole, url);
}

// Get all allowed URLs for a user role
export function getAllowedUrls(userRole) {
  return getAllowedPaths(userRole);
}

// Validate URL path for security
export function isValidUrl(url) {
  // Check for path traversal attempts
  if (url.includes('..') || url.includes('\\') || url.includes('//')) {
    return false;
  }
  
  // Check for suspicious characters
  const suspiciousChars = ['<', '>', '"', "'", '&', 'script', 'javascript:'];
  const lowerUrl = url.toLowerCase();
  
  for (const char of suspiciousChars) {
    if (lowerUrl.includes(char)) {
      return false;
    }
  }
  
  return true;
}

// Redirect user to their first available page
export function getDefaultRedirectUrl(userRole) {
  const allowedPaths = getAllowedPaths(userRole);
  return allowedPaths.length > 0 ? allowedPaths[0] : '/login';
}
