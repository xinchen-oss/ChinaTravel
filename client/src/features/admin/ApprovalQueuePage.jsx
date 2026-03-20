import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/formatters';
import '../dashboard/Dashboard.css';

const FIELD_LABELS = {
  nombre: 'Nombre',
  descripcion: 'Descripción',
  ciudad: 'Ciudad',
  categoria: 'Categoría',
  duracion: 'Duración',
  precio: 'Precio',
  precioPorNoche: 'Precio/noche',
  estrellas: 'Estrellas',
  aerolinea: 'Aerolínea',
  origen: 'Origen',
  destino: 'Destino',
  fechaSalida: 'Fecha salida',
  fechaLlegada: 'Fecha llegada',
  plazas: 'Plazas',
  direccion: 'Dirección',
  servicios: 'Servicios',
};

function renderStars(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function formatValue(key, value) {
  if (value == null || value === '') return '—';
  if (key === 'estrellas') return renderStars(Number(value));
  if (key === 'precio' || key === 'precioPorNoche') return `${Number(value).toFixed(2)} €`;
  if (key === 'fechaSalida' || key === 'fechaLlegada') return formatDate(value);
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function ContentCard({ contenido, tipo }) {
  const excluded = ['imagen', '_id', '__v', 'createdAt', 'updatedAt'];
  const fields = Object.entries(contenido || {}).filter(([k]) => !excluded.includes(k));
  const imgSrc = contenido?.imagen
    ? (contenido.imagen.startsWith('http') ? contenido.imagen : `${api.defaults.baseURL?.replace('/api', '')}${contenido.imagen}`)
    : null;

  const typeLabels = { ACTIVIDAD: 'Actividad', HOTEL: 'Hotel', VUELO: 'Vuelo' };

  return (
    <div style={{ background: 'var(--color-bg-alt)', borderRadius: 'var(--border-radius)', overflow: 'hidden', marginBottom: 'var(--space-md)' }}>
      {imgSrc && (
        <img src={imgSrc} alt="Imagen adjunta" style={{ width: '100%', maxHeight: '220px', objectFit: 'cover' }} />
      )}
      <div style={{ padding: 'var(--space-md)' }}>
        <span style={{
          display: 'inline-block',
          background: tipo === 'HOTEL' ? '#3b82f6' : tipo === 'VUELO' ? '#8b5cf6' : '#f59e0b',
          color: '#fff',
          padding: '2px 10px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 600,
          marginBottom: '12px',
        }}>
          {typeLabels[tipo] || tipo}
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
          {fields.map(([key, value]) => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {FIELD_LABELS[key] || key}
              </span>
              <span style={{ fontSize: '14px' }}>{formatValue(key, value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
};
const modalStyle = {
  background: '#fff', borderRadius: '16px', padding: '32px',
  maxWidth: '440px', width: '90%', textAlign: 'center',
  boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
};

export default function ApprovalQueuePage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});
  const [modal, setModal] = useState({ open: false, type: null, id: null });
  const [result, setResult] = useState({ open: false, success: false, type: null, msg: '' });
  const [processing, setProcessing] = useState(false);
  const [tab, setTab] = useState('PENDIENTE');

  const fetchSubmissions = () => {
    api.get(`/solicitudes?estado=${tab}`)
      .then((res) => setSubmissions(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { setLoading(true); fetchSubmissions(); }, [tab]);

  const openModal = (type, id) => setModal({ open: true, type, id });
  const closeModal = () => setModal({ open: false, type: null, id: null });

  const handleConfirm = async () => {
    const { type, id } = modal;
    const comentario = comments[id] || '';
    closeModal();
    setProcessing(true);
    try {
      if (type === 'approve') {
        await api.put(`/solicitudes/${id}/aprobar`, { comentario });
      } else {
        await api.put(`/solicitudes/${id}/rechazar`, { comentario });
      }
      setComments((c) => { const copy = { ...c }; delete copy[id]; return copy; });
      setResult({
        open: true, success: true, type,
        msg: type === 'approve' ? 'La solicitud ha sido aprobada correctamente.' : 'La solicitud ha sido rechazada.',
      });
      fetchSubmissions();
    } catch (err) {
      const serverMsg = err.response?.data?.error || '';
      // If already processed, just remove from list and show appropriate message
      if (serverMsg.includes('ya fue procesada')) {
        setResult({
          open: true, success: false, type: 'already',
          msg: 'Esta solicitud ya ha sido procesada anteriormente.',
        });
        fetchSubmissions();
      } else {
        setResult({ open: true, success: false, type: 'error', msg: serverMsg || 'Ha ocurrido un error.' });
      }
    } finally {
      setProcessing(false);
    }
  };

  const currentSub = submissions.find((s) => s._id === modal.id);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="page-title">Cola de aprobaciones</h1>

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

      {loading ? <LoadingSpinner /> : submissions.length === 0 ? (
        <div className="empty-state">
          <h3>{tab === 'PENDIENTE' ? 'No hay solicitudes pendientes' : tab === 'APROBADO' ? 'No hay solicitudes aprobadas' : 'No hay solicitudes rechazadas'}</h3>
        </div>
      ) : (
        <div className="orders-list">
          {submissions.map((sub) => (
            <div key={sub._id} className="order-card" style={{ flexDirection: 'column', alignItems: 'stretch', opacity: processing ? 0.6 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>{sub.comercial?.nombre}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--color-text-muted)' }}>{sub.comercial?.email} · {formatDate(sub.createdAt)}</p>
                </div>
                <span className={`badge ${sub.estado === 'APROBADO' ? 'badge--success' : sub.estado === 'RECHAZADO' ? 'badge--danger' : 'badge--warning'}`}>
                  {sub.estado}
                </span>
              </div>

              <ContentCard contenido={sub.contenido} tipo={sub.tipoContenido} />

              {sub.comentarioAdmin && (
                <div style={{
                  background: sub.estado === 'APROBADO' ? '#f0fdf4' : sub.estado === 'RECHAZADO' ? '#fef2f2' : 'transparent',
                  borderLeft: `4px solid ${sub.estado === 'APROBADO' ? '#059669' : sub.estado === 'RECHAZADO' ? '#dc2626' : '#d97706'}`,
                  borderRadius: '0 8px 8px 0',
                  padding: '10px 14px',
                  marginBottom: 'var(--space-md)',
                }}>
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-muted)' }}>Comentario del admin</p>
                  <p style={{ margin: '4px 0 0', fontSize: '14px' }}>{sub.comentarioAdmin}</p>
                </div>
              )}

              {tab === 'PENDIENTE' && (
                <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                  <input
                    placeholder="Comentario (opcional)"
                    value={comments[sub._id] || ''}
                    onChange={(e) => setComments({ ...comments, [sub._id]: e.target.value })}
                    style={{ flex: 1, padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius)' }}
                  />
                  <button className="btn btn--primary" onClick={() => openModal('approve', sub._id)} disabled={processing}>Aprobar</button>
                  <button className="btn btn--danger" onClick={() => openModal('reject', sub._id)} disabled={processing}>Rechazar</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Confirm modal */}
      {modal.open && (
        <div style={overlayStyle} onClick={closeModal}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            {modal.type === 'approve' ? (
              <>
                <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', color: '#059669', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, margin: '0 auto 20px', boxShadow: '0 4px 12px rgba(5,150,105,0.15)' }}>
                  ✓
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: '20px', color: '#1a1a2e' }}>Aprobar solicitud</h3>
                <p style={{ color: '#6b7280', margin: '0 0 20px', fontSize: '14px', lineHeight: 1.5 }}>
                  Se creará el contenido de tipo <strong>{currentSub?.tipoContenido}</strong> enviado por <strong>{currentSub?.comercial?.nombre}</strong> y se notificará al comercial.
                </p>
                {comments[modal.id] && (
                  <div style={{ background: '#f0fdf4', borderLeft: '4px solid #059669', borderRadius: '0 8px 8px 0', padding: '10px 14px', margin: '0 0 20px', textAlign: 'left' }}>
                    <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tu comentario</p>
                    <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#065f46' }}>{comments[modal.id]}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg,#fee2e2,#fecaca)', color: '#dc2626', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, margin: '0 auto 20px', boxShadow: '0 4px 12px rgba(220,38,38,0.15)' }}>
                  ✗
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: '20px', color: '#1a1a2e' }}>Rechazar solicitud</h3>
                <p style={{ color: '#6b7280', margin: '0 0 20px', fontSize: '14px', lineHeight: 1.5 }}>
                  Se rechazará la solicitud de <strong>{currentSub?.tipoContenido}</strong> de <strong>{currentSub?.comercial?.nombre}</strong>. El contenido <strong>no</strong> será publicado.
                </p>
                {comments[modal.id] && (
                  <div style={{ background: '#fef2f2', borderLeft: '4px solid #dc2626', borderRadius: '0 8px 8px 0', padding: '10px 14px', margin: '0 0 20px', textAlign: 'left' }}>
                    <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Motivo del rechazo</p>
                    <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#991b1b' }}>{comments[modal.id]}</p>
                  </div>
                )}
              </>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '8px' }}>
              <button
                className="btn btn--outline"
                onClick={closeModal}
                style={{ minWidth: '120px' }}
              >
                Cancelar
              </button>
              <button
                className={`btn ${modal.type === 'approve' ? 'btn--primary' : 'btn--danger'}`}
                onClick={handleConfirm}
                style={{ minWidth: '120px' }}
              >
                {modal.type === 'approve' ? 'Sí, aprobar' : 'Sí, rechazar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result modal */}
      {result.open && (
        <div style={overlayStyle} onClick={() => setResult({ ...result, open: false })}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            {result.type === 'approve' && result.success ? (
              <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', color: '#059669', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, margin: '0 auto 20px', boxShadow: '0 4px 12px rgba(5,150,105,0.15)' }}>
                ✓
              </div>
            ) : result.type === 'reject' && result.success ? (
              <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg,#fee2e2,#fecaca)', color: '#dc2626', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, margin: '0 auto 20px', boxShadow: '0 4px 12px rgba(220,38,38,0.15)' }}>
                ✗
              </div>
            ) : (
              <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg,#fef3c7,#fde68a)', color: '#b45309', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, margin: '0 auto 20px', boxShadow: '0 4px 12px rgba(180,83,9,0.15)' }}>
                !
              </div>
            )}

            <h3 style={{ margin: '0 0 8px', fontSize: '20px', color: '#1a1a2e' }}>
              {result.type === 'approve' && result.success ? 'Solicitud aprobada' :
               result.type === 'reject' && result.success ? 'Solicitud rechazada' :
               'Aviso'}
            </h3>
            <p style={{ color: '#6b7280', margin: '0 0 24px', fontSize: '14px', lineHeight: 1.5 }}>
              {result.msg}
            </p>
            <button
              className="btn btn--primary"
              onClick={() => setResult({ ...result, open: false })}
              style={{ minWidth: '140px' }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
