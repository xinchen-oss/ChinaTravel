import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../context/CartContext';
import { ROLES } from '../../utils/constants';
import NotificationBell from '../common/NotificationBell';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count: cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-cn">中国</span> ChinaTravel
        </Link>

        <button
          className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span />
          <span />
          <span />
        </button>

        {menuOpen && <div className="navbar__overlay" onClick={() => setMenuOpen(false)} />}

        <div className={`navbar__menu ${menuOpen ? 'navbar__menu--open' : ''}`}>
          <div className="navbar__links">
            <Link to="/">Inicio</Link>
            <Link to="/ciudades">Ciudades</Link>
            <Link to="/guias">Circuitos</Link>
            <Link to="/cultura">Cultura</Link>
            <Link to="/foro">Foro</Link>
            <Link to="/sobre-nosotros">Sobre nosotros</Link>
            <Link to="/ayuda">Ayuda</Link>
          </div>

          <div className="navbar__auth">
            {(!user || user.role !== ROLES.ADMIN) && (
              <Link to="/carrito" className="navbar__cart">
                🛒{cartCount > 0 && <span className="navbar__cart-badge">{cartCount}</span>}
              </Link>
            )}
            {user ? (
              <>
                <NotificationBell />
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
      </div>
    </nav>
  );
}
