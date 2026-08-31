import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { Order } from '../types';
import { Plus, Trash2, Edit, Calendar } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<Order[]>('/api/orders');
      setOrders(res.data);
    } catch {
      setError('Не удалось загрузить список бронирований');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить данное бронирование?')) return;

    try {
      await apiClient.delete(`/api/orders/${id}`);
      setOrders(orders.filter(o => o.id !== id));
    } catch {
      alert('Ошибка при удалении брони');
    }
  };

  if (loading) return <div className="loading-spinner">Загрузка бронирований...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Список бронирований</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/hostel/orderdate" className="btn-secondary">
            <Calendar className="icon-sm" /> Бронь на дату
          </Link>
          <Link to="/hostel/order" className="btn-primary">
            <Plus className="icon-sm" /> Создать бронь
          </Link>
        </div>
      </div>

      {error && <div className="error-alert">{error}</div>}

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
              <th style={{ width: '130px' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center" style={{ padding: '2rem', color: 'var(--text-muted)' }}>
                  Бронирований пока нет
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
                  <td>
                    <div className="actions-cell">
                      <Link to={`/hostel/order/${order.id}`} className="btn-secondary btn-sm" title="Редактировать">
                        <Edit className="icon-sm" />
                      </Link>
                      <button
                        onClick={() => handleDelete(order.id)}
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
