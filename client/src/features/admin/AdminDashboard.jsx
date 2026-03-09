import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../dashboard/Dashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/usuarios'),
      api.get('/ciudades'),
      api.get('/guias'),
      api.get('/pedidos/todos'),
      api.get('/solicitudes'),
    ])
      .then(([users, cities, guides, orders, submissions]) => {
        setStats({
          users: users.data.data.length,
          cities: cities.data.data.length,
          guides: guides.data.data.length,
          orders: orders.data.data.length,
          pendingSubmissions: submissions.data.data.filter((s) => s.estado === 'PENDIENTE').length,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Panel de administración</h1>

        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-card__number">{stats?.users || 0}</div>
            <div className="stat-card__label">Usuarios</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__number">{stats?.cities || 0}</div>
            <div className="stat-card__label">Ciudades</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__number">{stats?.guides || 0}</div>
            <div className="stat-card__label">Guías</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__number">{stats?.orders || 0}</div>
            <div className="stat-card__label">Pedidos</div>
          </div>
        </div>

        {stats?.pendingSubmissions > 0 && (
          <div className="checkout-section" style={{ borderLeft: '4px solid var(--color-warning)' }}>
            <h3>{stats.pendingSubmissions} solicitud(es) pendiente(s) de aprobación</h3>
            <Link to="/admin/aprobaciones" className="btn btn--primary btn--sm" style={{ marginTop: 'var(--space-md)' }}>
              Ver solicitudes
            </Link>
          </div>
        )}

        <div className="admin-nav">
          <Link to="/admin/usuarios">Usuarios</Link>
          <Link to="/admin/ciudades">Ciudades</Link>
          <Link to="/admin/guias">Guías</Link>
          <Link to="/admin/actividades">Actividades</Link>
          <Link to="/admin/cultura">Cultura</Link>
          <Link to="/admin/pedidos">Pedidos</Link>
          <Link to="/admin/aprobaciones">Aprobaciones</Link>
        </div>
      </div>
    </div>
  );
}
