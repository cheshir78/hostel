import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { UserPlus, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);

    try {
      await apiClient.post('/register', {
        username,
        password,
        passwordConfirm
      });
      navigate('/login');
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Ошибка при регистрации пользователя');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '3rem auto' }}>
      <div className="card">
        <div className="text-center" style={{ marginBottom: '1.5rem' }}>
          <h2 className="page-title">Регистрация</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Создайте новый аккаунт в системе
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
            <label className="form-label" htmlFor="reg-username">Имя пользователя</label>
            <input
              id="reg-username"
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Пароль</label>
            <input
              id="reg-password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm">Подтверждение пароля</label>
            <input
              id="reg-confirm"
              type="password"
              className="form-input"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            <UserPlus className="icon-sm" /> {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="text-center" style={{ marginTop: '1.5rem', fontSize: '0.875rem' }}>
          <span>Уже есть аккаунт? </span>
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
};
