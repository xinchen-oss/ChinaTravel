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

  const [step, setStep] = useState(1);
  const [guides, setGuides] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Card form
  const [cardData, setCardData] = useState({
    titular: '',
    numero: '',
    mes: '',
    anio: '',
    cvv: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
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

  const calcSubtotal = () => {
    let total = 0;
    guides.forEach((guide, i) => {
      const cartItem = items[i];
      total += guide?.precio || 0;
      if (cartItem?.hotelPrecio) {
        total += cartItem.hotelPrecio * (guide?.duracionDias || 1);
      }
      if (cartItem?.flightPrecio) {
        total += cartItem.flightPrecio;
      }
    });
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
        if (cartItem?.hotelId) {
          const hotel = hotels.find((h) => h._id === cartItem.hotelId);
          if (hotel) itemPrice += hotel.precioPorNoche * guide.duracionDias;
        }
        if (cartItem?.flightId) {
          const flight = flights.find((f) => f._id === cartItem.flightId);
          if (flight) itemPrice += flight.precio;
        }
        return {
          guiaId: guide._id,
          actividadesPersonalizadas: cartItem?.customizations || {},
          hotelId: cartItem?.hotelId || undefined,
          vueloId: cartItem?.flightId || undefined,
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
                  {guides.map((guide, i) => {
                    const cartItem = items[i];
                    return (
                      <div key={guide._id} className="checkout-section" style={{ marginBottom: '12px', padding: '12px', background: 'var(--color-bg-alt, #f9f9f9)', borderRadius: '8px' }}>
                        <div className="checkout-item">
                          <span>{guide.titulo} ({guide.duracionDias} dias) - {guide.ciudad?.nombre}</span>
                          <span>{formatPrice(guide.precio)}</span>
                        </div>
                        {/* Show customized activities if any */}
                        {cartItem?.customizations && Object.keys(cartItem.customizations).length > 0 && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', marginTop: '4px' }}>
                            {Object.keys(cartItem.customizations).length} actividad(es) personalizada(s)
                          </div>
                        )}
                        {cartItem?.hotelNombre && (
                          <div className="checkout-item" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                            <span>Hotel: {cartItem.hotelNombre} ({guide.duracionDias} noches)</span>
                            <span>{formatPrice(cartItem.hotelPrecio * guide.duracionDias)}</span>
                          </div>
                        )}
                        {cartItem?.flightNombre && (
                          <div className="checkout-item" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                            <span>Vuelo: {cartItem.flightNombre}</span>
                            <span>{formatPrice(cartItem.flightPrecio)}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
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
                {guides.map((guide, i) => {
                  const cartItem = items[i];
                  let itemTotal = guide.precio;
                  if (cartItem?.hotelPrecio) itemTotal += cartItem.hotelPrecio * guide.duracionDias;
                  if (cartItem?.flightPrecio) itemTotal += cartItem.flightPrecio;
                  return (
                    <div key={guide._id} className="checkout-item">
                      <span>{guide.titulo}</span>
                      <span>{formatPrice(itemTotal)}</span>
                    </div>
                  );
                })}
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

              <div className="checkout-summary">
                <h2>Resumen del pedido</h2>
                {guides.map((guide, i) => {
                  const cartItem = items[i];
                  let itemTotal = guide.precio;
                  if (cartItem?.hotelPrecio) itemTotal += cartItem.hotelPrecio * guide.duracionDias;
                  if (cartItem?.flightPrecio) itemTotal += cartItem.flightPrecio;
                  return (
                    <div key={guide._id} className="checkout-item">
                      <span>{guide.titulo}</span>
                      <span>{formatPrice(itemTotal)}</span>
                    </div>
                  );
                })}
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
