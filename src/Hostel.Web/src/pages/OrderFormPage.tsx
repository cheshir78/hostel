import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { Room } from '../types';
import { AlertCircle, Save, ArrowLeft } from 'lucide-react';

export const OrderFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [documentId, setDocumentId] = useState('');
  
  // Format today's date as dd.MM.yyyy
  const getTodayFormatted = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  };

  const [dateFromStr, setDateFromStr] = useState(getTodayFormatted());
  const [night, setNight] = useState<number>(1);
  const [roomId, setRoomId] = useState<number | ''>('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch available rooms
    apiClient.get<Room[]>('/api/rooms')
      .then(res => {
        setRooms(res.data);
        if (!isEdit && res.data.length > 0) {
          setRoomId(res.data[0].id);
        }
      })
      .catch(() => setError('Не удалось загрузить список комнат'));

    if (isEdit && id) {
      setLoading(true);
      apiClient.get(`/api/orders/${id}`)
        .then(res => {
          setName(res.data.name);
          setAge(res.data.age ?? '');
          setDocumentId(res.data.documentId ?? '');
          setDateFromStr(res.data.dateFromStr ?? getTodayFormatted());
          setNight(res.data.night);
          setRoomId(res.data.roomId ?? '');
        })
        .catch(() => setError('Не удалось загрузить данные бронирования'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Имя гостя обязательно');
      return;
    }
    if (!roomId) {
      setError('Необходимо выбрать комнату');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        age: age === '' ? null : Number(age),
        documentId: documentId.trim() || null,
        dateFromStr: dateFromStr.trim(),
        night: Number(night),
        roomId: Number(roomId)
      };

      if (isEdit) {
        await apiClient.put(`/api/orders/${id}`, payload);
      } else {
        await apiClient.post('/api/orders', payload);
      }

      navigate('/hostel/orders');
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Ошибка при сохранении бронирования');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '580px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Редактировать бронь' : 'Создать бронь'}</h1>
        <Link to="/hostel/orders" className="btn-secondary">
          <ArrowLeft className="icon-sm" /> К списку броней
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
            <label className="form-label" htmlFor="order-name">Имя гостя *</label>
            <input
              id="order-name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ФИО гостя"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" htmlFor="order-age">Возраст</label>
              <input
                id="order-age"
                type="number"
                min="0"
                max="120"
                className="form-input"
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="25"
              />
            </div>

            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label" htmlFor="order-document">Документ (Паспорт / ID)</label>
              <input
                id="order-document"
                type="text"
                className="form-input"
                value={documentId}
                onChange={(e) => setDocumentId(e.target.value)}
                placeholder="серия и номер"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" htmlFor="order-date">Дата заезда (ДД.ММ.ГГГГ) *</label>
              <input
                id="order-date"
                type="text"
                className="form-input"
                value={dateFromStr}
                onChange={(e) => setDateFromStr(e.target.value)}
                placeholder="DD.MM.YYYY"
                required
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" htmlFor="order-night">Количество ночей *</label>
              <input
                id="order-night"
                type="number"
                min="1"
                max="365"
                className="form-input"
                value={night}
                onChange={(e) => setNight(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="order-room">Комната *</label>
            <select
              id="order-room"
              className="form-select"
              value={roomId}
              onChange={(e) => setRoomId(Number(e.target.value))}
              required
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} (Вместимость: {r.capacity} чел.)
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            <Save className="icon-sm" /> {loading ? 'Сохранение...' : 'Забронировать'}
          </button>
        </form>
      </div>
    </div>
  );
};
