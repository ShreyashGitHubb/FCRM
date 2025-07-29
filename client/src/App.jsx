import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"
import { ToastProvider } from "./components/ui/Toast"
import ProtectedRoute from "./routes/ProtectedRoute"
import Layout from "./components/Layout"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Leads from "./pages/Leads"
import Deals from "./pages/Deals"
import Tasks from "./pages/Tasks"
import Tickets from "./pages/Tickets"
import Users from "./pages/Users"
import Portal from "./pages/Portal"
import PendingApprovals from "./pages/PendingApprovals"
import Forbidden from "./pages/Forbidden"
import Contacts from "./pages/Contacts"
import Accounts from "./pages/Accounts"
import Projects from "./pages/Projects"
import AdminDashboard from "./pages/AdminDashboard"
import ImportExport from "./pages/ImportExport"
import EmailCenter from "./pages/EmailCenter"

// Wrapper components for each route
const DashboardPage = () => (
  <Layout>
    <Dashboard />
  </Layout>
)

const LeadsPage = () => (
  <Layout>
    <Leads />
  </Layout>
)

const DealsPage = () => (
  <Layout>
    <Deals />
  </Layout>
)

const TasksPage = () => (
  <Layout>
    <Tasks />
  </Layout>
)

const TicketsPage = () => (
  <Layout>
    <Tickets />
  </Layout>
)

const UsersPage = () => (
  <Layout>
    <Users />
  </Layout>
)

const PortalPage = () => (
  <Layout>
    <Portal />
  </Layout>
)

const PendingApprovalsPage = () => (
  <Layout>
    <PendingApprovals />
  </Layout>
)

const ContactsPage = () => (
  <Layout>
    <Contacts />
  </Layout>
)

const AccountsPage = () => (
  <Layout>
    <Accounts />
  </Layout>
)

const ProjectsPage = () => (
  <Layout>
    <Projects />
  </Layout>
)

const AdminDashboardPage = () => (
  <Layout>
    <AdminDashboard />
  </Layout>
)

const ImportExportPage = () => (
  <Layout>
    <ImportExport />
  </Layout>
)

const EmailCenterPage = () => (
  <Layout>
    <EmailCenter />
  </Layout>
)

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/403" element={<Forbidden />} />

              {/* Protected Routes */}
              <Route path="/" element={<ProtectedRoute element={DashboardPage} />} />
              <Route path="/leads" element={<ProtectedRoute element={LeadsPage} />} />
              <Route path="/deals" element={<ProtectedRoute element={DealsPage} />} />
              <Route path="/tasks" element={<ProtectedRoute element={TasksPage} />} />
              <Route path="/tickets" element={<ProtectedRoute element={TicketsPage} />} />
              <Route path="/users" element={<ProtectedRoute element={UsersPage} />} />
              <Route path="/portal" element={<ProtectedRoute element={PortalPage} />} />
              <Route path="/pending-approvals" element={<ProtectedRoute element={PendingApprovalsPage} />} />
              <Route path="/contacts" element={<ProtectedRoute element={ContactsPage} />} />
              <Route path="/accounts" element={<ProtectedRoute element={AccountsPage} />} />
              <Route path="/projects" element={<ProtectedRoute element={ProjectsPage} />} />
              <Route path="/admin-dashboard" element={<ProtectedRoute element={AdminDashboardPage} />} />
              <Route path="/import-export" element={<ProtectedRoute element={ImportExportPage} />} />
              <Route path="/email-center" element={<ProtectedRoute element={EmailCenterPage} />} />

              {/* Catch all route - redirect to dashboard or login */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
