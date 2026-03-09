import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page">
      <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <h1 style={{ fontSize: '6rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>404</h1>
        <h2 style={{ marginBottom: '1rem' }}>Página no encontrada</h2>
        <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem' }}>
          La página que buscas no existe o ha sido movida.
        </p>
        <Link to="/" className="btn btn--primary">Volver al inicio</Link>
      </div>
    </div>
  );
}
