import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Building2, Users, Home, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Pages
import Dashboard from '../pages/Dashboard';
import Properties from '../pages/Properties';
import Tenants from '../pages/Tenants';
import Settings from '../pages/Settings';
import HomePage from '../pages/Home';
import TenantOnboarding from '../pages/TenantOnboarding';
import SignUpPage from '../pages/Auth/SignUp';
import VerifyEmail from '../pages/Auth/VerifyEmail';

export const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Properties', href: '/properties', icon: Building2 },
  { name: 'Tenants', href: '/tenants', icon: Users },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
];

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth) {
    return null; // AuthContext will show the loading spinner
  }

  const { session, loading } = auth;

  if (loading) {
    return null;
  }

  if (!session) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

interface PublicRouteProps {
  children: React.ReactNode;
}

function PublicRoute({ children }: PublicRouteProps) {
  const auth = useAuth();

  if (!auth) {
    return null; // AuthContext will show the loading spinner
  }

  const { session, loading } = auth;

  if (loading) {
    return null;
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
      <Route path="/onboarding/:email" element={<PublicRoute><TenantOnboarding /></PublicRoute>} />

      {/* Auth Routes */}
      <Route path="/auth/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />
      <Route path="/auth/verify-email" element={<PublicRoute><VerifyEmail /></PublicRoute>} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/properties" element={<ProtectedRoute><Properties /></ProtectedRoute>} />
      <Route path="/tenants" element={<ProtectedRoute><Tenants /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
