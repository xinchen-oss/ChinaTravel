import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/formatters';
import '../dashboard/Dashboard.css';

export default function ApprovalQueuePage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');

  const fetchSubmissions = () => {
    api.get('/solicitudes?estado=PENDIENTE')
      .then((res) => setSubmissions(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSubmissions(); }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/solicitudes/${id}/aprobar`, { comentario: comment });
      setComment('');
      fetchSubmissions();
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/solicitudes/${id}/rechazar`, { comentario: comment });
      setComment('');
      fetchSubmissions();
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
        <h1 className="page-title">Cola de aprobaciones</h1>

        {submissions.length === 0 ? (
          <div className="empty-state">
            <h3>No hay solicitudes pendientes</h3>
          </div>
        ) : (
          <div className="orders-list">
            {submissions.map((sub) => (
              <div key={sub._id} className="order-card" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                  <div>
                    <h3>{sub.tipoContenido}</h3>
                    <p>Por: {sub.comercial?.nombre} ({sub.comercial?.email})</p>
                    <p>{formatDate(sub.createdAt)}</p>
                  </div>
                  <span className="badge badge--warning">PENDIENTE</span>
                </div>
                <div style={{ background: 'var(--color-bg-alt)', padding: 'var(--space-md)', borderRadius: 'var(--border-radius)', marginBottom: 'var(--space-md)', fontSize: 'var(--font-size-sm)' }}>
                  <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(sub.contenido, null, 2)}</pre>
                </div>
                <div className="form-group">
                  <input
                    placeholder="Comentario (opcional)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{ width: '100%', padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius)' }}
                  />
                </div>
                <div className="table-actions">
                  <button className="btn btn--primary btn--sm" onClick={() => handleApprove(sub._id)}>Aprobar</button>
                  <button className="btn btn--danger btn--sm" onClick={() => handleReject(sub._id)}>Rechazar</button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
