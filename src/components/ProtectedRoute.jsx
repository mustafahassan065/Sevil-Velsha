import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Page, Spinner } from './ui';

// Sirf logged-in users. Warna /login par bhej do (wapas aane ke liye path yaad rakhta hai)
export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading)
    return (
      <Page>
        <Spinner className="pt-40" />
      </Page>
    );
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

// Sirf admin
export function AdminRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading)
    return (
      <Page>
        <Spinner className="pt-40" />
      </Page>
    );
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}