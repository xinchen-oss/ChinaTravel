import { useEffect, useState } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../dashboard/Dashboard.css';

export default function RouteStatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await api.get('/rutas/estadisticas-mis-rutas');
        setStats(res.data.data || { summary: {}, routes: [] });
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.error || 'Error al cargar las estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="page-title">Estadísticas de mis rutas</h1>
      <p className="page-subtitle">Consulta el rendimiento de tus rutas y detecta las que tienen mayor aceptación.</p>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="orders-list" style={{ marginBottom: '20px' }}>
            <div className="order-card-full" style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                <div>
                  <p style={{ margin: 0, color: '#6b7280' }}>Pedidos</p>
                  <h3 style={{ margin: '4px 0 0' }}>{stats.summary.totalOrders}</h3>
                </div>
                <div>
                  <p style={{ margin: 0, color: '#6b7280' }}>Valoración media</p>
                  <h3 style={{ margin: '4px 0 0' }}>{stats.summary.averageRating.toFixed(1)} / 5</h3>
                </div>
                <div>
                  <p style={{ margin: 0, color: '#6b7280' }}>Ingresos generados</p>
                  <h3 style={{ margin: '4px 0 0' }}>{stats.summary.totalIncome.toFixed(2)} €</h3>
                </div>
              </div>
            </div>
          </div>

          <h2 className="section-title">Rutas más populares</h2>
          {stats.routes.length === 0 ? (
            <div className="empty-state">
              <h3>Aún no hay pedidos ni reseñas para tus rutas</h3>
            </div>
          ) : (
            <div className="orders-list">
              {stats.routes.map((route, index) => (
                <div key={route._id} className="order-card-full" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <strong>#{index + 1} {route.titulo}</strong>
                        <span className="badge badge--success">{route.popularity}</span>
                      </div>
                      <p style={{ margin: 0, color: '#6b7280' }}>{route.ciudad?.nombre || 'Sin ciudad'}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: '0 0 4px', color: '#6b7280' }}>Pedidos: {route.orders}</p>
                      <p style={{ margin: '0 0 4px', color: '#6b7280' }}>Valoración: {route.averageRating.toFixed(1)} / 5</p>
                      <p style={{ margin: 0, fontWeight: 700 }}>Ingresos: {route.income.toFixed(2)} €</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
