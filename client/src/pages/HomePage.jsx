import { useState, useEffect, useCallback } from 'react';
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
    link: '/guias',
    linkText: 'Ver circuitos',
  },
  {
    image: 'https://images.unsplash.com/photo-1537531383496-f4749b8032cf?w=1600&q=80',
    title: 'Shanghái: luces y modernidad',
    subtitle: 'El skyline más impresionante de Asia te espera',
    link: '/ciudades/shanghai',
    linkText: 'Explorar Shanghái',
  },
  {
    image: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=1600&q=80',
    title: 'Templos milenarios',
    subtitle: 'Sumérgete en la espiritualidad y la historia de China',
    link: '/cultura',
    linkText: 'Cultura china',
  },
  {
    image: 'https://images.unsplash.com/photo-1529921879218-f99546d03a34?w=1600&q=80',
    title: 'Guilin y sus montañas kársticas',
    subtitle: 'Paisajes de ensueño que parecen sacados de una pintura',
    link: '/ciudades/guilin',
    linkText: 'Descubrir Guilin',
  },
  {
    image: 'https://images.unsplash.com/photo-1564577160324-112d603f750f?w=1600&q=80',
    title: 'Chengdú: tierra de pandas',
    subtitle: 'Conoce a los pandas gigantes y saborea el auténtico hotpot',
    link: '/ciudades/chengdu',
    linkText: 'Ir a Chengdú',
  },
  {
    image: 'https://images.unsplash.com/photo-1513415564515-763d91423bdd?w=1600&q=80',
    title: 'La Ruta de la Seda',
    subtitle: 'Desiertos, oasis y ciudades legendarias te esperan',
    link: '/guias',
    linkText: 'Ver rutas',
  },
  {
    image: 'https://images.unsplash.com/photo-1591122947157-26bad3a117d2?w=1600&q=80',
    title: "Guerreros de Terracota de Xi'an",
    subtitle: 'Un ejército de 8.000 guerreros enterrado durante 2.000 años',
    link: '/ciudades/xian',
    linkText: "Explorar Xi'an",
  },
  {
    image: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=1600&q=80',
    title: 'Harbin: festival de hielo',
    subtitle: 'Esculturas gigantes de hielo iluminadas bajo -30°C',
    link: '/ciudades/harbin',
    linkText: 'Ver Harbin',
  },
];

// Representative cities to feature on homepage (by slug)
const FEATURED_SLUGS = ['pekin', 'shanghai', 'chengdu', 'xian', 'guilin', 'hangzhou'];

export default function HomePage() {
  const { cities, loading: citiesLoading } = useCities(true);
  const { guides, loading: guidesLoading } = useGuides(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToSlide = useCallback((dir) => {
    setCurrentSlide((prev) => (prev + dir + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => goToSlide(1), 5000);
    return () => clearInterval(timer);
  }, [goToSlide]);

  // Filter to show only representative cities
  const featuredCities = FEATURED_SLUGS.length
    ? FEATURED_SLUGS.map((slug) => cities.find((c) => c.slug === slug)).filter(Boolean)
    : cities.slice(0, 6);

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
        <button className="hero__arrow hero__arrow--left" onClick={() => goToSlide(-1)} aria-label="Anterior">&#10094;</button>
        <button className="hero__arrow hero__arrow--right" onClick={() => goToSlide(1)} aria-label="Siguiente">&#10095;</button>
        <div className="container hero__content" key={currentSlide}>
          <h1 className="hero__title">{heroSlides[currentSlide].title}</h1>
          <p className="hero__subtitle">{heroSlides[currentSlide].subtitle}</p>
          <div className="hero__actions">
            <Link to={heroSlides[currentSlide].link} className="btn btn--primary btn--lg">{heroSlides[currentSlide].linkText}</Link>
            <Link to="/guias" className="btn btn--outline-light btn--lg">Todos los circuitos</Link>
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
                    <img src={getImageUrl(guide.imagen || guide.ciudad?.imagenPortada, guide._id)} alt={guide.titulo} onError={handleImageError} />
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
              {featuredCities.map((city) => (
                <Link to={`/ciudades/${city.slug}`} className="city-card" key={city._id}>
                  <div className="city-card__image">
                    <img src={getImageUrl(city.imagenPortada, city._id)} alt={city.nombre} onError={handleImageError} />
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
