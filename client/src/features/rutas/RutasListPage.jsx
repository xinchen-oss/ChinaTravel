import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useRutas } from '../../hooks/useRutas';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';
import CitySelector from '../../components/common/CitySelector';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatPrice } from '../../utils/formatters';
import { getImageUrl, handleImageError } from '../../utils/imageHelper';
import './Rutas.css';

export default function RutasListPage() {
  const [cityId, setCityId] = useState(null);
  const { rutas, loading } = useRutas(cityId);
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

  const sortedRutas = useMemo(() => {
    if (recoIds.length === 0) return rutas;
    const recoSet = new Set(recoIds);
    return [...rutas].sort((a, b) => {
      const aReco = recoSet.has(a._id);
      const bReco = recoSet.has(b._id);
      if (aReco && !bReco) return -1;
      if (!aReco && bReco) return 1;
      if (aReco && bReco) return recoIds.indexOf(a._id) - recoIds.indexOf(b._id);
      return 0;
    });
  }, [rutas, recoIds]);

  return (
    <>
      {/* Banner */}
      <section className="guides-banner">
        <div className="guides-banner__overlay" />
        <div className="container guides-banner__content">
          <h1>Rutas por China</h1>
          <p>Itinerarios con las entradas a las mejores atracciones — solo pagas las entradas</p>
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
              {loading ? '' : `${sortedRutas.length} ruta${sortedRutas.length !== 1 ? 's' : ''} disponible${sortedRutas.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : sortedRutas.length === 0 ? (
            <div className="empty-state">
              <h3>No hay rutas disponibles</h3>
              <p>Selecciona otra ciudad o vuelve más tarde</p>
            </div>
          ) : (
            <div className="guides-list">
              {sortedRutas.map((ruta) => {
                const isRecommended = recoIds.includes(ruta._id);
                return (
                <div className={`guide-list-card${isRecommended ? ' guide-list-card--recommended' : ''}`} key={ruta._id}>
                  {isRecommended && (
                    <div className="guide-list-card__reco-badge">Recomendado para ti</div>
                  )}
                  <div className="guide-list-card__content">
                    <div className="guide-list-card__image">
                      <img src={getImageUrl(ruta.imagen || ruta.ciudad?.imagenPortada, ruta._id)} alt={ruta.titulo} onError={handleImageError} />
                      <span className="guide-list-card__duration">{ruta.duracionDias} días</span>
                    </div>
                    <div className="guide-list-card__body">
                      <span className="guide-list-card__destination">{ruta.ciudad?.nombre || 'China'}</span>
                      <h3 className="guide-list-card__title">{ruta.titulo}</h3>
                      <p className="guide-list-card__desc">{ruta.descripcion?.substring(0, 200)}...</p>
                      <div className="guide-list-card__includes">
                        <span>🎫 Entradas incluidas</span>
                      </div>
                    </div>
                    <div className="guide-list-card__aside">
                      <div className="guide-list-card__price">
                        <span className="guide-list-card__price-label">Entradas desde</span>
                        <span className="guide-list-card__price-value">{formatPrice(ruta.precio)}</span>
                      </div>
                      <Link to={`/rutas/${ruta._id}`} className="btn btn--primary">Ver ruta</Link>
                      {(!user || (user.role !== 'ADMIN' && user.role !== 'COMERCIAL')) && (
                        <Link to={`/rutas/${ruta._id}/personalizar`} className="btn btn--outline btn--sm">Personalizar</Link>
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
