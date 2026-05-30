//frontend/src/routes/AppRoutes.jsx
import { Routes, Route, useLocation } from 'react-router-dom';


{/*import Routers for Super-Admin*/ }
import SuperAdminRegister from '../superadmin/Auth/SuperAdminRegister';
import SuperAdminLogin from '../superadmin/Auth/SuperAdminLogin';
import SuperadminDashboard from '../superadmin/Dashboard/SuperadminDashboard';
import SuperAdminLayout from '../superadmin/Layout/SuperAdminLayout'

import SuperAdminProfile from "../superadmin/pages/SuperAdminProfile";
import SuperAdminAccountSettings from "../superadmin/pages/SuperAdminAccountSettings";
import SuperAdminSecuritySettings from "../superadmin/pages/SuperAdminSecuritySettings";
import SuperAdminOrgHyderabad from "../superadmin/pages/SuperAdminOrgHyderabad";
import SuperAdminOrgBangalore from "../superadmin/pages/SuperAdminOrgBangalore";
import SuperadminIDGeneration from "../superadmin/IDGeneration/IDGeneration";
import GenerateInvoice from '../superadmin/ClientManagement/GenerateInvoice';
import InvoiceHistory from '../superadmin/ClientManagement/InvoiceHistory';
import SuperAdminInvoiceDetails from '../superadmin/ClientManagement/SuperAdminInvoiceDetails';
import AssignProject from '../superadmin/ClientManagement/AssignProject';
import AllProjects from '../superadmin/ClientManagement/Projects/AllProjects';
import ProjectStatus from '../superadmin/ClientManagement/Projects/ProjectStatus';
import ClientManagementDashboard from '../superadmin/ClientManagement/ClientManagementDashboard';
import BillingDashboard from '../superadmin/ClientManagement/Billing/BillingDashboard';
import ProjectDashboard from '../superadmin/ClientManagement/Projects/ProjectDashboard';
import DocumentsDashboard from '../superadmin/ClientManagement/Documents/DocumentsDashboard';
import SecurityDashboard from '../superadmin/ClientManagement/Security/SecurityDashboard';
import ClientManagementUpdates from '../superadmin/ClientManagement/ClientManagementUpdates';
import FlagshipOfferingCustomizer from '../superadmin/UserManagement/FlagshipOfferingCustomizer';
import EntertainmentReelEditor from '../superadmin/UserManagement/EntertainmentReelEditor';
import CreativeDesignEditor from '../superadmin/UserManagement/CreativeDesignEditor';
import SuperAdminUpdates from '../superadmin/Updates/Updates';
import AllClients from '../superadmin/ClientManagement/Clients/AllClients';
import UserManagementDashboard from '../superadmin/UserManagement/UserManagementDashboard';
import UserDetails from '../superadmin/UserManagement/UserDetails';
// import superAdminNavbar from '../superadmin/Navbar/SuperAdminNavbar'
// import superAdminSetting from '../superadmin/Settings/SuperAdminSettings'

{/*import Routers for Admin*/ }
import AdminReg from '../admin/Auth/AdminReg';
// import adminAuthForgetPass from '../admin/Auth/AdminForgetPassword'
import AdminAuthLogin from '../admin/Auth/AdminLogin'
// import adminAuthRest from '../admin/Auth/AdminResetPassword'
// import adminClientList from '../admin/Clients/ClientList'
// import adminClientDetails from '../admin/Clients/ClientDetails'
// import adminCourseCreate from '../admin/Courses/CourseCreate'
// import adminCourseList from '../admin/Courses/CourseList'
import AdminDashboard from '../admin/Dashboard/AdminDashboard'
// import adminInvoiceCreate from '../admin/Invoices/InvoiceCreate'
// import adminInvoiceList from '../admin/Invoices/InvoiceList'
import AdminLayout from '../admin/Layout/AdminLayout'
// import adminActiveLogs from '../admin/Logs/ActivityLogs'
// import adminNavbar from '../admin/Navbar/AdminNavbar'
// import adminNotificationsList from '../admin/Notifications/NotificationList'
// import adminSendNotifications from '../admin/Notifications/SendNotification'
// import adminPayments from '../admin/Payments/PaymentHistory'
// import adminProjectCreate from '../admin/Projects/ProjectCreate'
// import adminProjectDetails from '../admin/Projects/ProjectDetails'
// import adminProjectList from '../admin/Projects/ProjectList'
// import adminReports from '../admin/Reports/AdminReports'
// import adminSalesReports from '../admin/Reports/SalesReport'
// import adminUserReports from '../admin/Reports/UserReport'
// import adminSetting from '../admin/Settings/AdminSettings'
// import adminOrganizationSetting from '../admin/Settings/OrganizationSettings'
// import adminSecuritySetting from '../admin/Settings/SecuritySettings'
// import adminSupportTicketDetails from '../admin/Support/TicketDetails'
// import adminSupportTicketList from '../admin/Support/TicketList'

