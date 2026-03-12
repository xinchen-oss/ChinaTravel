import { useState, useMemo } from 'react';
import { useCities } from '../hooks/useCities';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function CitiesPage() {
  const { cities, loading } = useCities();
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showFeatured, setShowFeatured] = useState(false);

  const filtered = useMemo(() => {
    return cities.filter((city) => {
      if (selectedCity && city._id !== selectedCity) return false;
      if (showFeatured && !city.destacada) return false;
      if (search) {
        const term = search.toLowerCase();
        return (
          city.nombre.toLowerCase().includes(term) ||
          (city.nombreChino && city.nombreChino.includes(term)) ||
          (city.descripcion && city.descripcion.toLowerCase().includes(term))
        );
      }
      return true;
    });
  }, [cities, search, selectedCity, showFeatured]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCity('');
    setShowFeatured(false);
  };

  const hasFilters = search || selectedCity || showFeatured;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Ciudades de China</h1>
        <p className="page-subtitle">Explora los destinos más fascinantes del gigante asiático</p>

        {/* Filtros */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '16px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: '1 1 240px',
              padding: '10px 16px',
              border: '1px solid var(--color-border, #ddd)',
              borderRadius: 'var(--border-radius, 8px)',
              fontSize: 'var(--font-size-base, 1rem)',
            }}
          />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid var(--color-border, #ddd)',
              borderRadius: 'var(--border-radius, 8px)',
              fontSize: 'var(--font-size-base, 1rem)',
              background: '#fff',
              minWidth: '180px',
            }}
          >
            <option value="">Todas las ciudades</option>
            {cities.map((city) => (
              <option key={city._id} value={city._id}>
                {city.nombre} {city.nombreChino ? `(${city.nombreChino})` : ''}
              </option>
            ))}
          </select>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontSize: 'var(--font-size-base, 1rem)',
          }}>
            <input
              type="checkbox"
              checked={showFeatured}
              onChange={(e) => setShowFeatured(e.target.checked)}
            />
            Solo destacadas
          </label>
          {hasFilters && (
            <button
              onClick={clearFilters}
              type="button"
              style={{
                padding: '8px 16px',
                border: '1px solid var(--color-border, #ddd)',
                borderRadius: 'var(--border-radius, 8px)',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: 'var(--font-size-base, 1rem)',
                color: '#888',
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {!loading && (
          <p style={{ color: '#888', marginBottom: '16px', fontSize: '0.9rem' }}>
            {filtered.length} {filtered.length === 1 ? 'ciudad encontrada' : 'ciudades encontradas'}
          </p>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', padding: '40px 0' }}>
            No se encontraron ciudades con los filtros aplicados.
          </p>
        ) : (
          <div className="grid grid-3">
            {filtered.map((city) => (
              <Card
                key={city._id}
                to={`/ciudades/${city.slug}`}
                image={city.imagenPortada}
                title={city.nombre}
                badge={city.nombreChino}
              >
                <p className="card__subtitle">{city.descripcion?.substring(0, 150)}...</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
