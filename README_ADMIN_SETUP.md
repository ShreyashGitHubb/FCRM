# CRM Admin and Superadmin Setup

This document explains the admin and superadmin functionality implemented in the CRM system.

## Overview

The CRM system now includes:
- **Super Admin**: Full access to all features, can manage all users and approve registrations
- **Admin**: Same access as super admin, can manage users and approve registrations
- **User Approval System**: New registrations require admin/superadmin approval before login

## Initial Setup

### 1. Create Super Admin User

Run the setup script to create the initial super admin:

\`\`\`bash
cd server
npm run setup
\`\`\`

This will create a super admin user with:
- Email: `admin@crm.com`
- Password: `admin123`
- Role: `super_admin`

**Important**: Change the password after first login!

### 2. Environment Variables

Ensure your `.env` file includes:

\`\`\`env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
\`\`\`

## User Roles and Permissions

### Super Admin
- **Access**: All pages and features
- **User Management**: Create, edit, delete users
- **Approval**: Approve/reject new user registrations
- **Navigation**: Dashboard, Leads, Deals, Tasks, Tickets, Users, Portal, Pending Approvals

### Admin
- **Access**: All pages and features (same as super admin)
- **User Management**: Create, edit, delete users
- **Approval**: Approve/reject new user registrations
- **Navigation**: Dashboard, Leads, Deals, Tasks, Tickets, Users, Portal, Pending Approvals

### Other Roles
- **Sales Manager/Executive**: Dashboard, Leads, Deals, Tasks
- **Support Agent**: Dashboard, Tasks, Tickets
- **Customer**: Dashboard, Tickets, Portal

## User Registration Flow

1. **User Registration**: New users register with name, email, password, and role
2. **Pending Approval**: Account is created but marked as `isApproved: false`
3. **Admin Review**: Admin or super admin reviews pending approvals
4. **Approval/Rejection**: Admin can approve or reject with optional reason
5. **Login Access**: Only approved users can login

## Admin Features

### Pending Approvals Page
- View all pending user registrations
- See user details (name, email, role, registration date)
- Approve users with one click
- Reject users with optional reason
- Real-time updates after actions

### User Management Page
- View all users in the system
- Create new users (automatically approved)
- Edit user details (name, email, role, status, approval)
- Delete users (cannot delete super admin)
- Filter and manage user permissions

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (requires approval)
- `POST /api/auth/login` - Login (only approved users)
- `GET /api/auth/me` - Get current user info

### User Management (Admin/Super Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/pending-approvals` - Get pending approvals
- `PUT /api/users/:id/approve` - Approve user
- `PUT /api/users/:id/reject` - Reject user

## Security Features

### JWT Authentication
- Tokens include user role for authorization
- Automatic role-based access control
- Token validation on all protected routes

### Approval System
- New registrations require admin approval
- Unapproved users cannot login
- Admin can approve/reject with reasons
- Rejected users are deleted from system

### Role-Based Access Control
- Frontend route protection based on user role
- Backend middleware validates permissions
- Component-level access control
- Navigation items filtered by role

## Database Schema Updates

### User Model
\`\`\`javascript
{
  name: String,
  email: String,
  password: String,
  role: String, // super_admin, admin, sales_manager, sales_executive, support_agent, customer
  isActive: Boolean,
  isApproved: Boolean,
  approvedBy: ObjectId,
  approvedAt: Date,
  createdBy: ObjectId,
  timestamps: true
}
\`\`\`

### UserApproval Model
\`\`\`javascript
{
  userId: ObjectId,
  requestedBy: ObjectId,
  status: String, // pending, approved, rejected
  approvedBy: ObjectId,
  approvedAt: Date,
  rejectionReason: String,
  timestamps: true
}
\`\`\`

## Frontend Components

### New Pages
- **PendingApprovals**: Admin interface for managing approval requests
- **Updated Users**: Enhanced user management with approval status

### Updated Components
- **Layout**: Added pending approvals navigation for admin/super admin
- **Register**: Shows approval message after registration
- **AuthContext**: Handles new registration flow without auto-login

## Usage Instructions

### For Super Admin/Admin
1. Login with admin credentials
2. Navigate to "Pending Approvals" to review new registrations
3. Approve or reject users as needed
4. Use "Users" page to manage existing users
5. Create new users directly from the Users page

### For New Users
1. Register with required information
2. Wait for admin approval
3. Login once approved
4. Access features based on assigned role

## Troubleshooting

### Common Issues
1. **User can't login after registration**: Check if user is approved
2. **Admin can't see pending approvals**: Verify admin role and permissions
3. **Registration fails**: Check MongoDB connection and required fields

### Reset Super Admin
If you need to reset the super admin:
1. Delete the user from MongoDB
2. Run `npm run setup` again
3. Login with new credentials

## Security Notes

- Super admin users cannot be deleted
- JWT tokens include role information
- All admin actions require authentication
- User passwords are hashed with bcrypt
- Approval system prevents unauthorized access
