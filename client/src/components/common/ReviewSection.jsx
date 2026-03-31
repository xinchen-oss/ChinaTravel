import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';
import './ReviewSection.css';

const STARS = [1, 2, 3, 4, 5];

export default function ReviewSection({ tipo, referenciaId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [promedio, setPromedio] = useState(0);
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ puntuacion: 5, titulo: '', comentario: '' });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const tipoUrl = tipo === 'GUIA' ? 'guia' : tipo === 'HOTEL' ? 'hotel' : 'actividad';

  const fetchReviews = () => {
    api.get(`/resenas/${tipoUrl}/${referenciaId}`)
      .then((res) => {
        setReviews(res.data.data.reviews);
        setPromedio(res.data.data.promedio);
        setTotal(res.data.data.total);
      })
      .catch(() => {});
  };

  useEffect(() => { fetchReviews(); }, [referenciaId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setMsg('');
    try {
      await api.post('/resenas', { tipo, referenciaId, ...form });
      setMsg('¡Gracias! Tu reseña será visible tras la moderación.');
      setShowForm(false);
      setForm({ puntuacion: 5, titulo: '', comentario: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar reseña');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false, onChange) => (
    <div className="review-stars" role={interactive ? 'radiogroup' : 'img'} aria-label={interactive ? 'Seleccionar puntuación' : `Puntuación: ${rating} de 5 estrellas`}>
      {STARS.map((s) => (
        <span
          key={s}
          className={`review-star ${s <= rating ? 'review-star--filled' : ''} ${interactive ? 'review-star--interactive' : ''}`}
          onClick={interactive ? () => onChange(s) : undefined}
          onKeyDown={interactive ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(s); } } : undefined}
          role={interactive ? 'radio' : undefined}
          aria-checked={interactive ? s === rating : undefined}
          aria-label={interactive ? `${s} estrella${s !== 1 ? 's' : ''}` : undefined}
          tabIndex={interactive ? 0 : undefined}
          aria-hidden={!interactive ? 'true' : undefined}
        >★</span>
      ))}
    </div>
  );

  return (
    <div className="review-section">
      <div className="review-header">
        <h3>Reseñas y valoraciones</h3>
        <div className="review-summary">
          {renderStars(Math.round(promedio))}
          <span className="review-avg">{promedio}</span>
          <span className="review-count">({total} reseña{total !== 1 ? 's' : ''})</span>
        </div>
      </div>

      {msg && <div className="profile-success" role="status">{msg}</div>}
      {error && <div className="auth-error" role="alert">{error}</div>}

      {user && !showForm && (
        <button className="btn btn--outline btn--sm" onClick={() => setShowForm(true)}>
          Escribir una reseña
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label>Puntuación</label>
            {renderStars(form.puntuacion, true, (p) => setForm({ ...form, puntuacion: p }))}
          </div>
          <div className="form-group">
            <label>Título (opcional)</label>
            <input type="text" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Resumen de tu experiencia" />
          </div>
          <div className="form-group">
            <label>Comentario</label>
            <textarea value={form.comentario} onChange={(e) => setForm({ ...form, comentario: e.target.value })} placeholder="Cuéntanos tu experiencia..." required rows={4} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn btn--primary btn--sm" disabled={submitting}>
              {submitting ? 'Enviando...' : 'Enviar reseña'}
            </button>
            <button type="button" className="btn btn--outline btn--sm" onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </form>
      )}

      <div className="review-list">
        {reviews.length === 0 ? (
          <p className="text-muted">Aún no hay reseñas. ¡Sé el primero!</p>
        ) : reviews.map((r) => (
          <div key={r._id} className="review-card">
            <div className="review-card__header">
              <strong>{r.usuario?.nombre} {r.usuario?.apellidos}</strong>
              {renderStars(r.puntuacion)}
              <span className="review-card__date">{new Date(r.createdAt).toLocaleDateString('es-ES')}</span>
            </div>
            {r.titulo && <p className="review-card__title">{r.titulo}</p>}
            <p className="review-card__text">{r.comentario}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
