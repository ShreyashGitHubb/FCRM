# Role-Based Access Control (RBAC) System

This document describes the implementation of role-based access control in the CRM application.

## Overview

The RBAC system restricts user access to specific pages and sidebar navigation items based on their assigned role. Users can only access pages and see navigation items that are permitted for their role.

## Role Hierarchy

### Available Roles:
1. **super_admin** - Full access to all features
2. **admin** - Administrative access to most features
3. **sales_manager** - Access to sales-related features
4. **sales_executive** - Limited sales access
5. **support_agent** - Support ticket management
6. **customer** - Customer portal access

## Permission Matrix

| Role | Dashboard | Leads | Deals | Tasks | Tickets | Users | Portal |
|------|-----------|-------|-------|-------|---------|-------|--------|
| super_admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| sales_manager | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| sales_executive | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| support_agent | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| customer | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |

## Implementation Details

### 1. Permission Configuration (`permissions/rolePermissions.js`)
- Defines allowed paths for each role
- Includes helper functions for permission checking
- Supports role hierarchy for future expansion

### 2. Protected Route Component (`routes/ProtectedRoute.jsx`)
- Validates user authentication
- Checks role-based permissions
- Prevents path traversal attacks
- Redirects unauthorized access to 403 page

### 3. Layout Component (`components/Layout.jsx`)
- Dynamically shows sidebar navigation based on user permissions
- Uses `usePermissions` hook for clean permission checking
- Shows appropriate message when no navigation items are available

### 4. Permission Hook (`hooks/usePermissions.js`)
- Provides clean API for permission checking
- Includes functions for:
  - `canAccess(path)` - Check if user can access specific path
  - `getAllowedNavigation()` - Get all allowed navigation items
  - `isAuthorized(roles)` - Check if user has any of specified roles
  - `hasAnyPermission(paths)` - Check if user has access to any of the paths

### 5. URL Restrictions (`utils/urlRestrictions.js`)
- Prevents direct URL access to unauthorized pages
- Handles route validation and redirection
- Supports both protected and public routes

## Security Features

### 1. Path Traversal Protection
- Prevents `../` and `\\` in URLs
- Blocks suspicious characters like `<`, `>`, `"`, `'`, `&`
- Validates URL format before processing

### 2. Authentication Checks
- Verifies user is logged in before accessing protected routes
- Redirects to login page for unauthenticated users
- Maintains session state across page refreshes

### 3. Role-Based Access Control
- Enforces role-specific permissions at route level
- Prevents unauthorized access through direct URL manipulation
- Provides clear feedback for access denied scenarios

## Usage Examples

### Checking Permissions in Components
\`\`\`javascript
import { usePermissions } from '../hooks/usePermissions';

const MyComponent = () => {
  const { canAccess, isAuthorized } = usePermissions();
  
  // Check if user can access specific page
  if (canAccess('/users')) {
    // Show admin features
  }
  
  // Check if user has specific role
  if (isAuthorized(['admin', 'super_admin'])) {
    // Show admin-only content
  }
};
\`\`\`

### Adding New Protected Routes
1. Add the route to `PROTECTED_ROUTES` in `utils/urlRestrictions.js`
2. Add the route to `rolePermissions` in `permissions/rolePermissions.js`
3. Create the route in `App.jsx` with `ProtectedRoute` wrapper
4. Add navigation item to `Layout.jsx` if needed

### Adding New Roles
1. Define role permissions in `rolePermissions.js`
2. Update role hierarchy if needed
3. Test with different user accounts

## Testing the System

### Test Cases:
1. **Customer Access**: Should only see Dashboard, Tickets, and Portal
2. **Sales Executive**: Should only see Dashboard, Leads, Deals, and Tasks
3. **Support Agent**: Should only see Dashboard, Tasks, and Tickets
4. **Admin**: Should see all navigation items
5. **Direct URL Access**: Users should be redirected to 403 page for unauthorized routes

### Manual Testing Steps:
1. Login with different user roles
2. Verify sidebar shows only allowed navigation items
3. Try accessing unauthorized pages via direct URL
4. Check that 403 page is displayed for unauthorized access
5. Verify logout functionality works correctly

## Error Handling

### 403 Forbidden Page
- Displays when users try to access unauthorized routes
- Shows current user information
- Provides navigation options to go back or to dashboard
- Includes contact information for access requests

### Redirect Logic
- Unauthenticated users → Login page
- Unauthorized access → 403 page
- Unknown routes → Dashboard or Login
- Session expiration → Login page

## Future Enhancements

1. **Dynamic Permissions**: Load permissions from server
2. **Granular Permissions**: Page-level and action-level permissions
3. **Permission Groups**: Group-based permission management
4. **Audit Logging**: Track permission checks and access attempts
5. **Role Inheritance**: Support for role hierarchies and inheritance

## Troubleshooting

### Common Issues:
1. **Navigation not showing**: Check user role and permissions
2. **403 errors**: Verify role has access to requested path
3. **Redirect loops**: Check authentication state and role assignment
4. **Permission not working**: Verify role name matches exactly

### Debug Information:
- User role is displayed in sidebar
- Current path is shown in active navigation item
- 403 page shows user information for debugging
