import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatPrice, formatDate } from '../../utils/formatters';
import './Checkout.css';

export default function BatchOrderConfirmationPage() {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = searchParams.get('ids')?.split(',') || [];
    if (ids.length === 0) {
      setLoading(false);
      return;
    }
    Promise.all(ids.map((id) => api.get(`/pedidos/${id}`)))
      .then((responses) => setOrders(responses.map((r) => r.data.data)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (loading) return <LoadingSpinner />;
  if (orders.length === 0) return <div className="page"><div className="container"><p>No se encontraron pedidos</p></div></div>;

  const totalPagado = orders.reduce((sum, o) => sum + (o.precioTotal || 0), 0);

  return (
    <div className="page">
      <div className="container">
        <div className="confirmation">
          <div className="confirmation__icon">&#10003;</div>
          <h1>¡{orders.length} pedido{orders.length > 1 ? 's' : ''} confirmado{orders.length > 1 ? 's' : ''}!</h1>
          <p className="confirmation__subtitle">Gracias por tu compra. Recibiras emails de confirmacion con facturas y PDFs de tips adjuntos.</p>

          {orders.map((order) => (
            <div key={order._id} className="confirmation__details" style={{ marginBottom: '16px' }}>
              <div className="checkout-item">
                <span>Guia</span>
                <span>{order.guia?.titulo}</span>
              </div>
              <div className="checkout-item">
                <span>Destino</span>
                <span>{order.guia?.ciudad?.nombre || '—'}</span>
              </div>
              <div className="checkout-item">
                <span>Duracion</span>
                <span>{order.guia?.duracionDias} dias</span>
              </div>
              {order.hotel && (
                <div className="checkout-item">
                  <span>Hotel</span>
                  <span>{order.hotel.nombre} {'★'.repeat(order.hotel.estrellas || 0)}</span>
                </div>
              )}
              {order.vuelo && (
                <div className="checkout-item">
                  <span>Vuelo</span>
                  <span>{order.vuelo.aerolinea} ({order.vuelo.origen} → {order.vuelo.destino})</span>
                </div>
              )}
              <div className="checkout-item">
                <span>Estado</span>
                <span className="badge badge--success">{order.estado}</span>
              </div>
              <div className="checkout-item" style={{ fontWeight: 600 }}>
                <span>Subtotal</span>
                <span>{formatPrice(order.precioTotal)}</span>
              </div>
            </div>
          ))}

          <div className="confirmation__details">
            <div className="checkout-total">
              <span>Total pagado</span>
              <span>{formatPrice(totalPagado)}</span>
            </div>
          </div>

          <div className="confirmation__links">
            <Link to="/dashboard">Ver mis pedidos</Link>
            <Link to="/guias">Explorar mas guias</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
