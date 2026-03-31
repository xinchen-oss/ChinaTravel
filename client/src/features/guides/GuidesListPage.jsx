import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGuides } from '../../hooks/useGuides';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';
import CitySelector from '../../components/common/CitySelector';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatPrice } from '../../utils/formatters';
import { getImageUrl, handleImageError } from '../../utils/imageHelper';
import './Guides.css';

export default function GuidesListPage() {
  const [cityId, setCityId] = useState(null);
  const { guides, loading } = useGuides(cityId);
  const { user } = useAuth();
  const [recoIds, setRecoIds] = useState([]);

  useEffect(() => {
    if (!user) return;
    api.get('/pedidos/recomendaciones')
      .then((res) => {
        const ids = res.data.data.map((g) => g._id);
        setRecoIds(ids);
      })
      .catch(() => {});
  }, [user]);

  const sortedGuides = useMemo(() => {
    if (recoIds.length === 0) return guides;
    const recoSet = new Set(recoIds);
    return [...guides].sort((a, b) => {
      const aReco = recoSet.has(a._id);
      const bReco = recoSet.has(b._id);
      if (aReco && !bReco) return -1;
      if (!aReco && bReco) return 1;
      if (aReco && bReco) return recoIds.indexOf(a._id) - recoIds.indexOf(b._id);
      return 0;
    });
  }, [guides, recoIds]);

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
              {loading ? '' : `${sortedGuides.length} circuito${sortedGuides.length !== 1 ? 's' : ''} disponible${sortedGuides.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : sortedGuides.length === 0 ? (
            <div className="empty-state">
              <h3>No hay circuitos disponibles</h3>
              <p>Selecciona otra ciudad o vuelve más tarde</p>
            </div>
          ) : (
            <div className="guides-list">
              {sortedGuides.map((guide) => {
                const isRecommended = recoIds.includes(guide._id);
                return (
                <div className={`guide-list-card${isRecommended ? ' guide-list-card--recommended' : ''}`} key={guide._id}>
                  {isRecommended && (
                    <div className="guide-list-card__reco-badge">Recomendado para ti</div>
                  )}
                  <div className="guide-list-card__content">
                    <div className="guide-list-card__image">
                      <img src={getImageUrl(guide.imagen || guide.ciudad?.imagenPortada, guide._id)} alt={guide.titulo} onError={handleImageError} />
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
                      {(!user || (user.role !== 'ADMIN' && user.role !== 'COMERCIAL')) && (
                        <Link to={`/guias/${guide._id}/personalizar`} className="btn btn--outline btn--sm">Personalizar</Link>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
