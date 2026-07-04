import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ReviewSection from '../../components/common/ReviewSection';
import { TIME_SLOTS } from '../../utils/constants';
import { formatPrice } from '../../utils/formatters';
import { getImageUrl, handleImageError } from '../../utils/imageHelper';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../context/CartContext';
import './Actividades.css';

const todayStr = () => {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
};

export default function ActividadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem, isInCart } = useCart();

  const [act, setAct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    api.get(`/actividades/${id}`)
      .then((res) => setAct(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!act) return <div className="page"><div className="container"><p>Actividad no encontrada</p></div></div>;

  const inCart = isInCart('ACTIVIDAD', id);
  const canBuy = user && user.role !== 'ADMIN' && user.role !== 'COMERCIAL';
  const valid = fecha && hora;

  const buildItem = () => ({
    tipo: 'ACTIVIDAD',
    id,
    titulo: act.nombre,
    ciudad: act.ciudad?.nombre,
    precio: act.precio || 0,
    imagen: act.imagen,
    fechaVisita: fecha,
    horaVisita: hora,
  });

  const handleAdd = () => {
    setTouched(true);
    if (!valid) return;
    addItem(buildItem());
  };

  const handleBuy = () => {
    setTouched(true);
    if (!valid) return;
    addItem(buildItem());
    navigate('/checkout-all');
  };

  return (
    <div className="page">
      <div className="container">
        <Link to="/actividades" style={{ fontSize: '0.85rem' }}>← Volver a actividades</Link>
        <div className="act-detail" style={{ marginTop: 'var(--space-md)' }}>
          <div className="act-detail__media">
            <img src={getImageUrl(act.imagen, act._id)} alt={act.nombre} onError={handleImageError} />
            <div style={{ marginTop: 'var(--space-md)' }}>
              <span className="act-detail__cat">{act.categoria}</span>
              <h1 style={{ margin: '4px 0' }}>{act.nombre}</h1>
              <p style={{ color: 'var(--color-text-muted)' }}>{act.ciudad?.nombre} · {act.duracionHoras}h</p>
              <div style={{ margin: '10px 0 12px', padding: '10px 12px', borderRadius: '10px', background: act.accesible === false ? 'rgba(220, 53, 69, 0.08)' : 'rgba(40, 167, 69, 0.08)', border: `1px solid ${act.accesible === false ? 'rgba(220, 53, 69, 0.25)' : 'rgba(40, 167, 69, 0.25)'}` }}>
                <strong>{act.accesible === false ? 'No accesible' : 'Accesible'}</strong>
                <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)' }}>
                  {act.accesible === false
                    ? 'Esta actividad no está marcada como accesible para personas con movilidad reducida.'
                    : 'Esta actividad está adaptada para personas con movilidad reducida.'}
                </p>
              </div>
              <p>{act.descripcion}</p>
              {act.consejos?.length > 0 && (
                <>
                  <h3 style={{ marginBottom: 4 }}>Consejos</h3>
                  <ul className="act-tips">
                    {act.consejos.map((tip, i) => <li key={i}>{tip}</li>)}
                  </ul>
                </>
              )}
            </div>
          </div>

          <aside>
            <div className="act-buy">
              <div className="act-buy__price">{act.precio > 0 ? formatPrice(act.precio) : 'Entrada gratuita'}</div>

              {canBuy ? (
                <>
                  <div className="act-buy__field">
                    <label htmlFor="fecha">Fecha de visita</label>
                    <input
                      id="fecha"
                      type="date"
                      min={todayStr()}
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                    />
                  </div>
                  <div className="act-buy__field">
                    <label>Hora de entrada</label>
                    <div className="act-slots">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          type="button"
                          key={slot}
                          className={`act-slot ${hora === slot ? 'act-slot--active' : ''}`}
                          onClick={() => setHora(slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {touched && !valid && (
                    <p style={{ color: 'var(--color-error)', fontSize: '0.8rem' }}>
                      Selecciona la fecha y la hora de tu visita.
                    </p>
                  )}

                  {inCart ? (
                    <p style={{ color: 'var(--color-success)', textAlign: 'center', fontWeight: 600 }}>✓ Ya está en tu carrito</p>
                  ) : (
                    <>
                      <button className="btn btn--secondary" style={{ width: '100%', marginBottom: 8 }} onClick={handleBuy}>
                        Comprar ahora
                      </button>
                      <button className="btn btn--outline" style={{ width: '100%' }} onClick={handleAdd}>
                        Añadir al carrito
                      </button>
                    </>
                  )}
                </>
              ) : !user ? (
                <Link to="/login" className="btn btn--primary" style={{ width: '100%' }}>Inicia sesión para comprar</Link>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                  Las cuentas {user.role === 'ADMIN' ? 'de administrador' : 'comerciales'} no pueden realizar compras
                </p>
              )}
            </div>
          </aside>
        </div>

        <ReviewSection tipo="ACTIVIDAD" referenciaId={id} />
      </div>
    </div>
  );
}
