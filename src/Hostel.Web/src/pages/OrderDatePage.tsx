import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { Order } from '../types';
import { Search, Calendar, ArrowLeft } from 'lucide-react';

export const OrderDatePage: React.FC = () => {
  const getTodayFormatted = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  };

  const [dateStr, setDateStr] = useState<string>(getTodayFormatted());
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchedDate, setSearchedDate] = useState<string>(getTodayFormatted());
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiClient.get('/api/orders/date', {
        params: { date: dateStr }
      });
      setOrders(res.data.allOrders || []);
      setSearchedDate(res.data.orderDateStr || dateStr);
    } catch {
      setError('Ошибка при загрузке бронирований на дату');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Бронь на дату</h1>
        <Link to="/hostel/orders" className="btn-secondary">
          <ArrowLeft className="icon-sm" /> Все бронирования
        </Link>
      </div>

      <div className="card" style={{ maxWidth: '480px', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearch} className="form-row">
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="form-label" htmlFor="filter-date">Дата (ДД.ММ.ГГГГ)</label>
            <input
              id="filter-date"
              type="text"
              className="form-input"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              placeholder="DD.MM.YYYY"
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            <Search className="icon-sm" /> {loading ? 'Поиск...' : 'Показать'}
          </button>
        </form>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1rem', background: '#eff6ff', borderColor: '#bfdbfe' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e40af' }}>
          <Calendar className="icon-sm" />
          <span>Бронирования, активные на дату: <strong>{searchedDate}</strong> (всего: {orders.length})</span>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя гостя</th>
              <th>Возраст</th>
              <th>Документ</th>
              <th>Дата заезда</th>
              <th>Ночей</th>
              <th>Дата выезда</th>
              <th>Комната</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center" style={{ padding: '2rem', color: 'var(--text-muted)' }}>
                  На выбранную дату активных бронирований не найдено
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td><strong>{order.name}</strong></td>
                  <td>{order.age ?? '—'}</td>
                  <td>{order.documentId ?? '—'}</td>
                  <td>{order.dateFromStr || (order.dateFrom ? order.dateFrom.substring(0, 10) : '—')}</td>
                  <td>{order.night}</td>
                  <td>{order.dateTo ? order.dateTo.substring(0, 10) : '—'}</td>
                  <td>
                    <span style={{ fontWeight: 500, color: 'var(--primary)' }}>
                      {order.roomName || order.room?.name || `Комната #${order.roomId}`}
                    </span>
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
