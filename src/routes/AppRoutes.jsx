import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import MainLayout from '../components/layout/MainLayout';
import ScrollToTop from '../components/common/ScrollToTop';

/* Public pages */
import Home from '../pages/Home';
import Internships from '../pages/Internships';
import InternshipDetails from '../pages/InternshipDetails';
import VerifyCertificate from '../pages/VerifyCertificate';
import Projects from '../pages/Projects';
import ProjectDetails from '../pages/ProjectDetails';
import Services from '../pages/Services';
import Sessions from '../pages/Sessions';
import CampusAmbassador from '../pages/CampusAmbassador';
import Courses from '../pages/Courses';
import CourseDetails from '../pages/CourseDetails';
import Contact from '../pages/Contact';
import About from '../pages/About';
import NotFound from '../pages/NotFound';

/* Auth pages */
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';

/* Student portal */
import PortalDashboard from '../pages/portal/PortalDashboard';
import BrowseInternships from '../pages/portal/BrowseInternships';
import ApplyInternship from '../pages/portal/ApplyInternship';
import MyApplications from '../pages/portal/MyApplications';
import MyCourses from '../pages/portal/MyCourses';
import MyCertificates from '../pages/portal/MyCertificates';
import Profile from '../pages/portal/Profile';
import Settings from '../pages/portal/Settings';

/* Admin panel */
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageInternships from '../pages/admin/ManageInternships';
import ManageApplications from '../pages/admin/ManageApplications';
import ManageStudents from '../pages/admin/ManageStudents';
import ManageCourses from '../pages/admin/ManageCourses';
import ManageCertificates from '../pages/admin/ManageCertificates';
import ManageProjects from '../pages/admin/ManageProjects';
import ManageMessages from '../pages/admin/ManageMessages';

/* Campus Ambassador portal */
import AmbassadorHome from '../pages/ambassador/AmbassadorHome';
import AmbassadorDashboard from '../pages/ambassador/AmbassadorDashboard';
import AmbassadorTasks from '../pages/ambassador/AmbassadorTasks';
import SubmitTask from '../pages/ambassador/SubmitTask';
import MySubmissions from '../pages/ambassador/MySubmissions';
import AmbassadorEvents from '../pages/ambassador/AmbassadorEvents';
import AmbassadorResources from '../pages/ambassador/AmbassadorResources';
import AmbassadorLeaderboard from '../pages/ambassador/AmbassadorLeaderboard';
import AmbassadorAchievements from '../pages/ambassador/AmbassadorAchievements';

/** Wait for the session to hydrate before deciding on a redirect. */
function Gate({ children }) {
  const { ready } = useAuth();
  if (!ready) return null;
  return children;
}

