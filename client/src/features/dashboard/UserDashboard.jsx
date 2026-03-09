import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatPrice, formatDate } from '../../utils/formatters';
import './Dashboard.css';

export default function UserDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/pedidos/mis-pedidos')
      .then((res) => setOrders(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Mi cuenta</h1>
        <p className="page-subtitle">Hola, {user?.nombre}</p>

        <h2 className="section-title">Mis pedidos</h2>
        {loading ? (
          <LoadingSpinner />
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <h3>No tienes pedidos aún</h3>
            <p>Explora nuestras <Link to="/guias">guías de viaje</Link> para comenzar</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card__info">
                  <h3>{order.guia?.titulo || 'Guía'}</h3>
                  <p>{formatDate(order.createdAt)}</p>
                  <span className={`badge badge--${order.estado === 'CONFIRMADO' ? 'success' : 'warning'}`}>
                    {order.estado}
                  </span>
                </div>
                <div className="order-card__actions">
                  <span className="order-card__price">{formatPrice(order.precioTotal)}</span>
                  <Link to={`/pedido-confirmado/${order._id}`} className="btn btn--outline btn--sm">Ver detalle</Link>
                  {order.tipsPdfUrl && (
                    <a href={order.tipsPdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn--primary btn--sm">
                      PDF Tips
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
