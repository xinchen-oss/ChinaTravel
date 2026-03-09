import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatPrice } from '../utils/formatters';

export default function CityDetailPage() {
  const { slug } = useParams();
  const [city, setCity] = useState(null);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/ciudades/${slug}`)
      .then(async (res) => {
        setCity(res.data.data);
        const guidesRes = await api.get('/guias', { params: { ciudad: res.data.data._id } });
        setGuides(guidesRes.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner />;
  if (!city) return <div className="page"><div className="container"><p>Ciudad no encontrada</p></div></div>;

  return (
    <div className="page">
      <div className="container">
        <Link to="/ciudades" className="back-link" style={{ display: 'inline-block', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#666' }}>&larr; Todas las ciudades</Link>
        <h1 className="page-title">{city.nombre} <span style={{ color: 'var(--color-primary)' }}>{city.nombreChino}</span></h1>
        <p className="page-subtitle">{city.descripcion}</p>

        {guides.length > 0 && (
          <>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Guías de viaje en {city.nombre}</h2>
            <div className="grid grid-3">
              {guides.map((guide) => (
                <Card
                  key={guide._id}
                  to={`/guias/${guide._id}`}
                  image={guide.imagen || city.imagenPortada}
                  title={guide.titulo}
                  badge={`${guide.duracionDias} días`}
                >
                  <p className="guide-price">{formatPrice(guide.precio)}</p>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
