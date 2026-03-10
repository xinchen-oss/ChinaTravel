import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useCart } from '../../context/CartContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatPrice } from '../../utils/formatters';
import './Checkout.css';

export default function CheckoutPage() {
  const { guideId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { removeItem } = useCart();
  const customizations = location.state?.customizations || {};

  const [guide, setGuide] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [selectedFlight, setSelectedFlight] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Accessibility filters
  const [filterAccessible, setFilterAccessible] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/guias/${guideId}`),
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
  }, [guideId]);

  const filteredHotels = filterAccessible
    ? hotels.filter((h) => h.accesibilidad?.sillasRuedas || h.accesibilidad?.ascensor || h.accesibilidad?.habitacionAdaptada)
    : hotels;

  const filteredFlights = filterAccessible
    ? flights.filter((f) => f.accesibilidad?.sillasRuedas || f.accesibilidad?.asistenciaEspecial)
    : flights;

  const calcSubtotal = () => {
    let total = guide?.precio || 0;
    if (selectedHotel) {
      const hotel = hotels.find((h) => h._id === selectedHotel);
      if (hotel) total += hotel.precioPorNoche * (guide?.duracionDias || 1);
    }
    if (selectedFlight) {
      const flight = flights.find((f) => f._id === selectedFlight);
      if (flight) total += flight.precio;
    }
    return total;
  };

  const descuento = couponData?.descuento || 0;
  const calcTotal = () => Math.max(0, calcSubtotal() - descuento);

  const applyCoupon = async () => {
    setCouponError('');
    setCouponData(null);
    if (!couponCode.trim()) return;
    try {
      const res = await api.post('/cupones/validar', { codigo: couponCode, total: calcSubtotal() });
      setCouponData(res.data.data);
    } catch (err) {
      setCouponError(err.response?.data?.error || 'Cupón inválido');
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await api.post('/pedidos', {
        guiaId: guideId,
        actividadesPersonalizadas: customizations,
        hotelId: selectedHotel || undefined,
        vueloId: selectedFlight || undefined,
        precioTotal: calcTotal(),
        descuento,
        cupon: couponData?.codigo || undefined,
      });
      removeItem(guideId);
      navigate(`/pedido-confirmado/${res.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al procesar el pedido');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!guide) return <div className="page"><div className="container"><p>Guía no encontrada</p></div></div>;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>

        <div className="checkout-layout">
          <div className="checkout-options">
            <div className="checkout-section">
              <h2>Tu circuito</h2>
              <div className="checkout-item">
                <span>{guide.titulo} ({guide.duracionDias} días)</span>
                <span>{formatPrice(guide.precio)}</span>
              </div>
              {Object.keys(customizations).length > 0 && (
                <p className="checkout-note">{Object.keys(customizations).length} actividad(es) personalizada(s)</p>
              )}
            </div>

            <div className="checkout-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h2>Hotel (opcional)</h2>
                <label style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input type="checkbox" checked={filterAccessible} onChange={(e) => setFilterAccessible(e.target.checked)} />
                  ♿ Accesible
                </label>
              </div>
              <select value={selectedHotel} onChange={(e) => setSelectedHotel(e.target.value)} className="checkout-select">
                <option value="">Sin hotel</option>
                {filteredHotels.map((hotel) => (
                  <option key={hotel._id} value={hotel._id}>
                    {hotel.nombre} ({'★'.repeat(hotel.estrellas)}) - {formatPrice(hotel.precioPorNoche)}/noche
                    {hotel.accesibilidad?.sillasRuedas ? ' ♿' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="checkout-section">
              <h2>Vuelo (opcional)</h2>
              <select value={selectedFlight} onChange={(e) => setSelectedFlight(e.target.value)} className="checkout-select">
                <option value="">Sin vuelo</option>
                {filteredFlights.map((flight) => (
                  <option key={flight._id} value={flight._id}>
                    {flight.aerolinea} ({flight.origen} → {flight.destino}) - {formatPrice(flight.precio)}
                    {flight.accesibilidad?.sillasRuedas ? ' ♿' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="checkout-section">
              <h2>Cupón de descuento</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Introduce tu código"
                  className="checkout-select"
                  style={{ flex: 1, textTransform: 'uppercase' }}
                />
                <button onClick={applyCoupon} className="btn btn--outline btn--sm">Aplicar</button>
              </div>
              {couponError && <p style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px' }}>{couponError}</p>}
              {couponData && (
                <p style={{ color: 'var(--color-success)', fontSize: '0.8rem', marginTop: '4px' }}>
                  ✓ {couponData.descripcion || couponData.codigo}: -{formatPrice(couponData.descuento)}
                </p>
              )}
            </div>
          </div>

          <div className="checkout-summary">
            <h2>Resumen</h2>
            <div className="checkout-item">
              <span>Circuito</span>
              <span>{formatPrice(guide.precio)}</span>
            </div>
            {selectedHotel && (() => {
              const hotel = hotels.find((h) => h._id === selectedHotel);
              return hotel ? (
                <div className="checkout-item">
                  <span>Hotel ({guide.duracionDias} noches)</span>
                  <span>{formatPrice(hotel.precioPorNoche * guide.duracionDias)}</span>
                </div>
              ) : null;
            })()}
            {selectedFlight && (() => {
              const flight = flights.find((f) => f._id === selectedFlight);
              return flight ? (
                <div className="checkout-item">
                  <span>Vuelo</span>
                  <span>{formatPrice(flight.precio)}</span>
                </div>
              ) : null;
            })()}
            {descuento > 0 && (
              <div className="checkout-item" style={{ color: 'var(--color-success)' }}>
                <span>Descuento ({couponData.codigo})</span>
                <span>-{formatPrice(descuento)}</span>
              </div>
            )}
            <div className="checkout-total">
              <span>Total</span>
              <span>{formatPrice(calcTotal())}</span>
            </div>
            {error && <div className="auth-error">{error}</div>}
            <button onClick={handleSubmit} className="btn btn--primary btn--lg" disabled={submitting} style={{ width: '100%' }}>
              {submitting ? 'Procesando...' : 'Confirmar pago (simulado)'}
            </button>
            <p className="checkout-disclaimer">
              Este es un pago simulado. No se realizará ningún cargo.
              <br /><Link to="/politica-cancelacion" style={{ fontSize: '0.75rem' }}>Ver política de cancelación</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
