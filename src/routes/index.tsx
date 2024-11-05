import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { PrivateRoute } from './PrivateRoute';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PasswordList } from '../pages/passwords/PasswordList';
import { NewPassword } from '../pages/passwords/NewPassword';
import { EditPassword } from '../pages/passwords/EditPassword';
import { PasswordGenerator } from '../pages/generator/PasswordGenerator';
import { Profile } from '../pages/profile/Profile';
import { EmailVerification } from '../components/EmailVerification';

export function AppRoutes() {
  return (
    <Routes>
    {/* Rutas públicas */}
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<EmailVerification />} />
    </Route>

    {/* Rutas privadas */}
    <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/passwords" element={<PasswordList />} />
          <Route path="/passwords/new" element={<NewPassword />} />
          <Route path="/passwords/:id/edit" element={<EditPassword />} />
          <Route path="/generator" element={<PasswordGenerator />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Navigate to="/passwords" replace />} />
        </Route>
      </Route>

      

    {/* Ruta por defecto */}
    <Route path="*" element={<Navigate to="/passwords" replace />} />
  </Routes>
  );
}