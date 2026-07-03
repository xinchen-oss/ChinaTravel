import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import api from '../../api/axios';
import Navbar from './Navbar';
import '../../features/dashboard/Dashboard.css';

// Small red badge that alerts the admin to items pending approval.
function PendingDot({ n }) {
  if (!n) return null;
  return (
    <span
      className="admin-sidebar__pending"
      title={`${n} pendiente(s)`}
      style={{
        marginLeft: 8,
        minWidth: 18,
        height: 18,
        padding: '0 5px',
        borderRadius: 9,
        background: '#dc2626',
        color: '#fff',
        fontSize: 11,
        fontWeight: 700,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: 'middle',
        lineHeight: 1,
      }}
    >
      {n}
    </span>
  );
}

export default function AdminLayout() {
  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pending, setPending] = useState({ comercials: 0, submissions: 0, cancellations: 0, reviews: 0 });
  const location = useLocation();

  // Refresh pending counts on mount and whenever the admin navigates
  // (so a red dot disappears right after approving the last item).
  useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    api.get('/admin/pending-counts')
      .then((res) => { if (active) setPending(res.data.data); })
      .catch(() => { /* ignore — badges are best-effort */ });
    return () => { active = false; };
  }, [isAdmin, location.pathname]);

  const linkClass = ({ isActive }) =>
    `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`;

  const handleLinkClick = () => setSidebarOpen(false);

  return (
    <>
      <Navbar />
      <div className="admin-layout">
        <button
          className="admin-sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-expanded={sidebarOpen}
          aria-controls="admin-sidebar"
          aria-label={`${sidebarOpen ? 'Cerrar' : 'Abrir'} menú de administración`}
        >
          <span aria-hidden="true">{sidebarOpen ? '✕' : '☰'}</span> Menú
        </button>
        <aside id="admin-sidebar" className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`} aria-label="Navegación de administración">
          <div className="admin-sidebar__header">
            <h3>{isAdmin ? 'Admin Panel' : 'Panel Comercial'}</h3>
            <p>{user?.nombre}</p>
          </div>
          <nav className="admin-sidebar__nav">
            {isAdmin && (
              <>
                <NavLink to="/admin" end className={linkClass}>Panel principal</NavLink>
                <div className="admin-sidebar__section">Gestión</div>
                <NavLink to="/admin/usuarios" className={linkClass}>Usuarios <PendingDot n={pending.comercials} /></NavLink>
                <NavLink to="/admin/ciudades" className={linkClass}>Ciudades</NavLink>
                <NavLink to="/admin/rutas" className={linkClass}>Rutas</NavLink>
                <NavLink to="/admin/actividades" className={linkClass}>Actividades</NavLink>
                <div className="admin-sidebar__section">Ventas</div>
                <NavLink to="/admin/pedidos" className={linkClass}>Pedidos <PendingDot n={pending.cancellations} /></NavLink>
                <NavLink to="/admin/cupones" className={linkClass}>Cupones</NavLink>
                <div className="admin-sidebar__section">Moderación</div>
                <NavLink to="/admin/aprobaciones" className={linkClass}>Aprobaciones <PendingDot n={pending.submissions} /></NavLink>
                <NavLink to="/admin/resenas" className={linkClass}>Reseñas <PendingDot n={pending.reviews} /></NavLink>
              </>
            )}
            {!isAdmin && (
              <>
                <NavLink to="/comercial" end className={linkClass}>Mis solicitudes</NavLink>
                <NavLink to="/comercial/nueva-solicitud" className={linkClass}>Nueva solicitud</NavLink>
                <NavLink to="/comercial/mis-publicaciones" className={linkClass}>Mis publicaciones</NavLink>
                <NavLink to="/comercial/estadisticas-rutas" className={linkClass}>Estadísticas rutas</NavLink>
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
