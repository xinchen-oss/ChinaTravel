import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-cn">中国</span> ChinaTravel
        </Link>

        <div className="navbar__links">
          <Link to="/">Inicio</Link>
          <Link to="/ciudades">Ciudades</Link>
          <Link to="/guias">Guías</Link>
          <Link to="/cultura">Cultura</Link>
          <Link to="/foro">Foro</Link>
          <Link to="/sobre-nosotros">Sobre nosotros</Link>
        </div>

        <div className="navbar__auth">
          {user ? (
            <>
              {user.role === ROLES.ADMIN && (
                <Link to="/admin" className="navbar__role-link">Admin</Link>
              )}
              {user.role === ROLES.COMERCIAL && (
                <Link to="/comercial" className="navbar__role-link">Comercial</Link>
              )}
              <Link to="/dashboard">Mi cuenta</Link>
              <button onClick={handleLogout} className="navbar__logout">Salir</button>
            </>
          ) : (
            <>
              <Link to="/login">Iniciar sesión</Link>
              <Link to="/registro" className="btn btn--primary btn--sm">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
