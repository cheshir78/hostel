import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, BedDouble, Calendar, BarChart3, Users, Newspaper, LogIn, UserPlus, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, isUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <Hotel className="icon" />
          <span>Hostel System</span>
        </Link>

        <nav className="nav-links">
          <Link to="/" className="nav-link">Главная</Link>

          {(isUser || isAdmin) && (
            <>
              <Link to="/hostel/rooms" className="nav-link">
                <BedDouble className="icon-sm" /> Комнаты
              </Link>
              <Link to="/hostel/orders" className="nav-link">
                <Calendar className="icon-sm" /> Бронь
              </Link>
              <Link to="/hostel/orderdate" className="nav-link">
                <Calendar className="icon-sm" /> Бронь на дату
              </Link>
              <Link to="/hostel/reportrestdate" className="nav-link">
                <BarChart3 className="icon-sm" /> Загрузка на дату
              </Link>
            </>
          )}

          {isUser && (
            <Link to="/news" className="nav-link">
              <Newspaper className="icon-sm" /> Новости
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin" className="nav-link admin-link">
              <Users className="icon-sm" /> Пользователи (Админ)
            </Link>
          )}
        </nav>

        <div className="nav-auth">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="username-badge">
                <strong>{user?.username}</strong>
                {isAdmin && <span className="role-tag">Admin</span>}
              </span>
              <button onClick={handleLogout} className="btn-logout" title="Выйти">
                <LogOut className="icon-sm" /> Выйти
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-secondary">
                <LogIn className="icon-sm" /> Войти
              </Link>
              <Link to="/registration" className="btn-primary">
                <UserPlus className="icon-sm" /> Регистрация
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
