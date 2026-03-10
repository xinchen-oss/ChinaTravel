import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGuides } from '../../hooks/useGuides';
import CitySelector from '../../components/common/CitySelector';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatPrice } from '../../utils/formatters';
import { getImageUrl, handleImageError } from '../../utils/imageHelper';
import './Guides.css';

export default function GuidesListPage() {
  const [cityId, setCityId] = useState(null);
  const { guides, loading } = useGuides(cityId);

  return (
    <>
      {/* Banner */}
      <section className="guides-banner">
        <div className="guides-banner__overlay" />
        <div className="container guides-banner__content">
          <h1>Circuitos por China</h1>
          <p>Itinerarios completos con alojamiento, comidas, guía y seguro incluidos</p>
        </div>
      </section>

      <div className="page">
        <div className="container">
          <div className="guides-toolbar">
            <div className="guides-toolbar__filter">
              <label>Filtrar por ciudad:</label>
              <CitySelector value={cityId} onChange={setCityId} />
            </div>
            <p className="guides-toolbar__count">
              {loading ? '' : `${guides.length} circuito${guides.length !== 1 ? 's' : ''} disponible${guides.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : guides.length === 0 ? (
            <div className="empty-state">
              <h3>No hay circuitos disponibles</h3>
              <p>Selecciona otra ciudad o vuelve más tarde</p>
            </div>
          ) : (
            <div className="guides-list">
              {guides.map((guide) => (
                <div className="guide-list-card" key={guide._id}>
                  <div className="guide-list-card__image">
                    <img src={getImageUrl(guide.imagen || guide.ciudad?.imagenPortada)} alt={guide.titulo} onError={handleImageError} />
                    <span className="guide-list-card__duration">{guide.duracionDias} días</span>
                  </div>
                  <div className="guide-list-card__body">
                    <span className="guide-list-card__destination">{guide.ciudad?.nombre || 'China'}</span>
                    <h3 className="guide-list-card__title">{guide.titulo}</h3>
                    <p className="guide-list-card__desc">{guide.descripcion?.substring(0, 200)}...</p>
                    <div className="guide-list-card__includes">
                      <span>🏨 Alojamiento</span>
                      <span>🍜 Comidas</span>
                      <span>🧑‍🏫 Guía</span>
                      <span>🛡️ Seguro</span>
                    </div>
                  </div>
                  <div className="guide-list-card__aside">
                    <div className="guide-list-card__price">
                      <span className="guide-list-card__price-label">Desde</span>
                      <span className="guide-list-card__price-value">{formatPrice(guide.precio)}</span>
                    </div>
                    <Link to={`/guias/${guide._id}`} className="btn btn--primary">Ver circuito</Link>
                    <Link to={`/guias/${guide._id}/personalizar`} className="btn btn--outline btn--sm">Personalizar</Link>
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
