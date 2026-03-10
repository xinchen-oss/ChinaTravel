import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import Navbar from './Navbar';
import '../../features/dashboard/Dashboard.css';

export default function AdminLayout() {
  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;

  const linkClass = ({ isActive }) =>
    `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`;

  return (
    <>
      <Navbar />
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar__header">
            <h3>{isAdmin ? 'Admin Panel' : 'Panel Comercial'}</h3>
            <p>{user?.nombre}</p>
          </div>
          <nav className="admin-sidebar__nav">
            {isAdmin && (
              <>
                <NavLink to="/admin" end className={linkClass}>Panel principal</NavLink>
                <div className="admin-sidebar__section">Gestión</div>
                <NavLink to="/admin/usuarios" className={linkClass}>Usuarios</NavLink>
                <NavLink to="/admin/ciudades" className={linkClass}>Ciudades</NavLink>
                <NavLink to="/admin/guias" className={linkClass}>Guías</NavLink>
                <NavLink to="/admin/actividades" className={linkClass}>Actividades</NavLink>
                <NavLink to="/admin/cultura" className={linkClass}>Cultura</NavLink>
                <div className="admin-sidebar__section">Ventas</div>
                <NavLink to="/admin/pedidos" className={linkClass}>Pedidos</NavLink>
                <NavLink to="/admin/aprobaciones" className={linkClass}>Aprobaciones</NavLink>
              </>
            )}
            {!isAdmin && (
              <>
                <NavLink to="/comercial" end className={linkClass}>Mis solicitudes</NavLink>
                <NavLink to="/comercial/nueva-solicitud" className={linkClass}>Nueva solicitud</NavLink>
              </>
            )}
          </nav>
        </aside>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}
