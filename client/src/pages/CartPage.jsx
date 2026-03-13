import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';
import { getImageUrl, handleImageError } from '../utils/imageHelper';
import './CartPage.css';

export default function CartPage() {
  const { items, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <h1 className="page-title">Mi carrito</h1>
          <div className="empty-state">
            <h3>Tu carrito está vacío</h3>
            <p>Explora nuestros <Link to="/guias">circuitos</Link> y añade los que más te gusten</p>
          </div>
        </div>
      </div>
    );
  }

  const total = items.reduce((sum, i) => {
    let itemTotal = i.precio || 0;
    if (i.hotelPrecio) itemTotal += i.hotelPrecio * (i.duracionDias || 1);
    if (i.flightPrecio) itemTotal += i.flightPrecio;
    return sum + itemTotal;
  }, 0);

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Mi carrito</h1>

        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.guideId} className="cart-item">
                <img src={getImageUrl(item.imagen)} alt={item.titulo} className="cart-item__img" onError={handleImageError} />
                <div className="cart-item__info">
                  <h3>{item.titulo}</h3>
                  <p>{item.ciudad} · {item.duracionDias} días</p>
                  <span className="cart-item__price">{formatPrice(item.precio)}</span>
                  {item.hotelNombre && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
                      Hotel: {item.hotelNombre} ({item.duracionDias} noches: {formatPrice(item.hotelPrecio * item.duracionDias)})
                    </p>
                  )}
                  {item.flightNombre && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
                      Vuelo: {item.flightNombre} ({formatPrice(item.flightPrecio)})
                    </p>
                  )}
                </div>
                <div className="cart-item__actions">
                  <button className="btn btn--outline btn--sm" onClick={() => removeItem(item.guideId)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Resumen</h3>
            <div className="cart-summary__row">
              <span>{items.length} circuito{items.length > 1 ? 's' : ''}</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link to="/checkout-all" className="btn btn--primary" style={{ width: '100%', marginTop: '12px', textAlign: 'center', display: 'block' }}>
              Continuar
            </Link>
            <button className="btn btn--outline btn--sm" onClick={clearCart} style={{ width: '100%', marginTop: '12px' }}>
              Vaciar carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