/** Require an authenticated user; bounce guests to /login and remember where they came from. */
function RequireAuth({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  // Admins don't use the student portal shell.
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  return children;
}

/** Require an admin user. */
function RequireAdmin({ children }) {
  const { isAuthenticated, isAdmin, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  if (!isAdmin) return <Navigate to="/portal/dashboard" replace />;
  return children;
}

/** Require an approved campus ambassador. */
function RequireAmbassador({ children }) {
  const { isAuthenticated, isAdmin, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  if (isAdmin) return <Navigate to="/admin" replace />;
  if (user?.role !== 'ambassador') return <Navigate to="/ambassador" replace />;
  return children;
}

/** Wrap public marketing/listing pages in the shared Navbar + Footer shell. */
const Public = (page) => <MainLayout>{page}</MainLayout>;

/** /ambassador → straight to the portal for approved ambassadors, else the application screen. */
function AmbassadorRedirect() {
  const { user } = useAuth();
  if (user?.role === 'ambassador') return <Navigate to="/ambassador/dashboard" replace />;
  return <AmbassadorHome />;
}

export default function AppRoutes() {
  return (
    <Gate>
      <ScrollToTop />
      <Routes>
        {/* ---------- Public site ---------- */}
        <Route path="/" element={Public(<Home />)} />
        <Route path="/internships" element={Public(<Internships />)} />
        <Route path="/internships/:id" element={Public(<InternshipDetails />)} />
        <Route path="/courses" element={Public(<Courses />)} />
        <Route path="/courses/:id" element={Public(<CourseDetails />)} />
        <Route path="/projects" element={Public(<Projects />)} />
        <Route path="/projects/:id" element={Public(<ProjectDetails />)} />
        <Route path="/services" element={Public(<Services />)} />
        <Route path="/sessions" element={Public(<Sessions />)} />
        <Route path="/campus-ambassador" element={Public(<CampusAmbassador />)} />
        <Route path="/about" element={Public(<About />)} />
        <Route path="/contact" element={Public(<Contact />)} />
        <Route path="/verify-certificate" element={Public(<VerifyCertificate />)} />

        {/* ---------- Auth ---------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ---------- Student portal (protected) ---------- */}
        <Route path="/portal" element={<RequireAuth><Navigate to="/portal/dashboard" replace /></RequireAuth>} />
        <Route path="/portal/dashboard" element={<RequireAuth><PortalDashboard /></RequireAuth>} />
        <Route path="/portal/internships" element={<RequireAuth><BrowseInternships /></RequireAuth>} />
        <Route path="/portal/applications" element={<RequireAuth><MyApplications /></RequireAuth>} />
        <Route path="/portal/courses" element={<RequireAuth><MyCourses /></RequireAuth>} />
        <Route path="/portal/certificates" element={<RequireAuth><MyCertificates /></RequireAuth>} />
        <Route path="/portal/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/portal/settings" element={<RequireAuth><Settings /></RequireAuth>} />

        {/* Apply flow — reachable from public details & portal browse */}
        <Route path="/apply/:id" element={<RequireAuth><ApplyInternship /></RequireAuth>} />

        {/* ---------- Admin panel (protected) ---------- */}
        <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="/admin/internships" element={<RequireAdmin><ManageInternships /></RequireAdmin>} />
        <Route path="/admin/applications" element={<RequireAdmin><ManageApplications /></RequireAdmin>} />
        <Route path="/admin/students" element={<RequireAdmin><ManageStudents /></RequireAdmin>} />
        <Route path="/admin/courses" element={<RequireAdmin><ManageCourses /></RequireAdmin>} />
        <Route path="/admin/certificates" element={<RequireAdmin><ManageCertificates /></RequireAdmin>} />
        <Route path="/admin/projects" element={<RequireAdmin><ManageProjects /></RequireAdmin>} />
        <Route path="/admin/messages" element={<RequireAdmin><ManageMessages /></RequireAdmin>} />

        {/* ---------- Campus Ambassador portal ---------- */}
        {/* Entry point: application form / status for students, dashboard for ambassadors. */}
        <Route
          path="/ambassador"
          element={
            <RequireAuth>
              <AmbassadorRedirect />
            </RequireAuth>
          }
        />
        <Route path="/ambassador/dashboard" element={<RequireAmbassador><AmbassadorDashboard /></RequireAmbassador>} />
        <Route path="/ambassador/tasks" element={<RequireAmbassador><AmbassadorTasks /></RequireAmbassador>} />
        <Route path="/ambassador/submit" element={<RequireAmbassador><SubmitTask /></RequireAmbassador>} />
        <Route path="/ambassador/submissions" element={<RequireAmbassador><MySubmissions /></RequireAmbassador>} />
        <Route path="/ambassador/events" element={<RequireAmbassador><AmbassadorEvents /></RequireAmbassador>} />
        <Route path="/ambassador/resources" element={<RequireAmbassador><AmbassadorResources /></RequireAmbassador>} />
        <Route path="/ambassador/leaderboard" element={<RequireAmbassador><AmbassadorLeaderboard /></RequireAmbassador>} />
        <Route path="/ambassador/achievements" element={<RequireAmbassador><AmbassadorAchievements /></RequireAmbassador>} />

        {/* ---------- 404 ---------- */}
        <Route path="*" element={Public(<NotFound />)} />
      </Routes>
    </Gate>
  );
}
