import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { RoomReportResponse } from '../types';
import { Hotel, Search, ArrowLeft } from 'lucide-react';
import MyDatePicker from '../components/MyDatePicker';

export const CheckoutReportPage: React.FC = () => {
  const getTodayFormatted = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  };

  const [report, setReport] = useState<RoomReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

  const changeDate = (date: string) => {
    setCurrentDate(date);
    if (!date) {
      setLoading(true);
    } else setLoading(false);
  };

  const fetchReport = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiClient.get<RoomReportResponse>('/api/reports/checkout', {
        params: { orderDateStr: currentDate }
      });
      setReport(res.data);
    } catch {
      setError('Ошибка при формировании отчета checkout');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //fetchReport();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Report about checkout</h1>
        <Link to="/hostel/rooms" className="btn-secondary">
          <ArrowLeft className="icon-sm" /> К списку комнат
        </Link>
      </div>
      
      <div className="card" style={{ maxWidth: '480px', marginBottom: '1.5rem' }}>
        <div className="form-row">
        <MyDatePicker id="report-start-date" onDateSelect={changeDate} />
        <button type="button" className="btn-primary" onClick={fetchReport} disabled={loading} >
          <Search className="icon-sm" /> {loading ? 'Расчет...' : 'Сформировать'}
        </button>
        </div>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {report && (
        <>
          <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1rem', background: '#eff6ff', borderColor: '#bfdbfe' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e40af' }}>
              <Hotel className="icon-sm" />
              <span>Checkout on date: <strong>{report.reportDateStr}</strong></span>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Комната</th>
                  <th>Вместимость</th>
                </tr>
              </thead>
              <tbody>
                {report.allRooms.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center" style={{ padding: '2rem', color: 'var(--text-muted)' }}>
                      Нет комнат в системе
                    </td>
                  </tr>
                ) : (
                  report.allRooms.map((lineItem) => (
                    <tr key={lineItem.id}>
                      <td>{lineItem.id}</td>
                      <td><strong>{lineItem.name}</strong></td>
                      <td>{lineItem.capacity} мест</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
