# Enhanced CRM System

A comprehensive Customer Relationship Management system built with Node.js, Express, MongoDB, and React.

## 🚀 New Features Added

### 1. Contact & Account Management
- **Contacts Module**: Manage individual contacts with detailed information
- **Accounts Module**: Manage companies/organizations with multiple contacts
- Full CRUD operations with role-based access control

### 2. Project Management
- **Projects Module**: Track projects with milestones and team members
- **Kanban-style tracking**: Monitor project progress and status
- **Team collaboration**: Assign multiple team members to projects
- **Milestone management**: Track project milestones with due dates

### 3. Enhanced Analytics & Reporting
- **Admin Dashboard**: Comprehensive analytics for administrators
- **Sales Analytics**: Performance metrics by user and pipeline stage
- **Revenue Tracking**: Total revenue, average deal size, conversion rates
- **Trend Analysis**: Monthly trends and performance indicators

### 4. Email Integration
- **Email Center**: Send emails using predefined templates
- **Bulk Email**: Send emails to multiple contacts/leads at once
- **Template System**: Customizable email templates with variables
- **SMTP Integration**: Uses Nodemailer for email delivery

### 5. Data Import/Export
- **CSV Export**: Export leads, contacts, and deals to CSV format
- **CSV Import**: Import leads from CSV files with validation
- **Bulk Operations**: Handle large datasets efficiently
- **Error Reporting**: Detailed import error reporting

### 6. Audit Logging & Security
- **Activity Tracking**: Log all user actions (create, update, delete)
- **Admin Audit Logs**: View system-wide activity logs
- **IP Address Tracking**: Track user IP addresses and user agents
- **Security Monitoring**: Monitor system access and changes

### 7. Pipeline Management
- **Custom Pipelines**: Create custom sales pipelines
- **Stage Management**: Define pipeline stages with probabilities
- **Visual Pipeline**: Color-coded pipeline stages
- **Default Pipeline**: System-wide default pipeline configuration

### 8. Call Logging (Mock)
- **Call Records**: Log inbound and outbound calls
- **Contact Integration**: Link calls to contacts and deals
- **Follow-up Tracking**: Track required follow-ups
- **Call Analytics**: Duration, status, and outcome tracking

### 9. Enhanced Client Portal
- **Customer Access**: Customers can view their projects and tickets
- **Secure Access**: Role-based access for customer portal
- **Project Visibility**: Customers see projects they're involved in
- **Ticket Management**: View and track support tickets

### 10. Advanced User Management
- **Role-based Permissions**: Granular access control
- **User Approval System**: Admin approval for new registrations
- **Team Management**: Assign team members to projects
- **Activity Monitoring**: Track user activities and login history

## 🛠 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Nodemailer** - Email integration
- **Multer** - File upload handling
- **CSV Parser** - CSV processing

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **Axios** - HTTP client
- **React Router** - Routing
- **Context API** - State management

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- SMTP email account (Gmail, Outlook, etc.)

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd enhanced-crm-system
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd server
npm install
\`\`\`

### 3. Environment Configuration
Create a `.env` file in the server directory:
\`\`\`env
# Database
MONGO_URI=mongodb://localhost:27017/crm_enhanced

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com

# Server
PORT=5000
NODE_ENV=development
\`\`\`

### 4. Database Setup
\`\`\`bash
# Create admin user
node setup-admin.js

# Seed sample data (optional)
node seed-sample-data.js
\`\`\`

### 5. Frontend Setup
\`\`\`bash
cd ../client
npm install
\`\`\`

### 6. Start the Application

**Backend (Terminal 1):**
\`\`\`bash
cd server
npm run dev
\`\`\`

**Frontend (Terminal 2):**
\`\`\`bash
cd client
npm run dev
\`\`\`

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🔐 Default Login Credentials

After running the setup script, you can login with:
- **Email**: admin@crm.com
- **Password**: admin123
- **Role**: super_admin

## 📋 User Roles & Permissions

### Super Admin
- Full system access
- User management and approval
- System configuration
- All modules access

### Admin
- User management and approval
- All CRM modules
- Analytics and reporting
- Import/export functionality

### Sales Manager
- Lead and deal management
- Contact and account management
- Project management
- Team performance analytics
- Email center access

### Sales Executive
- Assigned leads and deals
- Contact management
- Project participation
- Email center access

### Support Agent
- Ticket management
- Task management
- Project participation

### Customer
- Portal access
- View own tickets and projects
- Limited system access

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Core Modules
- `GET|POST|PUT|DELETE /api/leads` - Lead management
- `GET|POST|PUT|DELETE /api/deals` - Deal management
- `GET|POST|PUT|DELETE /api/contacts` - Contact management
- `GET|POST|PUT|DELETE /api/accounts` - Account management
- `GET|POST|PUT|DELETE /api/projects` - Project management
- `GET|POST|PUT|DELETE /api/tasks` - Task management
- `GET|POST|PUT|DELETE /api/tickets` - Ticket management

### Advanced Features
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/sales` - Sales analytics
- `POST /api/email/send` - Send email
- `POST /api/email/bulk` - Send bulk email
- `GET /api/import-export/*/export` - Export data
- `POST /api/import-export/*/import` - Import data
- `GET /api/audit-logs` - Audit logs
- `GET|POST|PUT /api/pipelines` - Pipeline management
- `GET|POST|PUT /api/call-logs` - Call logging

