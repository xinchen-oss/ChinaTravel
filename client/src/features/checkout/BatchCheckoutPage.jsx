import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useCart } from '../../context/CartContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatPrice } from '../../utils/formatters';
import './Checkout.css';

export default function BatchCheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();

  const [step, setStep] = useState(1); // 1 = resumen, 2 = pago
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

  // Card form
  const [cardData, setCardData] = useState({
    titular: '',
    numero: '',
    mes: '',
    anio: '',
    cvv: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card'); // card, bizum, paypal
  const [cardErrors, setCardErrors] = useState({});

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
  const totalNights = guides.reduce((sum, g) => sum + (g?.duracionDias || 0), 0);

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

  // Format card number with spaces
  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const handleCardChange = (field, value) => {
    setCardErrors((prev) => ({ ...prev, [field]: '' }));
    if (field === 'numero') {
      setCardData((prev) => ({ ...prev, numero: formatCardNumber(value) }));
    } else if (field === 'cvv') {
      setCardData((prev) => ({ ...prev, cvv: value.replace(/\D/g, '').slice(0, 4) }));
    } else if (field === 'mes') {
      setCardData((prev) => ({ ...prev, mes: value.replace(/\D/g, '').slice(0, 2) }));
    } else if (field === 'anio') {
      setCardData((prev) => ({ ...prev, anio: value.replace(/\D/g, '').slice(0, 2) }));
    } else {
      setCardData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const detectCardBrand = () => {
    const num = cardData.numero.replace(/\s/g, '');
    if (num.startsWith('4')) return 'visa';
    if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) return 'mastercard';
    if (/^3[47]/.test(num)) return 'amex';
    return null;
  };

  const validateCard = () => {
    const errors = {};
    if (paymentMethod !== 'card') return true;
    if (!cardData.titular.trim()) errors.titular = 'Introduce el titular';
    const digits = cardData.numero.replace(/\s/g, '');
    if (digits.length < 13 || digits.length > 16) errors.numero = 'Numero de tarjeta invalido';
    const mes = parseInt(cardData.mes, 10);
    if (!mes || mes < 1 || mes > 12) errors.mes = 'Mes invalido';
    if (!cardData.anio || cardData.anio.length !== 2) errors.anio = 'Anio invalido';
    if (cardData.cvv.length < 3) errors.cvv = 'CVV invalido';
    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateCard()) return;
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

  const cardBrand = detectCardBrand();

  return (
    <div className="page">
      <div className="container">
        {/* Steps indicator */}
        <div className="checkout-steps">
          <div className={`checkout-steps__step ${step >= 1 ? 'checkout-steps__step--active' : ''}`}>
            <span className="checkout-steps__num">1</span>
            <span>Resumen</span>
          </div>
          <div className="checkout-steps__line" />
          <div className={`checkout-steps__step ${step >= 2 ? 'checkout-steps__step--active' : ''}`}>
            <span className="checkout-steps__num">2</span>
            <span>Pago</span>
          </div>
        </div>

        {step === 1 && (
          <>
            <h1 className="page-title">Tu pedido</h1>
            <div className="checkout-layout">
              <div className="checkout-options">
                <div className="checkout-section">
                  <h2>Tus circuitos ({guides.length})</h2>
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
                      Accesible
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
                      {couponData.descripcion || couponData.codigo}: -{formatPrice(couponData.descuento)}
                    </p>
                  )}
                </div>
              </div>

              <div className="checkout-summary">
                <h2>Resumen del pedido</h2>
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
                <button onClick={() => setStep(2)} className="btn btn--primary btn--lg" style={{ width: '100%' }}>
                  Continuar al pago
                </button>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="page-title">Forma de pago</h1>
            <div className="checkout-layout">
              <div className="checkout-options">
                {/* Payment method selector */}
                <div className="checkout-section">
                  <h2>Selecciona tu forma de pago</h2>
                  <div className="payment-methods">
                    <label className={`payment-method ${paymentMethod === 'card' ? 'payment-method--active' : ''}`}>
                      <input type="radio" name="pm" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                      <div className="payment-method__content">
                        <div className="payment-method__icons">
                          <span className="payment-icon payment-icon--visa">VISA</span>
                          <span className="payment-icon payment-icon--mc">MC</span>
                          <span className="payment-icon payment-icon--amex">AMEX</span>
                        </div>
                        <span>Tarjeta de credito / debito</span>
                      </div>
                    </label>
                    <label className={`payment-method ${paymentMethod === 'paypal' ? 'payment-method--active' : ''}`}>
                      <input type="radio" name="pm" value="paypal" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} />
                      <div className="payment-method__content">
                        <span className="payment-icon payment-icon--paypal">PayPal</span>
                        <span>PayPal</span>
                      </div>
                    </label>
                    <label className={`payment-method ${paymentMethod === 'bizum' ? 'payment-method--active' : ''}`}>
                      <input type="radio" name="pm" value="bizum" checked={paymentMethod === 'bizum'} onChange={() => setPaymentMethod('bizum')} />
                      <div className="payment-method__content">
                        <span className="payment-icon payment-icon--bizum">Bizum</span>
                        <span>Bizum</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Card form */}
                {paymentMethod === 'card' && (
                  <div className="checkout-section">
                    <h2>Datos de la tarjeta</h2>
                    <div className="card-form">
                      <div className="card-form__field">
                        <label>Titular de la tarjeta</label>
                        <input
                          type="text"
                          value={cardData.titular}
                          onChange={(e) => handleCardChange('titular', e.target.value)}
                          placeholder="Nombre como aparece en la tarjeta"
                          className={`checkout-select ${cardErrors.titular ? 'checkout-select--error' : ''}`}
                          autoComplete="cc-name"
                        />
                        {cardErrors.titular && <span className="card-form__error">{cardErrors.titular}</span>}
                      </div>

                      <div className="card-form__field">
                        <label>Numero de tarjeta</label>
                        <div className="card-form__number-wrap">
                          <input
                            type="text"
                            value={cardData.numero}
                            onChange={(e) => handleCardChange('numero', e.target.value)}
                            placeholder="0000 0000 0000 0000"
                            className={`checkout-select ${cardErrors.numero ? 'checkout-select--error' : ''}`}
                            autoComplete="cc-number"
                            inputMode="numeric"
                          />
                          {cardBrand && (
                            <span className={`card-brand card-brand--${cardBrand}`}>
                              {cardBrand === 'visa' ? 'VISA' : cardBrand === 'mastercard' ? 'MC' : 'AMEX'}
                            </span>
                          )}
                        </div>
                        {cardErrors.numero && <span className="card-form__error">{cardErrors.numero}</span>}
                      </div>

                      <div className="card-form__row">
                        <div className="card-form__field">
                          <label>Fecha de caducidad</label>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input
                              type="text"
                              value={cardData.mes}
                              onChange={(e) => handleCardChange('mes', e.target.value)}
                              placeholder="MM"
                              className={`checkout-select ${cardErrors.mes ? 'checkout-select--error' : ''}`}
                              style={{ width: '70px', textAlign: 'center' }}
                              autoComplete="cc-exp-month"
                              inputMode="numeric"
                            />
                            <span style={{ color: 'var(--color-text-muted)' }}>/</span>
                            <input
                              type="text"
                              value={cardData.anio}
                              onChange={(e) => handleCardChange('anio', e.target.value)}
                              placeholder="AA"
                              className={`checkout-select ${cardErrors.anio ? 'checkout-select--error' : ''}`}
                              style={{ width: '70px', textAlign: 'center' }}
                              autoComplete="cc-exp-year"
                              inputMode="numeric"
                            />
                          </div>
                          {(cardErrors.mes || cardErrors.anio) && <span className="card-form__error">{cardErrors.mes || cardErrors.anio}</span>}
                        </div>
                        <div className="card-form__field">
                          <label>CVV / CVC</label>
                          <input
                            type="password"
                            value={cardData.cvv}
                            onChange={(e) => handleCardChange('cvv', e.target.value)}
                            placeholder="***"
                            className={`checkout-select ${cardErrors.cvv ? 'checkout-select--error' : ''}`}
                            style={{ width: '100px', textAlign: 'center' }}
                            autoComplete="cc-csc"
                            inputMode="numeric"
                          />
                          {cardErrors.cvv && <span className="card-form__error">{cardErrors.cvv}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="card-form__secure">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M12 6H4V5C4 2.79 5.79 1 8 1s4 1.79 4 4v1zm1 0V5c0-2.76-2.24-5-5-5S3 2.24 3 5v1a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2z" fill="#4CAF50"/>
                      </svg>
                      <span>Pago seguro con encriptacion SSL. Tus datos estan protegidos.</span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="checkout-section">
                    <div style={{ textAlign: 'center', padding: '24px 0' }}>
                      <p style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}>Seras redirigido a PayPal para completar el pago</p>
                    </div>
                  </div>
                )}

                {paymentMethod === 'bizum' && (
                  <div className="checkout-section">
                    <div style={{ textAlign: 'center', padding: '24px 0' }}>
                      <p style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}>Seras redirigido a Bizum para completar el pago</p>
                    </div>
                  </div>
                )}

                <button onClick={() => setStep(1)} className="btn btn--outline" style={{ marginTop: '8px' }}>
                  Volver al resumen
                </button>
              </div>

              {/* Right side summary */}
              <div className="checkout-summary">
                <h2>Resumen del pedido</h2>
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
                  <span>Total a pagar</span>
                  <span>{formatPrice(calcTotal())}</span>
                </div>
                {error && <div className="auth-error">{error}</div>}
                <button onClick={handleSubmit} className="btn btn--primary btn--lg" disabled={submitting} style={{ width: '100%' }}>
                  {submitting ? 'Procesando pago...' : `Pagar ${formatPrice(calcTotal())}`}
                </button>
                <p className="checkout-disclaimer">
                  Este es un pago simulado. No se realizara ningun cargo real.
                  <br /><Link to="/politica-cancelacion" style={{ fontSize: '0.75rem' }}>Ver politica de cancelacion</Link>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
