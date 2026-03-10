import { useState } from 'react';
import { useCulture } from '../../hooks/useCulture';
import CitySelector from '../../components/common/CitySelector';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CULTURE_CATEGORIES } from '../../utils/constants';
import { getCultureImageUrl } from '../../utils/imageHelper';
import './Culture.css';

export default function CulturePage() {
  const [cityId, setCityId] = useState(null);
  const [categoria, setCategoria] = useState('');
  const { articles, loading } = useCulture({ ciudad: cityId, categoria });

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Cultura china</h1>
        <p className="page-subtitle">Sumérgete en la rica cultura milenaria de China</p>

        <div className="culture-filters">
          <CitySelector value={cityId} onChange={setCityId} />
          <div className="form-group">
            <label className="city-selector__label">Categoría</label>
            <select
              className="city-selector__select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Todas</option>
              {CULTURE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : articles.length === 0 ? (
          <div className="empty-state">
            <h3>No hay artículos disponibles</h3>
            <p>Prueba con otros filtros</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {articles.map((article, index) => (
              <Card
                key={article._id}
                to={`/cultura/${article._id}`}
                image={getCultureImageUrl(article.imagen, article.categoria, index)}
                title={article.titulo}
                badge={article.categoria}
              >
                <p className="card__subtitle">{article.resumen}</p>
                {article.ciudad && <span className="culture-city">{article.ciudad.nombre}</span>}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
