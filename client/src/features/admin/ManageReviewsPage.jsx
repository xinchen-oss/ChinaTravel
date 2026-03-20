import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../dashboard/Dashboard.css';

const STARS = [1, 2, 3, 4, 5];
const renderStars = (n) => STARS.map((s) => <span key={s} style={{ color: s <= n ? '#f59e0b' : '#d1d5db' }}>★</span>);

export default function ManageReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('PENDIENTE');

  const fetchReviews = () => {
    setLoading(true);
    api.get(`/resenas/admin/pendientes?estado=${tab}`)
      .then((r) => setReviews(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, [tab]);

  const moderate = async (id, estado) => {
    try {
      await api.put(`/resenas/admin/${id}`, { estado });
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta reseña? Esta acción no se puede deshacer.')) return;
    try {
      await api.delete(`/resenas/admin/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  return (
    <div>
      <h1 className="page-title">Moderación de reseñas</h1>

      <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
        {['PENDIENTE', 'APROBADO', 'RECHAZADO'].map((t) => (
          <button
            key={t}
            className={`btn btn--sm ${tab === t ? 'btn--primary' : 'btn--outline'}`}
            onClick={() => setTab(t)}
          >
            {t === 'PENDIENTE' ? 'Pendientes' : t === 'APROBADO' ? 'Aprobadas' : 'Rechazadas'}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : reviews.length === 0 ? (
        <div className="empty-state">
          <h3>{tab === 'PENDIENTE' ? 'No hay reseñas pendientes' : tab === 'APROBADO' ? 'No hay reseñas aprobadas' : 'No hay reseñas rechazadas'}</h3>
        </div>
      ) : (
        <div className="orders-list">
          {reviews.map((r) => (
            <div key={r._id} className="order-card-full" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <strong>{r.usuario?.nombre} {r.usuario?.apellidos}</strong>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{r.usuario?.email}</span>
                    <span className={`badge ${r.estado === 'APROBADO' ? 'badge--success' : r.estado === 'RECHAZADO' ? 'badge--danger' : 'badge--warning'}`}>
                      {r.estado}
                    </span>
                  </div>
                  <div style={{ marginBottom: '8px' }}>{renderStars(r.puntuacion)}</div>
                  <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                    Tipo: <strong>{r.tipo}</strong> | {new Date(r.createdAt).toLocaleDateString('es-ES')}
                  </p>
                  {r.titulo && <p style={{ fontWeight: 600, margin: '8px 0 4px' }}>{r.titulo}</p>}
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{r.comentario}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  {tab === 'PENDIENTE' && (
                    <>
                      <button className="btn btn--primary btn--sm" onClick={() => moderate(r._id, 'APROBADO')}>Aprobar</button>
                      <button className="btn btn--outline btn--sm" onClick={() => moderate(r._id, 'RECHAZADO')}>Rechazar</button>
                    </>
                  )}
                  <button className="btn btn--danger btn--sm" onClick={() => handleDelete(r._id)}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
