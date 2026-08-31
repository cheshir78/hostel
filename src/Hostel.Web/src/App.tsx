import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { RoomsPage } from './pages/RoomsPage';
import { RoomFormPage } from './pages/RoomFormPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderFormPage } from './pages/OrderFormPage';
import { OrderDatePage } from './pages/OrderDatePage';
import { OccupancyReportPage } from './pages/OccupancyReportPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { UserRolesPage } from './pages/UserRolesPage';
import { NewsPage } from './pages/NewsPage';

import './styles/app.css';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registration" element={<RegisterPage />} />

              {/* Protected Routes for Registered Users & Admins */}
              <Route element={<ProtectedRoute />}>
                <Route path="/hostel" element={<Navigate to="/hostel/rooms" replace />} />
                <Route path="/hostel/rooms" element={<RoomsPage />} />
                <Route path="/hostel/room" element={<RoomFormPage />} />
                <Route path="/hostel/room/:id" element={<RoomFormPage />} />
                <Route path="/hostel/orders" element={<OrdersPage />} />
                <Route path="/hostel/order" element={<OrderFormPage />} />
                <Route path="/hostel/order/:id" element={<OrderFormPage />} />
                <Route path="/hostel/orderdate" element={<OrderDatePage />} />
                <Route path="/hostel/reportrestdate" element={<OccupancyReportPage />} />
              </Route>

              {/* News - USER role */}
              <Route element={<ProtectedRoute requiredRole="ROLE_USER" />}>
                <Route path="/news" element={<NewsPage />} />
              </Route>

              {/* Admin Routes - ADMIN role */}
              <Route element={<ProtectedRoute requiredRole="ROLE_ADMIN" />}>
                <Route path="/admin" element={<AdminUsersPage />} />
                <Route path="/admin/userrole/:userId" element={<UserRolesPage />} />
                <Route path="/admin/userroleadd/:userId" element={<UserRolesPage />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
