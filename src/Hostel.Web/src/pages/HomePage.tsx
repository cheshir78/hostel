import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BedDouble, Calendar, BarChart3, Users, Newspaper, LogIn, UserPlus } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user, isAuthenticated, isAdmin, isUser } = useAuth();

  return (
    <div>
      <div className="card text-center" style={{ padding: '3rem 1.5rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
          Hostel Management System
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Современная платформа для бронирования номеров, учета гостей и контроля загрузки хостела на .NET 10 & React.
        </p>

        {isAuthenticated ? (
          <div style={{ marginTop: '1.5rem' }}>
            <span style={{ fontSize: '1rem' }}>
              Вы вошли как: <strong>{user?.username}</strong> ({user?.roles.join(', ')})
            </span>
          </div>
        ) : (
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/login" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              <LogIn className="icon-sm" /> Войти в систему
            </Link>
            <Link to="/registration" className="btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
              <UserPlus className="icon-sm" /> Зарегистрироваться
            </Link>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {(isUser || isAdmin) && (
          <>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <BedDouble style={{ color: 'var(--primary)' }} />
                <h3>Комнаты</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Просмотр списка комнат, управление номерным фондом и вместимостью.
              </p>
              <Link to="/hostel/rooms" className="btn-secondary">Открыть комнаты &rarr;</Link>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Calendar style={{ color: 'var(--primary)' }} />
                <h3>Бронь</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Управление бронированиями, создание новых заказов с проверкой доступных мест.
              </p>
              <Link to="/hostel/orders" className="btn-secondary">Список броней &rarr;</Link>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Calendar style={{ color: 'var(--primary)' }} />
                <h3>Бронь на дату</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Просмотр гостей и бронирований, активных на выбранный календарный день.
              </p>
              <Link to="/hostel/orderdate" className="btn-secondary">Выбрать дату &rarr;</Link>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <BarChart3 style={{ color: 'var(--primary)' }} />
                <h3>Загрузка на дату</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Матрица заполняемости всех номеров хостела на 7 дней вперед.
              </p>
              <Link to="/hostel/reportrestdate" className="btn-secondary">Смотреть загрузку &rarr;</Link>
            </div>
          </>
        )}

        {isUser && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Newspaper style={{ color: '#0284c7' }} />
              <h3>Новости</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Лента актуальных объявлений и новостей хостела (для зарегистрированных гостей).
            </p>
            <Link to="/news" className="btn-secondary">Читать новости &rarr;</Link>
          </div>
        )}

        {isAdmin && (
          <div className="card" style={{ borderColor: '#ddd6fe' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Users style={{ color: '#7c3aed' }} />
              <h3>Панель администратора</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Управление зарегистрированными пользователями и назначение системных ролей.
            </p>
            <Link to="/admin" className="btn-primary" style={{ background: '#7c3aed' }}>Управление пользователями &rarr;</Link>
          </div>
        )}
      </div>
    </div>
  );
};
