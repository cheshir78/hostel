import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { User } from '../types';
import { Trash2, Filter, KeyRound } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [minId, setMinId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (filterMinId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const url = filterMinId ? `/api/admin/users/gt/${filterMinId}` : '/api/admin/users';
      const res = await apiClient.get<User[]>(url);
      setUsers(res.data);
    } catch {
      setError('Не удалось загрузить список пользователей');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(minId.trim());
  };

  const handleReset = () => {
    setMinId('');
    fetchUsers();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Удалить пользователя ID ${id}?`)) return;

    try {
      await apiClient.delete(`/api/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch {
      alert('Ошибка при удалении пользователя');
    }
  };

  if (loading) return <div className="loading-spinner">Загрузка пользователей...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Управление пользователями</h1>
      </div>

      <div className="card" style={{ maxWidth: '500px', marginBottom: '1.5rem' }}>
        <form onSubmit={handleFilter} className="form-row">
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="form-label" htmlFor="filter-min-id">Фильтр: ID больше чем</label>
            <input
              id="filter-min-id"
              type="number"
              className="form-input"
              value={minId}
              onChange={(e) => setMinId(e.target.value)}
              placeholder="например: 1"
            />
          </div>
          <button type="submit" className="btn-primary">
            <Filter className="icon-sm" /> Применить
          </button>
          {minId && (
            <button type="button" onClick={handleReset} className="btn-secondary">
              Сброс
            </button>
          )}
        </form>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя пользователя</th>
              <th>Роли</th>
              <th style={{ width: '220px' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center" style={{ padding: '2rem', color: 'var(--text-muted)' }}>
                  Пользователи не найдены
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td><strong>{u.username}</strong></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {u.roles.map((r) => (
                        <span
                          key={r}
                          className="role-tag"
                          style={{
                            background: r === 'ROLE_ADMIN' ? '#fef3c7' : '#e0f2fe',
                            color: r === 'ROLE_ADMIN' ? '#b45309' : '#0369a1'
                          }}
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <Link
                        to={`/admin/userrole/${u.id}`}
                        className="btn-secondary btn-sm"
                        title="Управление ролями"
                      >
                        <KeyRound className="icon-sm" /> Роли
                      </Link>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="btn-danger btn-sm"
                        title="Удалить"
                      >
                        <Trash2 className="icon-sm" /> Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
