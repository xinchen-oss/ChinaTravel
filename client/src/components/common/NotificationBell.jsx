import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';
import './NotificationBell.css';

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!user) return;
    const fetch = () => {
      api.get('/notificaciones')
        .then((res) => {
          setNotifications(res.data.data.notifications);
          setUnread(res.data.data.sinLeer);
        })
        .catch(() => {});
    };
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!user) return null;

  const markAllRead = async () => {
    await api.put('/notificaciones/leer-todo');
    setUnread(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, leido: true })));
  };

  const markRead = async (id) => {
    await api.put(`/notificaciones/${id}/leer`);
    setUnread((p) => Math.max(0, p - 1));
    setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, leido: true } : n));
  };

  const iconMap = { PEDIDO: '📦', RESENA: '⭐', PROMO: '🎁', SISTEMA: '🔔', VIAJE: '✈️' };

  return (
    <div className="notif-bell" ref={ref}>
      <button
        className="notif-bell__btn"
        onClick={() => setOpen(!open)}
        aria-label={`Notificaciones${unread > 0 ? `, ${unread} sin leer` : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span aria-hidden="true">🔔</span>
        {unread > 0 && <span className="notif-bell__badge" aria-hidden="true">{unread}</span>}
      </button>

      {open && (
        <div className="notif-dropdown" role="region" aria-label="Panel de notificaciones">
          <div className="notif-dropdown__header">
            <h4>Notificaciones</h4>
            {unread > 0 && (
              <button className="notif-dropdown__mark" onClick={markAllRead}>Marcar todo leído</button>
            )}
          </div>
          <div className="notif-dropdown__list">
            {notifications.length === 0 ? (
              <p className="notif-dropdown__empty">No tienes notificaciones</p>
            ) : notifications.slice(0, 20).map((n) => (
              <div
                key={n._id}
                className={`notif-item ${!n.leido ? 'notif-item--unread' : ''}`}
                onClick={() => !n.leido && markRead(n._id)}
                onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !n.leido) { e.preventDefault(); markRead(n._id); } }}
                role={!n.leido ? 'button' : undefined}
                tabIndex={!n.leido ? 0 : undefined}
                aria-label={!n.leido ? `Marcar como leída: ${n.titulo}` : undefined}
              >
                <span className="notif-item__icon">{iconMap[n.tipo] || '🔔'}</span>
                <div className="notif-item__content">
                  <p className="notif-item__title">{n.titulo}</p>
                  <p className="notif-item__msg">{n.mensaje}</p>
                  <span className="notif-item__time">{new Date(n.createdAt).toLocaleDateString('es-ES')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
