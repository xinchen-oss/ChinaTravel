import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ReviewSection from '../../components/common/ReviewSection';
import { formatPrice } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../utils/imageHelper';
import './Guides.css';

export default function GuideDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addItem, isInCart } = useCart();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/guias/${id}`)
      .then((res) => setGuide(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!guide) return <div className="page"><div className="container"><p>Guía no encontrada</p></div></div>;

  return (
    <>
      {/* Banner con imagen */}
      <section
        className="guide-banner"
        style={{ backgroundImage: `url(${getImageUrl(guide.imagen || guide.ciudad?.imagenPortada)})` }}
      >
        <div className="guide-banner__overlay" />
        <div className="container guide-banner__content">
          <span className="guide-banner__city">{guide.ciudad?.nombre}</span>
          <h1>{guide.titulo}</h1>
          <div className="guide-banner__tags">
            <span>{guide.duracionDias} días</span>
            <span>Guía en español</span>
            <span>Todo incluido</span>
          </div>
        </div>
      </section>

      <div className="page">
        <div className="container">
          <div className="guide-detail-layout">
            {/* Contenido principal */}
            <div className="guide-detail__main">
              <div className="guide-detail__section">
                <h2>Descripción</h2>
                <p className="guide-detail__desc">{guide.descripcion}</p>
              </div>

              {/* Incluido */}
              <div className="guide-detail__section">
                <h2>El circuito incluye</h2>
                <div className="includes-grid">
                  <div className="include-item">
                    <span className="include-item__icon">🏨</span>
                    <div>
                      <h4>Alojamiento</h4>
                      <p>Hoteles de 4-5 estrellas</p>
                    </div>
                  </div>
                  <div className="include-item">
                    <span className="include-item__icon">🍜</span>
                    <div>
                      <h4>Comidas</h4>
                      <p>Pensión completa</p>
                    </div>
                  </div>
                  <div className="include-item">
                    <span className="include-item__icon">🚌</span>
                    <div>
                      <h4>Transporte</h4>
                      <p>Traslados y excursiones</p>
                    </div>
                  </div>
                  <div className="include-item">
                    <span className="include-item__icon">🧑‍🏫</span>
                    <div>
                      <h4>Guía</h4>
                      <p>Guía de habla hispana</p>
                    </div>
                  </div>
                  <div className="include-item">
                    <span className="include-item__icon">🛡️</span>
                    <div>
                      <h4>Seguro</h4>
                      <p>Seguro de viaje incluido</p>
                    </div>
                  </div>
                  <div className="include-item">
                    <span className="include-item__icon">🎫</span>
                    <div>
                      <h4>Entradas</h4>
                      <p>Acceso a monumentos</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Itinerario */}
              <div className="guide-detail__section">
                <h2>Itinerario día a día</h2>
                {guide.dias?.map((dia) => (
                  <div key={dia.numeroDia} className="day-card">
                    <div className="day-card__header">
                      <span className="day-card__number">Día {dia.numeroDia}</span>
                      <h3 className="day-card__title">{dia.titulo}</h3>
                    </div>
                    <div className="day-card__activities">
                      {dia.actividades?.map((slot, i) => (
                        <div key={i} className="activity-slot">
                          <div className="activity-slot__time">
                            {slot.horaInicio && <span>{slot.horaInicio} - {slot.horaFin}</span>}
                          </div>
                          <div className="activity-slot__info">
                            <h4>{slot.actividad?.nombre}</h4>
                            <p>{slot.actividad?.descripcion}</p>
                            {slot.actividad?.categoria && (
                              <span className="activity-slot__category">{slot.actividad.categoria}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar de reserva */}
            <aside className="guide-detail__sidebar">
              <div className="booking-card">
                <div className="booking-card__price">
                  <span className="booking-card__price-label">Desde</span>
                  <span className="booking-card__price-value">{formatPrice(guide.precio)}</span>
                  <span className="booking-card__price-per">por persona</span>
                </div>
                <div className="booking-card__info">
                  <div className="booking-card__row">
                    <span>Duración</span>
                    <strong>{guide.duracionDias} días</strong>
                  </div>
                  <div className="booking-card__row">
                    <span>Destino</span>
                    <strong>{guide.ciudad?.nombre}</strong>
                  </div>
                </div>
                {user ? (
                  <div className="booking-card__actions">
                    <Link to={`/guias/${id}/personalizar`} className="btn btn--primary" style={{ width: '100%' }}>Personalizar itinerario</Link>
                    <Link to={`/checkout/${id}`} className="btn btn--secondary" style={{ width: '100%' }}>Reservar ahora</Link>
                    <button
                      className="btn btn--outline"
                      style={{ width: '100%' }}
                      disabled={isInCart(id)}
                      onClick={() => addItem({
                        guideId: id,
                        titulo: guide.titulo,
                        ciudad: guide.ciudad?.nombre,
                        precio: guide.precio,
                        duracionDias: guide.duracionDias,
                        imagen: guide.imagen || guide.ciudad?.imagenPortada,
                      })}
                    >
                      {isInCart(id) ? '✓ En el carrito' : '🛒 Añadir al carrito'}
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="btn btn--primary" style={{ width: '100%' }}>Inicia sesión para reservar</Link>
                )}
              </div>
            </aside>
          </div>

          {/* Reviews */}
          <ReviewSection tipo="GUIA" referenciaId={id} />
        </div>
      </div>
    </>
  );
}
