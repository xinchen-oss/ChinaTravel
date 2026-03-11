import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useCart } from '../../context/CartContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatPrice } from '../../utils/formatters';
import { getImageUrl, handleImageError } from '../../utils/imageHelper';
import './Checkout.css';

export default function BatchCheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();

  const [guides, setGuides] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [selectedFlight, setSelectedFlight] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [couponError, setCouponError] = useState('');

  const [filterAccessible, setFilterAccessible] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/carrito');
      return;
    }
    Promise.all([
      Promise.all(items.map((item) => api.get(`/guias/${item.guideId}`))),
      api.get('/hoteles'),
      api.get('/vuelos'),
    ])
      .then(([guideResponses, hotelsRes, flightsRes]) => {
        setGuides(guideResponses.map((r) => r.data.data));
        setHotels(hotelsRes.data.data);
        setFlights(flightsRes.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredHotels = filterAccessible
    ? hotels.filter((h) => h.accesibilidad?.sillasRuedas || h.accesibilidad?.ascensor || h.accesibilidad?.habitacionAdaptada)
    : hotels;

  const filteredFlights = filterAccessible
    ? flights.filter((f) => f.accesibilidad?.sillasRuedas || f.accesibilidad?.asistenciaEspecial)
    : flights;

  const calcSubtotal = () => {
    let total = guides.reduce((sum, g) => sum + (g?.precio || 0), 0);
    if (selectedHotel) {
      const hotel = hotels.find((h) => h._id === selectedHotel);
      const totalNights = guides.reduce((sum, g) => sum + (g?.duracionDias || 0), 0);
      if (hotel) total += hotel.precioPorNoche * totalNights;
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
      setCouponError(err.response?.data?.error || 'Cupon invalido');
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const batchItems = guides.map((guide, i) => {
        const cartItem = items[i];
        let itemPrice = guide.precio;
        if (selectedHotel) {
          const hotel = hotels.find((h) => h._id === selectedHotel);
          if (hotel) itemPrice += hotel.precioPorNoche * guide.duracionDias;
        }
        if (selectedFlight && i === 0) {
          const flight = flights.find((f) => f._id === selectedFlight);
          if (flight) itemPrice += flight.precio;
        }
        return {
          guiaId: guide._id,
          actividadesPersonalizadas: cartItem?.customizations || {},
          hotelId: selectedHotel || undefined,
          vueloId: i === 0 && selectedFlight ? selectedFlight : undefined,
          precioTotal: itemPrice,
        };
      });

      const res = await api.post('/pedidos/batch', {
        items: batchItems,
        cupon: couponData?.codigo || undefined,
      });

      clearCart();
      const orderIds = res.data.data.map((o) => o._id).join(',');
      navigate(`/pedidos-confirmados?ids=${orderIds}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al procesar los pedidos');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (guides.length === 0) return <div className="page"><div className="container"><p>No se encontraron circuitos</p></div></div>;

  const totalNights = guides.reduce((sum, g) => sum + (g?.duracionDias || 0), 0);

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Checkout - {guides.length} circuito{guides.length > 1 ? 's' : ''}</h1>

        <div className="checkout-layout">
          <div className="checkout-options">
            <div className="checkout-section">
              <h2>Tus circuitos</h2>
              {guides.map((guide) => (
                <div key={guide._id} className="checkout-item">
                  <span>{guide.titulo} ({guide.duracionDias} dias)</span>
                  <span>{formatPrice(guide.precio)}</span>
                </div>
              ))}
            </div>

            <div className="checkout-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h2>Hotel (opcional)</h2>
                <label style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input type="checkbox" checked={filterAccessible} onChange={(e) => setFilterAccessible(e.target.checked)} />
                  ♿ Accesible
                </label>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                Se aplicara a todos los circuitos ({totalNights} noches en total)
              </p>
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
              <h2>Cupon de descuento</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Introduce tu codigo"
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
            {guides.map((guide) => (
              <div key={guide._id} className="checkout-item">
                <span>{guide.titulo}</span>
                <span>{formatPrice(guide.precio)}</span>
              </div>
            ))}
            {selectedHotel && (() => {
              const hotel = hotels.find((h) => h._id === selectedHotel);
              return hotel ? (
                <div className="checkout-item">
                  <span>Hotel ({totalNights} noches)</span>
                  <span>{formatPrice(hotel.precioPorNoche * totalNights)}</span>
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
              {submitting ? 'Procesando...' : `Confirmar pago de ${guides.length} circuito${guides.length > 1 ? 's' : ''} (simulado)`}
            </button>
            <p className="checkout-disclaimer">
              Este es un pago simulado. No se realizara ningun cargo.
              <br /><Link to="/politica-cancelacion" style={{ fontSize: '0.75rem' }}>Ver politica de cancelacion</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
