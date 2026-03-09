import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatPrice, formatDate } from '../../utils/formatters';
import './Checkout.css';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/pedidos/${id}`)
      .then((res) => setOrder(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!order) return <div className="page"><div className="container"><p>Pedido no encontrado</p></div></div>;

  return (
    <div className="page">
      <div className="container">
        <div className="confirmation">
          <div className="confirmation__icon">&#10003;</div>
          <h1>¡Pedido confirmado!</h1>
          <p className="confirmation__subtitle">Gracias por tu compra. Recibirás un email de confirmación.</p>

          <div className="confirmation__details">
            <div className="checkout-item">
              <span>Guía</span>
              <span>{order.guia?.titulo}</span>
            </div>
            <div className="checkout-item">
              <span>Fecha</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className="checkout-item">
              <span>Estado</span>
              <span className="badge badge--success">{order.estado}</span>
            </div>
            <div className="checkout-total">
              <span>Total pagado</span>
              <span>{formatPrice(order.precioTotal)}</span>
            </div>
          </div>

          {order.tipsPdfUrl && (
            <a href={order.tipsPdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
              Descargar PDF de Tips
            </a>
          )}

          <div className="confirmation__links">
            <Link to="/dashboard">Ver mis pedidos</Link>
            <Link to="/guias">Explorar más guías</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
