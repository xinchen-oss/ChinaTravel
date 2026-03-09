export default function AboutPage() {
  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="page-title">Sobre nosotros</h1>
        <div style={{ lineHeight: '1.8', color: 'var(--color-text-light)' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            <strong>ChinaTravel</strong> nació con una misión clara: acercar China a los viajeros españoles.
            Sabemos que planificar un viaje a China puede parecer abrumador por las diferencias culturales,
            el idioma y la inmensidad del país. Por eso hemos creado una plataforma que simplifica todo el proceso.
          </p>
          <p style={{ marginBottom: '1.5rem' }}>
            Ofrecemos guías de viaje detalladas por ciudad, con itinerarios día a día que puedes personalizar
            según tus intereses. ¿Prefieres gastronomía en lugar de compras? Simplemente intercambia las
            actividades y crea tu viaje ideal.
          </p>
          <p style={{ marginBottom: '1.5rem' }}>
            Además, nuestra sección cultural te permite sumergirte en las tradiciones, festivales,
            gastronomía e historia de China antes de tu viaje. Conocer la cultura local hará que tu
            experiencia sea mucho más rica y significativa.
          </p>
          <p>
            ¡Descubre China con nosotros y vive una experiencia que cambiará tu forma de ver el mundo!
          </p>
        </div>
      </div>
    </div>
  );
}
