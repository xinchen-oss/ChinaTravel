import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import CitySelector from '../../components/common/CitySelector';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ACTIVITY_CATEGORIES } from '../../utils/constants';
import { formatPrice } from '../../utils/formatters';
import { getImageUrl, handleImageError } from '../../utils/imageHelper';
import './Actividades.css';

export default function ActividadesListPage() {
  const [cityId, setCityId] = useState(null);
  const [categoria, setCategoria] = useState('');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = { dePago: true }; // ocultar entradas gratuitas en la lista pública
    if (cityId) params.ciudad = cityId;
    if (categoria) params.categoria = categoria;
    api.get('/actividades', { params })
      .then((res) => setActivities(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [cityId, categoria]);

  return (
    <>
      <section className="act-banner">
        <div className="container">
          <h1>Actividades y entradas</h1>
          <p>Compra la entrada a una atracción y elige el día y la hora de tu visita</p>
        </div>
      </section>

      <div className="page">
        <div className="container">
          <div className="act-toolbar">
            <div className="act-toolbar__filters">
              <div>
                <label>Ciudad</label>
                <CitySelector value={cityId} onChange={setCityId} />
              </div>
              <div>
                <label htmlFor="cat-filter">Categoría</label>
                <select id="cat-filter" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                  <option value="">Todas</option>
                  {ACTIVITY_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
              {loading ? '' : `${activities.length} actividad${activities.length !== 1 ? 'es' : ''}`}
            </p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : activities.length === 0 ? (
            <div className="empty-state">
              <h3>No hay actividades disponibles</h3>
              <p>Prueba con otra ciudad o categoría</p>
            </div>
          ) : (
            <div className="act-grid">
              {activities.map((act) => (
                <div key={act._id} className="act-card">
                  <div className="act-card__img">
                    <img src={getImageUrl(act.imagen, act._id)} alt={act.nombre} onError={handleImageError} />
                    {act.categoria && <span className="act-card__cat">{act.categoria}</span>}
                  </div>
                  <div className="act-card__body">
                    <span className="act-card__city">{act.ciudad?.nombre || 'China'} · {act.duracionHoras}h</span>
                    <h3 className="act-card__title">{act.nombre}</h3>
                    <p className="act-card__desc">{act.descripcion?.substring(0, 110)}...</p>
                    <div className="act-card__foot">
                      <span className="act-card__price">{formatPrice(act.precio)}</span>
                      <Link to={`/actividades/${act._id}`} className="btn btn--primary btn--sm">Ver entrada</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
