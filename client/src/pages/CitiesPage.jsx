import { useCities } from '../hooks/useCities';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function CitiesPage() {
  const { cities, loading } = useCities();

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Ciudades de China</h1>
        <p className="page-subtitle">Explora los destinos más fascinantes del gigante asiático</p>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-3">
            {cities.map((city) => (
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
