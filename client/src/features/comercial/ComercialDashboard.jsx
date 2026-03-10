import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/formatters';
import '../dashboard/Dashboard.css';

export default function ComercialDashboard() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/solicitudes/mis-solicitudes')
      .then((res) => setSubmissions(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (estado) => {
    if (estado === 'APROBADO') return 'success';
    if (estado === 'RECHAZADO') return 'error';
    return 'warning';
  };

  return (
    <div>
        <h1 className="page-title">Panel comercial</h1>
        <p className="page-subtitle">Hola, {user?.nombre}</p>

        <div className="admin-nav">
          <Link to="/comercial/nueva-solicitud">Nueva solicitud</Link>
        </div>

        <h2 className="section-title">Mis solicitudes</h2>
        {loading ? (
          <LoadingSpinner />
        ) : submissions.length === 0 ? (
          <div className="empty-state">
            <h3>No has enviado solicitudes aún</h3>
            <p><Link to="/comercial/nueva-solicitud">Envía tu primera solicitud</Link></p>
          </div>
        ) : (
          <div className="orders-list">
            {submissions.map((sub) => (
              <div key={sub._id} className="order-card">
                <div className="order-card__info">
                  <h3>{sub.tipoContenido}</h3>
                  <p>{formatDate(sub.createdAt)}</p>
                  <span className={`badge badge--${statusColor(sub.estado)}`}>{sub.estado}</span>
                  {sub.comentarioAdmin && <p style={{ marginTop: '8px', fontSize: '0.875rem', color: '#666' }}>Admin: {sub.comentarioAdmin}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
