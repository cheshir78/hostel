import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { Role } from '../types';
import { Shield, Plus, Trash2, ArrowLeft, AlertCircle } from 'lucide-react';

export const UserRolesPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesRes, allRolesRes] = await Promise.all([
        apiClient.get<Role[]>(`/api/admin/users/${userId}/roles`),
        apiClient.get<Role[]>('/api/admin/roles')
      ]);
      setUserRoles(rolesRes.data);
      setAllRoles(allRolesRes.data);
      if (allRolesRes.data.length > 0) {
        setSelectedRoleId(allRolesRes.data[0].id);
      }
    } catch {
      setError('Не удалось загрузить роли пользователя');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleId || !userId) return;

    setError(null);
    try {
      await apiClient.post(`/api/admin/users/${userId}/roles/${selectedRoleId}`);
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при добавлении роли');
    }
  };

  const handleRemoveRole = async (roleId: number) => {
    if (!userId) return;
    if (!window.confirm('Удалить эту роль у пользователя?')) return;

    setError(null);
    try {
      await apiClient.delete(`/api/admin/users/${userId}/roles/${roleId}`);
      setUserRoles(userRoles.filter(r => r.id !== roleId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при удалении роли');
    }
  };

  if (loading) return <div className="loading-spinner">Загрузка ролей...</div>;

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">Роли пользователя #{userId}</h1>
        <Link to="/admin" className="btn-secondary">
          <ArrowLeft className="icon-sm" /> К пользователям
        </Link>
      </div>

      {error && (
        <div className="error-alert">
          <AlertCircle className="icon-sm" />
          <span>{error}</span>
        </div>
      )}

      <div className="card">
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield className="icon-sm" /> Текущие роли
        </h3>

        <div className="table-container" style={{ marginBottom: '1.5rem' }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Название роли</th>
                <th style={{ width: '100px' }}>Действие</th>
              </tr>
            </thead>
            <tbody>
              {userRoles.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center" style={{ color: 'var(--text-muted)' }}>
                    Роли не назначены
                  </td>
                </tr>
              ) : (
                userRoles.map((role) => (
                  <tr key={role.id}>
                    <td>{role.id}</td>
                    <td>
                      <span className="role-tag">{role.name}</span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleRemoveRole(role.id)}
                        className="btn-danger btn-sm"
                        title="Удалить роль"
                      >
                        <Trash2 className="icon-sm" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus className="icon-sm" /> Назначить роль
        </h3>

        <form onSubmit={handleAddRole} className="form-row">
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <select
              className="form-select"
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(Number(e.target.value))}
            >
              {allRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} (ID: {r.id})
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary">
            <Plus className="icon-sm" /> Добавить роль
          </button>
        </form>
      </div>
    </div>
  );
};
