import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { AlertCircle, Save, ArrowLeft } from 'lucide-react';

export const RoomFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [number, setNumber] = useState<number | ''>('');
  const [capacity, setCapacity] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      apiClient.get(`/api/rooms/${id}`)
        .then((res) => {
          setName(res.data.name);
          setNumber(res.data.number ?? '');
          setCapacity(res.data.capacity);
        })
        .catch(() => {
          setError('Не удалось загрузить данные комнаты');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Название комнаты обязательно');
      return;
    }

    setLoading(true);

    try {
      await apiClient.post('/api/rooms', {
        id: isEdit ? Number(id) : 0,
        name: name.trim(),
        number: number === '' ? null : Number(number),
        capacity: Number(capacity)
      });
      navigate('/hostel/rooms');
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Ошибка при сохранении комнаты');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '540px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Редактировать комнату' : 'Создать комнату'}</h1>
        <Link to="/hostel/rooms" className="btn-secondary">
          <ArrowLeft className="icon-sm" /> Назад к комнатам
        </Link>
      </div>

      <div className="card">
        {error && (
          <div className="error-alert">
            <AlertCircle className="icon-sm" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="room-name">Название комнаты *</label>
            <input
              id="room-name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="например: Deluxe 201"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="room-number">Номер комнаты</label>
            <input
              id="room-number"
              type="number"
              className="form-input"
              value={number}
              onChange={(e) => setNumber(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="например: 201"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="room-capacity">Вместимость (количество мест) *</label>
            <input
              id="room-capacity"
              type="number"
              min="1"
              max="100"
              className="form-input"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            <Save className="icon-sm" /> {loading ? 'Сохранение...' : 'Сохранить комнату'}
          </button>
        </form>
      </div>
    </div>
  );
};