{/*import Routers for Client*/ }
import ClientAuthReg from '../client/Auth/ClientRegister/ClientRegister';
import ClientAuthForgot from '../client/Auth/ClientForgetPassword/ClientForgetPassword';
import ClientAuthReset from '../client/Auth/ResetPassword/ResetPassword';
import ClientLogin from '../client/Auth/ClientLogin/ClientLogin';

import Clientdashboard from '../client/Dashboard/ClientDashboard';
import ClientLayout from '../client/Layout/ClientLayout';
// import clientMessagesWindowChat from '../client/Messages/ChatWindow'
import ClientMessage from '../client/Messages/Messages'
// import clientNavbar from '../client/Navbar/ClientNavbar';
import ClientPayments from '../client/Payments/Payments';
// import ClientInvoices from '../client/Payments/Payments';
// import clientProfile from '../client/Profile/ClientProfile';
// import clientEditProfile from '../client/Profile/Editprofile/Editprofile';
// import clientLogout from '../client/Profile/Logout/Logout';
// import clientSecuritySettings from '../client/Profile/SecuritySettings/SecuritySettings';
// import clientViewprofile from '../client/Profile/Viewprofile/Viewprofile';
// import clientProjectDetails from '../client/Projects/ProjectDetails';
import ClientProjects from '../client/Projects/Projects';
import ClientSettings from '../client/Settings/Settings';
import ClientSupport from '../client/Support/Support';
// import clientDetails from '../client/Support/TicketDetails';
import ClientTasks from '../client/Tasks/Tasks';
// import clientTaskDetails from '../client/Tasks/TaskDetails';
import Updates from '../client/Updates/Updates';
import ClientDocuments from '../client/Documents/Documents';

{/*import Routers for User*/ }
import UserLogin from '../user/Auth/UserLogin';
import UserRegister from '../user/Auth/UserRegister';
import UserDashboard from '../user/Dashboard/UserDashboard';

// import ProtectedRoute from '../routes/ProtectedRoute';
import { AuthProvider } from '../context/AuthContext';
import RoleBasedRoute from '../routes/RoleBasedRoute';

{/*import Routers for NXOR*/ }
import ContactNXOR from '../components/Contact/Contact';
import HomeNXOR from '../components/Home/Home';
import Notfoundpage from '../components/notFoundPage/notFoundPage';
import EntertainmentReels from '../components/Services/EntertainmentReels/EntertainmentReels'
import CreativeDesigns from '../components/Services/CreativeDesigns/CreativeDesigns'
import TechnicalPlatforms from '../components/Services/TechnicalPlatforms/TechnicalPlatforms'
import Portfolio from '../components/Portfolio/portfolio';
// import serivesdropdown from '../components/Services/Services'
// import sidebarNXOR from '../components/Sidenavbar/Sidenavbar'
import TopbarNXOR from '../components/TopNavbar/TopNavbar'
import TestimonialsNXOR from '../components/Testimonials/Testimonials'
import FooterNXOR from '../components/Footer/Footer'

