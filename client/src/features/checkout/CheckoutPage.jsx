import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatPrice } from '../../utils/formatters';
import './Checkout.css';

export default function CheckoutPage() {
  const { guideId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const customizations = location.state?.customizations || {};

  const [guide, setGuide] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [selectedFlight, setSelectedFlight] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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

  const calcTotal = () => {
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
      });
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
              <h2>Tu guía</h2>
              <div className="checkout-item">
                <span>{guide.titulo} ({guide.duracionDias} días)</span>
                <span>{formatPrice(guide.precio)}</span>
              </div>
              {Object.keys(customizations).length > 0 && (
                <p className="checkout-note">{Object.keys(customizations).length} actividad(es) personalizada(s)</p>
              )}
            </div>

            <div className="checkout-section">
              <h2>Hotel (opcional)</h2>
              <select value={selectedHotel} onChange={(e) => setSelectedHotel(e.target.value)} className="checkout-select">
                <option value="">Sin hotel</option>
                {hotels.map((hotel) => (
                  <option key={hotel._id} value={hotel._id}>
                    {hotel.nombre} ({'★'.repeat(hotel.estrellas)}) - {formatPrice(hotel.precioPorNoche)}/noche
                  </option>
                ))}
              </select>
            </div>

            <div className="checkout-section">
              <h2>Vuelo (opcional)</h2>
              <select value={selectedFlight} onChange={(e) => setSelectedFlight(e.target.value)} className="checkout-select">
                <option value="">Sin vuelo</option>
                {flights.map((flight) => (
                  <option key={flight._id} value={flight._id}>
                    {flight.aerolinea} ({flight.origen} → {flight.destino}) - {formatPrice(flight.precio)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="checkout-summary">
            <h2>Resumen</h2>
            <div className="checkout-item">
              <span>Guía</span>
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
            <div className="checkout-total">
              <span>Total</span>
              <span>{formatPrice(calcTotal())}</span>
            </div>
            {error && <div className="auth-error">{error}</div>}
            <button onClick={handleSubmit} className="btn btn--primary btn--lg" disabled={submitting} style={{ width: '100%' }}>
              {submitting ? 'Procesando...' : 'Confirmar pago (simulado)'}
            </button>
            <p className="checkout-disclaimer">Este es un pago simulado. No se realizará ningún cargo.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