## 📊 Features Overview

### Dashboard Analytics
- Total records count (leads, deals, contacts, accounts)
- Revenue metrics and conversion rates
- Project status overview
- Monthly trends and performance indicators

### Email Integration
- SMTP configuration for email sending
- Template-based email system
- Bulk email capabilities
- Variable substitution in templates

### Import/Export
- CSV export for leads, contacts, and deals
- CSV import with validation and error reporting
- Bulk data operations
- Format guidelines and templates

### Project Management
- Project creation with milestones
- Team member assignment
- Progress tracking
- Status management (planning, active, completed, etc.)

### Audit & Security
- User activity logging
- IP address and user agent tracking
- Admin access to audit logs
- Security monitoring

## 🚀 Usage Guide

### 1. Initial Setup
1. Start with creating an admin user using `setup-admin.js`
2. Login with admin credentials
3. Create additional users and approve them
4. Set up accounts and contacts
5. Configure email settings

### 2. Daily Operations
1. **Lead Management**: Import leads or create manually
2. **Contact Management**: Link contacts to accounts
3. **Deal Management**: Convert leads to deals
4. **Project Management**: Create projects for customers
5. **Email Marketing**: Send targeted emails to contacts

### 3. Analytics & Reporting
1. **Dashboard**: Monitor key metrics
2. **Sales Analytics**: Track team performance
3. **Export Data**: Generate reports in CSV format
4. **Audit Logs**: Monitor system activity

### 4. Administration
1. **User Management**: Approve new users
2. **Pipeline Configuration**: Set up sales pipelines
3. **System Monitoring**: Review audit logs
4. **Data Management**: Import/export operations

## 🔍 Troubleshooting

### Common Issues

**Email not sending:**
- Check SMTP configuration in .env file
- Verify email credentials
- Check firewall settings

**Import failing:**
- Verify CSV format matches requirements
- Check for required fields
- Review error messages in import results

**Permission denied:**
- Verify user role and permissions
- Check role-based access configuration
- Ensure user is approved and active

**Database connection issues:**
- Verify MongoDB is running
- Check MONGO_URI in .env file
- Ensure database permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Create an issue in the repository
4. Contact the development team

---

**Enhanced CRM System** - A comprehensive solution for modern customer relationship management.
\`\`\`

Finally, let's add some CSS styles to make the new components look better:

```css file="client/src/index.css"
[v0-no-op-code-block-prefix]/* Enhanced CRM Styles */

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
}

.stat {
  text-align: center;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: #f9f9f9;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.stat-label {
  display: block;
  font-size: 0.8rem;
  color: #666;
  margin-top: 5px;
}

/* Tabs */
.tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
}

.tab {
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.tab:hover {
  background: #f5f5f5;
}

.tab.active {
  border-bottom-color: #007bff;
  color: #007bff;
  font-weight: bold;
}

/* Progress Bar */
.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #4CAF50;
  transition: width 0.3s ease;
}

/* Alert Styles */
.alert {
  padding: 15px;
  border-radius: 4px;
  margin: 10px 0;
}

.alert-success {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.alert-danger {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.alert-info {
  background: #d1ecf1;
  border: 1px solid #bee5eb;
  color: #0c5460;
}

/* Chart Container */
.chart-container {
  max-height: 400px;
  overflow-y: auto;
}

/* Email Center Styles */
.recipient-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 4px;
}

.recipient-item {
  display: flex;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #f0f0f0;
}

.recipient-item:last-child {
  border-bottom: none;
}

.recipient-checkbox {
  margin-right: 10px;
}

/* Project Milestone Styles */
.milestone-item {
  border: 1px solid #ddd;
  padding: 15px;
  margin: 10px 0;
  border-radius: 4px;
  background: #f9f9f9;
}

.milestone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.milestone-status {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.milestone-status.pending {
  background: #fff3cd;
  color: #856404;
}

.milestone-status.completed {
  background: #d4edda;
  color: #155724;
}

.milestone-status.overdue {
  background: #f8d7da;
  color: #721c24;
}

/* Import/Export Styles */
.file-upload-area {
  border: 2px dashed #ddd;
  padding: 40px;
  text-align: center;
  border-radius: 4px;
  margin: 20px 0;
  transition: border-color 0.3s ease;
}

.file-upload-area:hover {
  border-color: #007bff;
}

.file-upload-area.dragover {
  border-color: #007bff;
  background: #f8f9fa;
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .tabs {
    flex-wrap: wrap;
  }
  
  .tab {
    flex: 1;
    min-width: 120px;
  }
}

/* Loading States */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  font-size: 1.1rem;
  color: #666;
}

.loading::after {
  content: '';
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-left: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Enhanced Modal Styles */
.modal-content {
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h3 {
  margin-top: 0;
  color: #333;
}

.modal-content .form-group {
  margin-bottom: 15px;
}

.modal-content .form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

/* Button Groups */
.btn-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-group .btn {
  flex: 1;
  min-width: 120px;
}

/* Status Indicators */
.status-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}

.status-indicator.active {
  background: #28a745;
}

.status-indicator.inactive {
  background: #6c757d;
}

.status-indicator.pending {
  background: #ffc107;
}

.status-indicator.overdue {
  background: #dc3545;
}
