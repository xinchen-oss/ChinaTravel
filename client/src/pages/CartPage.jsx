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

  const total = items.reduce((sum, i) => sum + (i.precio || 0), 0);

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
                </div>
                <div className="cart-item__actions">
                  <Link to={`/checkout/${item.guideId}`} state={{ customizations: item.customizations || {} }} className="btn btn--primary btn--sm">
                    Comprar
                  </Link>
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
            <p className="cart-summary__note">Hotel y vuelo se seleccionan al comprar cada circuito</p>
            <button className="btn btn--outline btn--sm" onClick={clearCart} style={{ width: '100%', marginTop: '12px' }}>
              Vaciar carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
