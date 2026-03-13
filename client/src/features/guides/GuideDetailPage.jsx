import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem, isInCart } = useCart();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hotel & flight selection
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [selectedFlight, setSelectedFlight] = useState('');
  const [filterAccessible, setFilterAccessible] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/guias/${id}`),
      api.get('/hoteles'),
      api.get('/vuelos'),
    ])
      .then(([guideRes, hotelsRes, flightsRes]) => {
        setGuide(guideRes.data.data);
        setHotels(hotelsRes.data.data);
        setFlights(flightsRes.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Filter hotels by guide's city
  const cityId = guide?.ciudad?._id;
  const cityHotels = hotels.filter((h) => {
    const hotelCity = h.ciudad?._id || h.ciudad;
    return !cityId || hotelCity === cityId;
  });
  const cityFlights = flights.filter((f) => {
    const flightCity = f.ciudadDestino?._id || f.ciudadDestino;
    return !cityId || flightCity === cityId;
  });

  const filteredHotels = filterAccessible
    ? cityHotels.filter((h) => h.accesibilidad?.sillasRuedas || h.accesibilidad?.ascensor || h.accesibilidad?.habitacionAdaptada)
    : cityHotels;

  const filteredFlights = filterAccessible
    ? cityFlights.filter((f) => f.accesibilidad?.sillasRuedas || f.accesibilidad?.asistenciaEspecial)
    : cityFlights;

  const buildCartItem = () => {
    const hotel = selectedHotel ? hotels.find((h) => h._id === selectedHotel) : null;
    const flight = selectedFlight ? flights.find((f) => f._id === selectedFlight) : null;
    return {
      guideId: id,
      titulo: guide.titulo,
      ciudad: guide.ciudad?.nombre,
      precio: guide.precio,
      duracionDias: guide.duracionDias,
      imagen: guide.imagen || guide.ciudad?.imagenPortada,
      hotelId: selectedHotel || undefined,
      hotelNombre: hotel ? `${hotel.nombre} (${'★'.repeat(hotel.estrellas)})` : undefined,
      hotelPrecio: hotel ? hotel.precioPorNoche : undefined,
      flightId: selectedFlight || undefined,
      flightNombre: flight ? `${flight.aerolinea} (${flight.origen} → ${flight.destino})` : undefined,
      flightPrecio: flight ? flight.precio : undefined,
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
                  <>
                    {/* Hotel selection */}
                    <div className="booking-card__section">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Hotel (opcional)</h4>
                        <label style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input type="checkbox" checked={filterAccessible} onChange={(e) => setFilterAccessible(e.target.checked)} />
                          Accesible
                        </label>
                      </div>
                      <select value={selectedHotel} onChange={(e) => setSelectedHotel(e.target.value)} className="checkout-select" style={{ width: '100%', fontSize: '0.85rem' }}>
                        <option value="">Sin hotel</option>
                        {filteredHotels.map((hotel) => (
                          <option key={hotel._id} value={hotel._id}>
                            {hotel.nombre} ({'★'.repeat(hotel.estrellas)}) - {formatPrice(hotel.precioPorNoche)}/noche
                          </option>
                        ))}
                      </select>
                      {selectedHotel && (() => {
                        const hotel = hotels.find((h) => h._id === selectedHotel);
                        return hotel ? (
                          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                            {guide.duracionDias} noches: {formatPrice(hotel.precioPorNoche * guide.duracionDias)}
                          </p>
                        ) : null;
                      })()}
                    </div>

                    {/* Flight selection */}
                    <div className="booking-card__section">
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '0.9rem' }}>Vuelo (opcional)</h4>
                      <select value={selectedFlight} onChange={(e) => setSelectedFlight(e.target.value)} className="checkout-select" style={{ width: '100%', fontSize: '0.85rem' }}>
                        <option value="">Sin vuelo</option>
                        {filteredFlights.map((flight) => (
                          <option key={flight._id} value={flight._id}>
                            {flight.aerolinea} ({flight.origen} → {flight.destino}) - {formatPrice(flight.precio)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="booking-card__actions">
                      <Link to={`/guias/${id}/personalizar`} className="btn btn--primary" style={{ width: '100%' }}>Personalizar itinerario</Link>
                      <button
                        className="btn btn--secondary"
                        style={{ width: '100%' }}
                        disabled={isInCart(id)}
                        onClick={handleReservar}
                      >
                        {isInCart(id) ? '✓ Ya reservado' : 'Reservar ahora'}
                      </button>
                      <button
                        className="btn btn--outline"
                        style={{ width: '100%' }}
                        disabled={isInCart(id)}
                        onClick={handleAddToCart}
                      >
                        {isInCart(id) ? '✓ En el carrito' : 'Añadir al carrito'}
                      </button>
                    </div>
                  </>
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
