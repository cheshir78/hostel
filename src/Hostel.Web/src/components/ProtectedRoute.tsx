import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  requiredRole?: 'ROLE_ADMIN' | 'ROLE_USER';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="loading-spinner">Загрузка...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !user?.roles?.includes(requiredRole)) {
    return (
      <div className="container">
        <div className="error-card">
          <h2>Доступ запрещен (403)</h2>
          <p>У вас нет прав для просмотра этой страницы. Требуется роль: <strong>{requiredRole}</strong></p>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
