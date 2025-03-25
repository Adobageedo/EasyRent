import { Routes, Route, Navigate } from 'react-router-dom';
import SignUpPage from '../pages/Auth/SignUp';
import VerifyEmail from '../pages/Auth/VerifyEmail';

export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="/auth/signup" element={<SignUpPage />} />
      <Route path="/auth/verify-email" element={<VerifyEmail />} />
      <Route path="/auth/*" element={<Navigate to="/auth/signup" replace />} />
    </Routes>
  );
}
