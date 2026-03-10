import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCities } from '../hooks/useCities';
import { useGuides } from '../hooks/useGuides';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatPrice } from '../utils/formatters';
import { getImageUrl, handleImageError } from '../utils/imageHelper';
import './HomePage.css';

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1600&q=80',
    title: 'Descubre la Gran Muralla',
    subtitle: 'Una maravilla del mundo que te dejará sin aliento',
  },
  {
    image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=1600&q=80',
    title: 'Explora Shanghái',
    subtitle: 'La ciudad donde el futuro se encuentra con la tradición',
  },
  {
    image: 'https://images.unsplash.com/photo-1529921879218-f99546d03a27?w=1600&q=80',
    title: 'Templos de Pekín',
    subtitle: 'Sumérgete en la cultura milenaria china',
  },
];

export default function HomePage() {
  const { cities, loading: citiesLoading } = useCities(true);
  const { guides, loading: guidesLoading } = useGuides(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Hero Carousel */}
      <section className="hero">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`hero__slide ${i === currentSlide ? 'hero__slide--active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}
        <div className="hero__overlay" />
        <div className="container hero__content">
          <h1 className="hero__title">{heroSlides[currentSlide].title}</h1>
          <p className="hero__subtitle">{heroSlides[currentSlide].subtitle}</p>
          <div className="hero__actions">
            <Link to="/guias" className="btn btn--primary btn--lg">Ver circuitos</Link>
            <Link to="/cultura" className="btn btn--outline-light btn--lg">Cultura china</Link>
          </div>
        </div>
        <div className="hero__dots">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              className={`hero__dot ${i === currentSlide ? 'hero__dot--active' : ''}`}
              onClick={() => setCurrentSlide(i)}
            />
          ))}
        </div>
      </section>

      {/* Ventajas */}
      <section className="advantages">
        <div className="container">
          <div className="advantages__grid">
            <div className="advantage">
              <div className="advantage__icon">🏨</div>
              <div>
                <h4>Alojamiento incluido</h4>
                <p>Hoteles seleccionados de 4 y 5 estrellas</p>
              </div>
            </div>
            <div className="advantage">
              <div className="advantage__icon">🍜</div>
              <div>
                <h4>Comidas incluidas</h4>
                <p>Gastronomía auténtica china y opciones locales</p>
              </div>
            </div>
            <div className="advantage">
              <div className="advantage__icon">🧑‍🏫</div>
              <div>
                <h4>Guía en español</h4>
                <p>Guías profesionales de habla hispana</p>
              </div>
            </div>
            <div className="advantage">
              <div className="advantage__icon">🛡️</div>
              <div>
                <h4>Seguro de viaje</h4>
                <p>Cobertura completa durante todo el viaje</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Circuitos destacados */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Circuitos por China</h2>
            <p className="section__subtitle">Los mejores itinerarios diseñados para viajeros españoles</p>
          </div>

          {guidesLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="guides-grid">
              {guides.slice(0, 6).map((guide) => (
                <Link to={`/guias/${guide._id}`} className="guide-card" key={guide._id}>
                  <div className="guide-card__image">
                    <img src={getImageUrl(guide.imagen || guide.ciudad?.imagenPortada)} alt={guide.titulo} onError={handleImageError} />
                    <span className="guide-card__duration">{guide.duracionDias} días</span>
                  </div>
                  <div className="guide-card__body">
                    <span className="guide-card__destination">{guide.ciudad?.nombre || 'China'}</span>
                    <h3 className="guide-card__title">{guide.titulo}</h3>
                    <p className="guide-card__highlights">
                      {guide.descripcion?.substring(0, 100)}...
                    </p>
                    <div className="guide-card__footer">
                      <span className="guide-card__price">Desde {formatPrice(guide.precio)}</span>
                      <span className="guide-card__cta">Ver más →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="section__action">
            <Link to="/guias" className="btn btn--primary btn--lg">Ver todos los circuitos</Link>
          </div>
        </div>
      </section>

      {/* Ciudades destacadas */}
      <section className="section section--alt">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Destinos populares</h2>
            <p className="section__subtitle">Los destinos más fascinantes de China esperan por ti</p>
          </div>

          {citiesLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="cities-grid">
              {cities.map((city) => (
                <Link to={`/ciudades/${city.slug}`} className="city-card" key={city._id}>
                  <div className="city-card__image">
                    <img src={getImageUrl(city.imagenPortada)} alt={city.nombre} onError={handleImageError} />
                    <div className="city-card__overlay" />
                    <div className="city-card__info">
                      <span className="city-card__chinese">{city.nombreChino}</span>
                      <h3>{city.nombre}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="section__action">
            <Link to="/ciudades" className="btn btn--outline">Ver todas las ciudades</Link>
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="section why-us">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">¿Por qué viajar con ChinaTravel?</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-card__icon">🗺️</div>
              <h3>Guías personalizables</h3>
              <p>Adapta tu itinerario cambiando actividades según tus preferencias y ritmo de viaje</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">📋</div>
              <h3>Tips de viaje en PDF</h3>
              <p>Recibe consejos prácticos, mapas y recomendaciones para cada actividad</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">🏯</div>
              <h3>Cultura auténtica</h3>
              <p>Artículos sobre festivales, gastronomía, tradiciones y experiencias únicas</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">💬</div>
              <h3>Atención en español</h3>
              <p>Todo el soporte y documentación en tu idioma, sin barreras</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="cta-section">
        <div className="container cta-section__inner">
          <h2>¿Listo para descubrir China?</h2>
          <p>Empieza a planificar tu viaje hoy mismo</p>
          <div className="hero__actions">
            <Link to="/registro" className="btn btn--primary btn--lg">Crear cuenta gratis</Link>
            <Link to="/guias" className="btn btn--outline-light btn--lg">Explorar circuitos</Link>
          </div>
        </div>
      </section>
    </>
  );
}
