import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <h3><span className="footer__cn">中国</span> ChinaTravel</h3>
          <p>Descubre China, un viaje que cambiará tu vida.</p>
        </div>
        <div className="footer__links">
          <h4>Explorar</h4>
          <Link to="/ciudades">Ciudades</Link>
          <Link to="/guias">Guías de viaje</Link>
          <Link to="/cultura">Cultura china</Link>
        </div>
        <div className="footer__links">
          <h4>Información</h4>
          <Link to="/sobre-nosotros">Sobre nosotros</Link>
          <Link to="/login">Iniciar sesión</Link>
          <Link to="/registro">Crear cuenta</Link>
          <Link to="/politica-de-privacidad">Política de privacidad</Link>
        </div>
        <div className="footer__bottom">
          <p>&copy; 2026 ChinaTravel. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
