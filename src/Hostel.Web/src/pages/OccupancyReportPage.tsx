import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { ReportResponse } from '../types';
import { BarChart3, Search, ArrowLeft } from 'lucide-react';

export const OccupancyReportPage: React.FC = () => {
  const getTodayFormatted = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  };

  const [dateStr, setDateStr] = useState<string>(getTodayFormatted());
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiClient.get<ReportResponse>('/api/reports/occupancy', {
        params: { orderDateStr: dateStr }
      });
      setReport(res.data);
    } catch {
      setError('Ошибка при формировании отчета о загрузке');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Отчет по загрузке комнат на 7 дней</h1>
        <Link to="/hostel/rooms" className="btn-secondary">
          <ArrowLeft className="icon-sm" /> К списку комнат
        </Link>
      </div>

      <div className="card" style={{ maxWidth: '480px', marginBottom: '1.5rem' }}>
        <form onSubmit={fetchReport} className="form-row">
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="form-label" htmlFor="report-start-date">Начальная дата (ДД.ММ.ГГГГ)</label>
            <input
              id="report-start-date"
              type="text"
              className="form-input"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              placeholder="DD.MM.YYYY"
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            <Search className="icon-sm" /> {loading ? 'Расчет...' : 'Сформировать'}
          </button>
        </form>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {report && (
        <>
          <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1rem', background: '#eff6ff', borderColor: '#bfdbfe' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e40af' }}>
              <BarChart3 className="icon-sm" />
              <span>Период отчета: с <strong>{report.orderDateStr}</strong> по <strong>{report.reportHeader[report.reportHeader.length - 1]}</strong></span>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Комната</th>
                  <th>Вместимость</th>
                  {report.reportHeader.map((header, idx) => (
                    <th key={idx} className="text-center" style={{ minWidth: '100px' }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {report.allOrders.length === 0 ? (
                  <tr>
                    <td colSpan={3 + report.reportHeader.length} className="text-center" style={{ padding: '2rem', color: 'var(--text-muted)' }}>
                      Нет комнат в системе
                    </td>
                  </tr>
                ) : (
                  report.allOrders.map((lineItem) => (
                    <tr key={lineItem.room.id}>
                      <td>{lineItem.room.id}</td>
                      <td><strong>{lineItem.room.name}</strong></td>
                      <td>{lineItem.room.capacity} мест</td>
                      {lineItem.line.map((occupied, idx) => {
                        const isFull = occupied >= lineItem.room.capacity;
                        const isEmpty = occupied === 0;

                        return (
                          <td
                            key={idx}
                            className="text-center"
                            style={{
                              backgroundColor: isFull ? '#fee2e2' : isEmpty ? '#f0fdf4' : '#fef9c3',
                              fontWeight: occupied > 0 ? 600 : 400
                            }}
                          >
                            <span style={{ color: isFull ? '#991b1b' : isEmpty ? '#166534' : '#854d0e' }}>
                              {occupied} / {lineItem.room.capacity}
                            </span>
                          </td>
                        );
                      })}
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
