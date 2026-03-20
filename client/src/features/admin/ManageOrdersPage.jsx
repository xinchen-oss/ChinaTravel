import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatPrice, formatDate } from '../../utils/formatters';
import '../dashboard/Dashboard.css';

export default function ManageOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('TODOS');
  const [rejectModal, setRejectModal] = useState({ open: false, orderId: null, motivo: '' });
  const [detail, setDetail] = useState(null);

  const fetchOrders = () => {
    api.get('/pedidos/todos')
      .then((res) => setOrders(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleApproveCancel = async (id) => {
    if (!confirm('¿Aprobar la cancelación y reembolsar al usuario?')) return;
    try {
      await api.put(`/pedidos/${id}/aprobar-cancelacion`);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  const handleRejectCancel = async () => {
    try {
      await api.put(`/pedidos/${rejectModal.orderId}/rechazar-cancelacion`, { motivo: rejectModal.motivo });
      setRejectModal({ open: false, orderId: null, motivo: '' });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este pedido? Esta acción no se puede deshacer.')) return;
    try {
      await api.delete(`/pedidos/${id}`);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const res = await api.get(`/pedidos/${id}`);
      setDetail(res.data.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Error al cargar detalles');
    }
  };

  const badgeClass = (estado) => {
    switch (estado) {
      case 'CONFIRMADO': return 'badge--success';
      case 'REEMBOLSADO': return 'badge--info';
      case 'CANCELADO': return 'badge--danger';
      case 'PENDIENTE_CANCELACION': return 'badge--warning';
      default: return 'badge--warning';
    }
  };

  const badgeLabel = (estado) => {
    if (estado === 'PENDIENTE_CANCELACION') return 'Cancelación pendiente';
    return estado;
  };

  const filtered = filter === 'TODOS' ? orders : orders.filter((o) => o.estado === filter);
  const pendingCount = orders.filter((o) => o.estado === 'PENDIENTE_CANCELACION').length;
  const counts = {
    TODOS: orders.length,
    PENDIENTE_CANCELACION: pendingCount,
    CONFIRMADO: orders.filter((o) => o.estado === 'CONFIRMADO').length,
    REEMBOLSADO: orders.filter((o) => o.estado === 'REEMBOLSADO').length,
    CANCELADO: orders.filter((o) => o.estado === 'CANCELADO').length,
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="page-title">Gestionar pedidos</h1>

      {pendingCount > 0 && (
        <div style={{ background: '#fffbeb', border: '1px solid #f59e0b', borderRadius: 'var(--border-radius)', padding: 'var(--space-md)', marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>&#9888;</span>
          <span><strong>{pendingCount}</strong> solicitud(es) de cancelación pendiente(s) de revisión</span>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
        {Object.entries(counts).map(([key, count]) => (
          <button
            key={key}
            className={`btn btn--sm ${filter === key ? 'btn--primary' : 'btn--outline'}`}
            onClick={() => setFilter(key)}
          >
            {key === 'TODOS' ? 'Todos' : key === 'PENDIENTE_CANCELACION' ? 'Pendientes' : key} ({count})
          </button>
        ))}
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Guía</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan="6" style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-muted)' }}>No hay pedidos</td></tr>
          ) : filtered.map((order) => (
            <tr key={order._id} style={order.estado === 'PENDIENTE_CANCELACION' ? { background: '#fffbeb' } : {}}>
              <td>
                <div>{order.usuario?.nombre}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{order.usuario?.email}</div>
              </td>
              <td>{order.guia?.titulo || 'Guía eliminada'}</td>
              <td>{formatPrice(order.precioTotal)}</td>
              <td>
                <span className={`badge ${badgeClass(order.estado)}`}>
                  {badgeLabel(order.estado)}
                </span>
              </td>
              <td>{formatDate(order.createdAt)}</td>
              <td>
                <div className="table-actions">
                  <button className="btn btn--outline btn--sm" onClick={() => handleViewDetail(order._id)}>Ver</button>
                  {order.estado === 'PENDIENTE_CANCELACION' && (
                    <>
                      <button className="btn btn--primary btn--sm" onClick={() => handleApproveCancel(order._id)}>Reembolsar</button>
                      <button className="btn btn--danger btn--sm" onClick={() => setRejectModal({ open: true, orderId: order._id, motivo: '' })}>Rechazar</button>
                    </>
                  )}
                  <button className="btn btn--danger btn--sm" onClick={() => handleDelete(order._id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Reject cancellation modal */}
      {rejectModal.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={() => setRejectModal({ open: false, orderId: null, motivo: '' })}>
          <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--border-radius)', padding: 'var(--space-xl)', maxWidth: '450px', width: '90%' }}
            onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Rechazar cancelación</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>El pedido volverá al estado CONFIRMADO y se notificará al usuario.</p>
            <div className="form-group">
              <label>Motivo (opcional)</label>
              <textarea
                value={rejectModal.motivo}
                onChange={(e) => setRejectModal({ ...rejectModal, motivo: e.target.value })}
                placeholder="Explica al usuario por qué se rechaza..."
                rows={3}
                style={{ width: '100%', padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius)' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end', marginTop: 'var(--space-md)' }}>
              <button className="btn btn--outline" onClick={() => setRejectModal({ open: false, orderId: null, motivo: '' })}>Volver</button>
              <button className="btn btn--danger" onClick={handleRejectCancel}>Confirmar rechazo</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {detail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={() => setDetail(null)}>
          <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--border-radius)', padding: 'var(--space-xl)', maxWidth: '500px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}
            onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Detalle del pedido</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
              <DetailItem label="Usuario" value={detail.usuario?.nombre} />
              <DetailItem label="Email" value={detail.usuario?.email} />
              <DetailItem label="Guía" value={detail.guia?.titulo || detail.guiaPersonalizada?.titulo || '—'} />
              <DetailItem label="Precio total" value={formatPrice(detail.precioTotal)} />
              {detail.descuento > 0 && <DetailItem label="Descuento" value={formatPrice(detail.descuento)} />}
              {detail.cupon && <DetailItem label="Cupón" value={detail.cupon} />}
              <DetailItem label="Estado" value={badgeLabel(detail.estado)} />
              <DetailItem label="Fecha" value={formatDate(detail.createdAt)} />
              {detail.hotel && <DetailItem label="Hotel" value={detail.hotel.nombre || detail.hotel} />}
              {detail.vuelo && <DetailItem label="Vuelo" value={detail.vuelo.aerolinea || detail.vuelo} />}
              {detail.motivoCancelacion && <DetailItem label="Motivo cancelación" value={detail.motivoCancelacion} />}
              {detail.fechaCancelacion && <DetailItem label="Fecha cancelación" value={formatDate(detail.fechaCancelacion)} />}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-lg)' }}>
              <button className="btn btn--outline" onClick={() => setDetail(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
      <div style={{ fontSize: '14px', marginTop: '2px' }}>{value || '—'}</div>
    </div>
  );
}