const AppRoutes = () => {
  const location = useLocation();

  // Define routes where the global TopNavbar should be HIDDEN
  // Typically hidden for dashboard pages where a separate sidebar/layout is used
  const hideNavbarRoutes = ["/superadmin", "/admin", "/client", "/user"];

  const shouldHideNavbar = hideNavbarRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div>
      {/* <AuthProvider> */}
      {!shouldHideNavbar && <TopbarNXOR />}
      {/* <Sidebar /> */}
      <Routes>
        {/* Routers for HomeNXOR */}
        <Route path="/" element={<HomeNXOR />} />
        <Route path="/services/entertainment" element={<EntertainmentReels />} />
        <Route path="/services/designs" element={<CreativeDesigns />} />
        <Route path="/services/platforms" element={<TechnicalPlatforms />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contact" element={<ContactNXOR />} />

        {/* Routers for Super-Admin*/}
        <Route path="/superadmin/register" element={<SuperAdminRegister />} />
        {/* <Route path="/SuperAdmin/Login" element={<SuperAdminLogin />} /> */}
        <Route path="/superadmin/login" element={<SuperAdminLogin />} />
        <Route path="/superadmin/dashboard" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><SuperadminDashboard /></SuperAdminLayout></RoleBasedRoute>} />
        <Route path="/superadmin/profile" element={<RoleBasedRoute allowed={["superadmin"]}> <SuperAdminLayout> <SuperAdminProfile /> </SuperAdminLayout> </RoleBasedRoute>} />
        <Route path="/superadmin/account-settings" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><SuperAdminAccountSettings /></SuperAdminLayout></RoleBasedRoute>} />
        <Route path="/superadmin/security-settings" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><SuperAdminSecuritySettings /></SuperAdminLayout></RoleBasedRoute>} />
        <Route path="/superadmin/org/hyderabad" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><SuperAdminOrgHyderabad /></SuperAdminLayout></RoleBasedRoute>} />
        <Route path="/superadmin/org/bangalore" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><SuperAdminOrgBangalore /></SuperAdminLayout></RoleBasedRoute>} />
        <Route path="/superadmin/idgeneration" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><SuperadminIDGeneration /></SuperAdminLayout></RoleBasedRoute>} />

        <Route path="/superadmin/client-management" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><ClientManagementDashboard /></SuperAdminLayout></RoleBasedRoute>} />
        <Route path="/superadmin/client-management/documents" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><DocumentsDashboard /></SuperAdminLayout></RoleBasedRoute>} />
        <Route path="/superadmin/client-management/all-clients" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><AllClients /></SuperAdminLayout></RoleBasedRoute>} />
        <Route path="/superadmin/user-management" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><UserManagementDashboard /></SuperAdminLayout></RoleBasedRoute>} />
        <Route path="/superadmin/user_management" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><UserManagementDashboard /></SuperAdminLayout></RoleBasedRoute>} />
        <Route path="/superadmin/user management" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><UserManagementDashboard /></SuperAdminLayout></RoleBasedRoute>} />
        <Route path="/superadmin/user-management/user/:id" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><UserDetails /></SuperAdminLayout></RoleBasedRoute>} />
        <Route path="/superadmin/user_management/user/:id" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><UserDetails /></SuperAdminLayout></RoleBasedRoute>} />
        <Route path="/superadmin/user management/user/:id" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><UserDetails /></SuperAdminLayout></RoleBasedRoute>} />

        {/* Billing Routes */}
        <Route path="/superadmin/client-management/billing" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><BillingDashboard /></SuperAdminLayout></RoleBasedRoute>} />
        <Route path="/superadmin/client-management/billing/generate" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><GenerateInvoice /></SuperAdminLayout></RoleBasedRoute>} />
        <Route path="/superadmin/client-management/billing/history" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><InvoiceHistory /></SuperAdminLayout></RoleBasedRoute>} />
        <Route path="/superadmin/invoice/:id" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><SuperAdminInvoiceDetails /></SuperAdminLayout></RoleBasedRoute>} />

        {/* Project Routes */}
        <Route path="/superadmin/client-management/projects" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><ProjectDashboard /></SuperAdminLayout></RoleBasedRoute>} />
        <Route path="/superadmin/client-management/projects/generate" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><AssignProject /></SuperAdminLayout></RoleBasedRoute>} />
        <Route path="/superadmin/client-management/projects/all" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><AllProjects /></SuperAdminLayout></RoleBasedRoute>} />
        <Route path="/superadmin/client-management/projects/status" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><ProjectStatus /></SuperAdminLayout></RoleBasedRoute>} />

        {/* Security Routes */}
        <Route path="/superadmin/client-management/security" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><SecurityDashboard /></SuperAdminLayout></RoleBasedRoute>} />
        <Route path="/superadmin/client-management/updates" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><ClientManagementUpdates /></SuperAdminLayout></RoleBasedRoute>} />
        <Route path="/superadmin/user-management/flagship-offering" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><FlagshipOfferingCustomizer /></SuperAdminLayout></RoleBasedRoute>} />
        <Route path="/superadmin/user-management/entertainment-reels-editor" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><EntertainmentReelEditor /></SuperAdminLayout></RoleBasedRoute>} />
        <Route path="/superadmin/user-management/creative-designs-editor" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><CreativeDesignEditor /></SuperAdminLayout></RoleBasedRoute>} />

        <Route path="/superadmin/updates" element={<RoleBasedRoute allowed={["superadmin"]}><SuperAdminLayout><SuperAdminUpdates /></SuperAdminLayout></RoleBasedRoute>} />

        {/* Routers for Client*/}
        <Route path="/client/signIn" element={<ClientLogin />} />
        <Route path="/client/register" element={<ClientAuthReg />} />
        <Route path="/client/forgot-password" element={<ClientAuthForgot />} />
        <Route path="/client/reset-password/:token" element={<ClientAuthReset />} />
        <Route path="/client/dashboard" element={<RoleBasedRoute allowed={["client"]}><ClientLayout><Clientdashboard /></ClientLayout></RoleBasedRoute>} />
        <Route path="/client/projects" element={<RoleBasedRoute allowed={["client"]}><ClientLayout><ClientProjects /></ClientLayout></RoleBasedRoute>} />
        <Route path="/client/updates" element={<RoleBasedRoute allowed={["client"]}><ClientLayout><Updates /></ClientLayout></RoleBasedRoute>} />
        <Route path="/client/tasks" element={<RoleBasedRoute allowed={["client"]}><ClientLayout><ClientTasks /></ClientLayout></RoleBasedRoute>} />
        <Route path="/client/payments" element={<RoleBasedRoute allowed={["client"]}><ClientLayout><ClientPayments /></ClientLayout></RoleBasedRoute>} />
        <Route path="/client/support" element={<RoleBasedRoute allowed={["client"]}><ClientLayout><ClientSupport /></ClientLayout></RoleBasedRoute>} />
        <Route path="/client/messages" element={<RoleBasedRoute allowed={["client"]}><ClientLayout><ClientMessage /></ClientLayout></RoleBasedRoute>} />
        <Route path="/client/documents" element={<RoleBasedRoute allowed={["client"]}><ClientLayout><ClientDocuments /></ClientLayout></RoleBasedRoute>} />
        <Route path="/client/settings" element={<RoleBasedRoute allowed={["client"]}><ClientLayout><ClientSettings /></ClientLayout></RoleBasedRoute>} />

        {/* USER AUTH */}
        <Route path="/user/signIn" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user" element={<RoleBasedRoute allowed={["user"]}><UserDashboard /></RoleBasedRoute>} />


        {/* ADMIN AUTH */}
        <Route path="/admin/signIn" element={<AdminAuthLogin />} />
        <Route path="/admin/register" element={<AdminReg />} />
        <Route path="/admin/dashboard" element={<RoleBasedRoute allowed={["admin"]}> <AdminLayout> <AdminDashboard /></AdminLayout></RoleBasedRoute>} />
        <Route path="/admin/dashboard" element={<RoleBasedRoute allowedRoles={["admin"]} />}> <Route index element={<AdminDashboard />} /> </Route>

        {/* Optional Not Found Page */}
        <Route path="*" element={<Notfoundpage />} />
      </Routes>
      {!shouldHideNavbar && <FooterNXOR />}
      {/* </AuthProvider> */}
    </div>

  );
};

export default AppRoutes;

