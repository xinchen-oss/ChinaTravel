import { useState, useEffect } from 'react';
import api from '../../api/axios';

const STARS = [1, 2, 3, 4, 5];
const renderStars = (n) => STARS.map((s) => <span key={s} style={{ color: s <= n ? '#f59e0b' : '#d1d5db' }}>★</span>);

export default function ManageReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    api.get('/resenas/admin/pendientes')
      .then((r) => setReviews(r.data.data))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchReviews(); }, []);

  const moderate = async (id, estado) => {
    await api.put(`/resenas/admin/${id}`, { estado });
    setReviews((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <>
      <h1 className="section-title">Moderación de reseñas</h1>

      {loading ? (
        <p>Cargando...</p>
      ) : reviews.length === 0 ? (
        <div className="empty-state">
          <h3>No hay reseñas pendientes</h3>
          <p>Todas las reseñas han sido moderadas</p>
        </div>
      ) : (
        <div className="orders-list">
          {reviews.map((r) => (
            <div key={r._id} className="order-card-full" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <strong>{r.usuario?.nombre} {r.usuario?.apellidos}</strong>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{r.usuario?.email}</span>
                  </div>
                  <div style={{ marginBottom: '8px' }}>{renderStars(r.puntuacion)}</div>
                  <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                    Tipo: <strong>{r.tipo}</strong> | {new Date(r.createdAt).toLocaleDateString('es-ES')}
                  </p>
                  {r.titulo && <p style={{ fontWeight: 600, margin: '8px 0 4px' }}>{r.titulo}</p>}
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{r.comentario}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button className="btn btn--primary btn--sm" onClick={() => moderate(r._id, 'APROBADO')}>Aprobar</button>
                  <button className="btn btn--outline btn--sm" onClick={() => moderate(r._id, 'RECHAZADO')}>Rechazar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
