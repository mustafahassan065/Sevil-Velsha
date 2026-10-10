import { Route } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Certificate from './pages/Certificate';
import Quiz from './pages/Quiz';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminRituals from './pages/admin/AdminRituals';
import AdminPeople from './pages/admin/AdminPeople';
import AdminCertificate from './pages/admin/AdminCertificate';

// <Routes> ke andar {appRoutes} likh do (apne purane routes ke saath)
export const appRoutes = (
  <>
    <Route path="/quiz" element={<Quiz />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />

    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/certificate" element={<Certificate />} />
    </Route>

    <Route element={<AdminRoute />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminOverview />} />
        <Route path="rituals" element={<AdminRituals />} />
        <Route path="people" element={<AdminPeople />} />
        <Route path="certificate" element={<AdminCertificate />} />
      </Route>
    </Route>
  </>
);