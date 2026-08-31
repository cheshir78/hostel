import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { NewsItem } from '../types';
import { Newspaper, Calendar } from 'lucide-react';

export const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.get<NewsItem[]>('/api/news')
      .then((res) => setNews(res.data))
      .catch(() => setError('Не удалось загрузить новости'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-spinner">Загрузка новостей...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Новости и объявления</h1>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {news.map((item) => (
          <div key={item.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Newspaper className="icon-sm" style={{ color: 'var(--primary)' }} />
                {item.title}
              </h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Calendar className="icon-sm" /> {item.date}
              </span>
            </div>
            <p style={{ color: '#334155', lineHeight: 1.6 }}>{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
