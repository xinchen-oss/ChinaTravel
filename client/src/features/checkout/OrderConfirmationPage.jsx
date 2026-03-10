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

  const itinerary = order.guiaPersonalizada?.length ? order.guiaPersonalizada : (order.guia?.dias || []);

  return (
    <div className="page">
      <div className="container">
        <div className="confirmation">
          <div className="confirmation__icon">&#10003;</div>
          <h1>¡Pedido confirmado!</h1>
          <p className="confirmation__subtitle">Gracias por tu compra. Recibirás un email de confirmación con tu factura y PDF de tips adjunto.</p>

          <div className="confirmation__details">
            <div className="checkout-item">
              <span>Guía</span>
              <span>{order.guia?.titulo}</span>
            </div>
            <div className="checkout-item">
              <span>Destino</span>
              <span>{order.guia?.ciudad?.nombre || '—'}</span>
            </div>
            <div className="checkout-item">
              <span>Duración</span>
              <span>{order.guia?.duracionDias} días</span>
            </div>
            <div className="checkout-item">
              <span>Fecha</span>
              <span>{formatDate(order.createdAt)}</span>
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
            <div className="checkout-total">
              <span>Total pagado</span>
              <span>{formatPrice(order.precioTotal)}</span>
            </div>
          </div>

          {/* Itinerary */}
          {itinerary.length > 0 && (
            <div className="confirmation__itinerary">
              <h2>Tu itinerario</h2>
              {itinerary.map((dia) => (
                <div key={dia.numeroDia} className="itinerary-day">
                  <div className="itinerary-day__header">
                    <span className="itinerary-day__number">Día {dia.numeroDia}</span>
                    <span className="itinerary-day__title">{dia.titulo}</span>
                  </div>
                  <div className="itinerary-day__activities">
                    {dia.actividades?.map((slot, i) => (
                      <div key={i} className="itinerary-slot">
                        <div className="itinerary-slot__time">
                          {slot.horaInicio ? `${slot.horaInicio} - ${slot.horaFin}` : '—'}
                        </div>
                        <div className="itinerary-slot__info">
                          <strong>{slot.actividad?.nombre || 'Actividad'}</strong>
                          {slot.actividad?.descripcion && (
                            <p style={{ fontSize: '0.85rem', color: '#666', margin: '4px 0 0' }}>
                              {slot.actividad.descripcion}
                            </p>
                          )}
                          {slot.actividad?.categoria && (
                            <span className="itinerary-slot__category">{slot.actividad.categoria}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

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
