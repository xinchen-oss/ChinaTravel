import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';
import { getImageUrl, handleImageError } from '../utils/imageHelper';
import './CartPage.css';

const formatVisitDate = (d) => {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch { return d; }
};

export default function CartPage() {
  const { items, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <h1 className="page-title">Mi carrito</h1>
          <div className="empty-state">
            <h3>Tu carrito está vacío</h3>
            <p>Explora nuestras <Link to="/rutas">rutas</Link> y <Link to="/actividades">actividades</Link> y añade las que más te gusten</p>
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
              <div key={`${item.tipo}:${item.id}`} className="cart-item">
                <img src={getImageUrl(item.imagen)} alt={item.titulo} className="cart-item__img" onError={handleImageError} />
                <div className="cart-item__info">
                  <h3>{item.titulo}</h3>
                  {item.tipo === 'ACTIVIDAD' ? (
                    <p>
                      <span style={{ background: 'var(--color-primary)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', marginRight: 4 }}>Entrada</span> {item.ciudad}
                      {item.fechaVisita && ` · ${formatVisitDate(item.fechaVisita)}`}
                      {item.horaVisita && ` · ${item.horaVisita}`}
                    </p>
                  ) : (
                    <p>
                      <span style={{ background: '#0ea5e9', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', marginRight: 4 }}>Ruta</span> {item.ciudad} · {item.duracionDias} días
                    </p>
                  )}
                  <span className="cart-item__price">{formatPrice(item.precio)}</span>
                </div>
                <div className="cart-item__actions">
                  <button className="btn btn--outline btn--sm" onClick={() => removeItem(item.tipo, item.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Resumen</h3>
            <div className="cart-summary__row">
              <span>{items.length} artículo{items.length > 1 ? 's' : ''}</span>
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
