import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ReviewSection from '../../components/common/ReviewSection';
import { formatPrice } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../utils/imageHelper';
import './Rutas.css';

export default function RutaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addItem, isInCart } = useCart();

  // Customizations passed back from RutaCustomizePage:
  // a map of { oldActivityId: newActivityObject }, where the object may be a
  // real Activity (has precio) or the "actividad por libre" sentinel (esPorLibre, precio 0).
  const [customizations, setCustomizations] = useState({});

  useEffect(() => {
    if (location.state?.customizations) {
      setCustomizations(location.state.customizations);
    }
  }, [location.state]);

  const [ruta, setRuta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/rutas/${id}`)
      .then((res) => setRuta(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Resolve the activity shown in a slot (swapped one wins).
  const slotActivity = (slot) => customizations[slot.actividad?._id] || slot.actividad;
  const slotPrice = (slot) => {
    const act = slotActivity(slot);
    if (!act || act.esPorLibre) return 0;
    return act.precio || 0;
  };

  // Ruta price = sum of its (possibly customized) ticket prices.
  const total = (ruta?.dias || []).reduce(
    (t, dia) => t + (dia.actividades || []).reduce((s, slot) => s + slotPrice(slot), 0),
    0
  );

  const buildCartItem = () => {
    // Convert customizations to a backend-friendly map: id -> newId | 'POR_LIBRE'
    const customizationIds = Object.keys(customizations).length > 0
      ? Object.fromEntries(
          Object.entries(customizations).map(([oldId, act]) => [oldId, act.esPorLibre ? 'POR_LIBRE' : act._id])
        )
      : undefined;
    return {
      tipo: 'RUTA',
      id,
      titulo: ruta.titulo,
      ciudad: ruta.ciudad?.nombre,
      precio: total,
      duracionDias: ruta.duracionDias,
      imagen: ruta.imagen || ruta.ciudad?.imagenPortada,
      customizations: customizationIds,
    };
  };

  const handleReservar = () => {
    addItem(buildCartItem());
    navigate('/checkout-all');
  };

  const handleAddToCart = () => {
    addItem(buildCartItem());
  };

  if (loading) return <LoadingSpinner />;
  if (!ruta) return <div className="page"><div className="container"><p>Ruta no encontrada</p></div></div>;

  const inCart = isInCart('RUTA', id);
  const numCambios = Object.keys(customizations).length;

  return (
    <>
      {/* Banner con imagen */}
      <section
        className="guide-banner"
        style={{ backgroundImage: `url(${getImageUrl(ruta.imagen || ruta.ciudad?.imagenPortada, id)})` }}
      >
        <div className="guide-banner__overlay" />
        <div className="container guide-banner__content">
          <span className="guide-banner__city">{ruta.ciudad?.nombre}</span>
          <h1>{ruta.titulo}</h1>
          <div className="guide-banner__tags">
            <span>{ruta.duracionDias} días</span>
            <span>Solo entradas</span>
            <span>Itinerario personalizable</span>
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
                <p className="guide-detail__desc">{ruta.descripcion}</p>
              </div>

              {/* Incluido */}
              <div className="guide-detail__section">
                <h2>La ruta incluye</h2>
                <div className="includes-grid">
                  <div className="include-item">
                    <span className="include-item__icon">🎫</span>
                    <div>
                      <h4>Entradas a las atracciones</h4>
                      <p>El precio cubre todas las entradas del itinerario</p>
                    </div>
                  </div>
                  <div className="include-item">
                    <span className="include-item__icon">🗽</span>
                    <div>
                      <h4>Itinerario flexible</h4>
                      <p>Cambia actividades o elige "actividad por libre"</p>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-sm)' }}>
                  El alojamiento y los vuelos no están incluidos: tú los organizas a tu medida.
                </p>
              </div>

              {/* Itinerario */}
              <div className="guide-detail__section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <h2>Itinerario día a día</h2>
                  {numCambios > 0 && (
                    <span style={{ fontSize: '0.85rem', background: 'var(--color-primary)', color: '#fff', padding: '4px 12px', borderRadius: '20px' }}>
                      Personalizado ({numCambios} cambio{numCambios > 1 ? 's' : ''})
                    </span>
                  )}
                </div>
                {ruta.dias?.map((dia) => (
                  <div key={dia.numeroDia} className="day-card">
                    <div className="day-card__header">
                      <span className="day-card__number">Día {dia.numeroDia}</span>
                      <h3 className="day-card__title">{dia.titulo}</h3>
                    </div>
                    <div className="day-card__activities">
                      {dia.actividades?.map((slot, i) => {
                        const swapped = customizations[slot.actividad?._id];
                        const display = swapped || slot.actividad;
                        const esPorLibre = display?.esPorLibre;
                        const precio = esPorLibre ? 0 : (display?.precio || 0);
                        return (
                          <div key={i} className={`activity-slot ${swapped ? 'activity-slot--swapped' : ''}`}>
                            <div className="activity-slot__time">
                              {slot.horaInicio && <span>{slot.horaInicio} - {slot.horaFin}</span>}
                            </div>
                            <div className="activity-slot__info">
                              <h4>
                                {display?.nombre}{' '}
                                {swapped && (
                                  <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                                    {esPorLibre ? '(por libre)' : '(personalizada)'}
                                  </span>
                                )}
                              </h4>
                              <p>{display?.descripcion}</p>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                {display?.categoria && !esPorLibre && (
                                  <span className="activity-slot__category">{display.categoria}</span>
                                )}
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: precio > 0 ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                                  {esPorLibre ? 'Por libre' : precio > 0 ? formatPrice(precio) : 'Gratis'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar de reserva */}
            <aside className="guide-detail__sidebar">
              <div className="booking-card">
                <div className="booking-card__price">
                  <span className="booking-card__price-label">Total entradas</span>
                  <span className="booking-card__price-value">{formatPrice(total)}</span>
                  <span className="booking-card__price-per">por persona</span>
                </div>
                <div className="booking-card__info">
                  <div className="booking-card__row">
                    <span>Duración</span>
                    <strong>{ruta.duracionDias} días</strong>
                  </div>
                  <div className="booking-card__row">
                    <span>Destino</span>
                    <strong>{ruta.ciudad?.nombre}</strong>
                  </div>
                </div>

                {user && user.role !== 'ADMIN' && user.role !== 'COMERCIAL' ? (
                  <div className="booking-card__actions">
                    <Link to={`/rutas/${id}/personalizar`} className="btn btn--primary" style={{ width: '100%' }}>
                      {numCambios > 0 ? 'Modificar personalización' : 'Personalizar itinerario'}
                    </Link>
                    {numCambios > 0 && (
                      <button className="btn btn--outline" style={{ width: '100%', fontSize: '0.85rem' }} onClick={() => setCustomizations({})}>
                        Restaurar itinerario original
                      </button>
                    )}
                    <button
                      className="btn btn--secondary"
                      style={{ width: '100%' }}
                      disabled={inCart}
                      onClick={handleReservar}
                    >
                      {inCart ? '✓ Ya reservado' : 'Reservar ahora'}
                    </button>
                    <button
                      className="btn btn--outline"
                      style={{ width: '100%' }}
                      disabled={inCart}
                      onClick={handleAddToCart}
                    >
                      {inCart ? '✓ En el carrito' : 'Añadir al carrito'}
                    </button>
                  </div>
                ) : !user ? (
                  <Link to="/login" className="btn btn--primary" style={{ width: '100%' }}>Inicia sesión para reservar</Link>
                ) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-md) 0' }}>
                    Las cuentas {user.role === 'ADMIN' ? 'de administrador' : 'comerciales'} no pueden realizar compras
                  </p>
                )}
              </div>
            </aside>
          </div>

          {/* Reviews */}
          <ReviewSection tipo="RUTA" referenciaId={id} />
        </div>
      </div>
    </>
  );
}
