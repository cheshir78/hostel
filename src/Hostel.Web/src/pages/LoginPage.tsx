import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { LogIn, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await apiClient.post('/auth', { username, password });
      login(response.data);
      navigate('/');
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Неверное имя пользователя или пароль');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '3rem auto' }}>
      <div className="card">
        <div className="text-center" style={{ marginBottom: '1.5rem' }}>
          <h2 className="page-title">Вход в систему</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Введите имя пользователя и пароль
          </p>
        </div>

        {error && (
          <div className="error-alert">
            <AlertCircle className="icon-sm" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Имя пользователя</label>
            <input
              id="username"
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            <LogIn className="icon-sm" /> {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="text-center" style={{ marginTop: '1.5rem', fontSize: '0.875rem' }}>
          <span>Нет аккаунта? </span>
          <Link to="/registration" style={{ color: 'var(--primary)', fontWeight: 500 }}>
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
};
