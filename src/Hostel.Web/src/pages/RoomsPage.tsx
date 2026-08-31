import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { Room } from '../types';
import { Plus, Trash2, Edit } from 'lucide-react';

export const RoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<Room[]>('/api/rooms');
      setRooms(res.data);
    } catch (err: any) {
      setError('Не удалось загрузить список комнат');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту комнату?')) return;

    try {
      await apiClient.delete(`/api/rooms/${id}`);
      setRooms(rooms.filter(r => r.id !== id));
    } catch (err: any) {
      alert('Ошибка при удалении комнаты');
    }
  };

  if (loading) return <div className="loading-spinner">Загрузка комнат...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Комнаты</h1>
        <Link to="/hostel/room" className="btn-primary">
          <Plus className="icon-sm" /> Добавить комнату
        </Link>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Номер комнаты</th>
              <th>Название</th>
              <th>Вместимость (чел.)</th>
              <th style={{ width: '150px' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center" style={{ padding: '2rem', color: 'var(--text-muted)' }}>
                  Нет добавленных комнат
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.id}</td>
                  <td>{room.number ?? '—'}</td>
                  <td><strong>{room.name}</strong></td>
                  <td>{room.capacity}</td>
                  <td>
                    <div className="actions-cell">
                      <Link to={`/hostel/room/${room.id}`} className="btn-secondary btn-sm" title="Редактировать">
                        <Edit className="icon-sm" />
                      </Link>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="btn-danger btn-sm"
                        title="Удалить"
                      >
                        <Trash2 className="icon-sm" />
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
