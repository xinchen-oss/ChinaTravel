import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatPrice, formatDate } from '../../utils/formatters';
import './Dashboard.css';

export default function UserDashboard() {
  const { user, updateProfile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Profile form
  const [profileData, setProfileData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    currentPassword: '',
    password: '',
  });
  const [profileMsg, setProfileMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/pedidos/mis-pedidos')
      .then((res) => setOrders(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({ ...prev, nombre: user.nombre, email: user.email }));
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setProfileMsg('');
    setProfileError('');
    try {
      const data = { nombre: profileData.nombre, email: profileData.email };
      if (profileData.password) {
        data.password = profileData.password;
        data.currentPassword = profileData.currentPassword;
      }
      await updateProfile(data);
      setProfileMsg('Perfil actualizado correctamente');
      setProfileData((prev) => ({ ...prev, currentPassword: '', password: '' }));
    } catch (err) {
      setProfileError(err.response?.data?.error || 'Error al actualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  const toggleOrder = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const getItinerary = (order) => {
    if (order.guiaPersonalizada?.length) return order.guiaPersonalizada;
    return order.guia?.dias || [];
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Mi cuenta</h1>
        <p className="page-subtitle">Hola, {user?.nombre}</p>

        <div className="dashboard-tabs">
          <button
            className={`dashboard-tab ${activeTab === 'orders' ? 'dashboard-tab--active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Mis pedidos
          </button>
          <button
            className={`dashboard-tab ${activeTab === 'profile' ? 'dashboard-tab--active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Mi perfil
          </button>
        </div>

        {activeTab === 'orders' && (
          <>
            {loading ? (
              <LoadingSpinner />
            ) : orders.length === 0 ? (
              <div className="empty-state">
                <h3>No tienes pedidos aún</h3>
                <p>Explora nuestras <Link to="/guias">guías de viaje</Link> para comenzar</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => {
                  const itinerary = getItinerary(order);
                  const isExpanded = expandedOrder === order._id;
                  return (
                    <div key={order._id} className="order-card-full">
                      <div className="order-card" onClick={() => toggleOrder(order._id)} style={{ cursor: 'pointer' }}>
                        <div className="order-card__info">
                          <h3>{order.guia?.titulo || 'Guía'}</h3>
                          <p>{formatDate(order.createdAt)} | {order.guia?.duracionDias || '—'} días | {order.guia?.ciudad?.nombre || ''}</p>
                          <span className={`badge badge--${order.estado === 'CONFIRMADO' ? 'success' : 'warning'}`}>
                            {order.estado}
                          </span>
                        </div>
                        <div className="order-card__actions">
                          <span className="order-card__price">{formatPrice(order.precioTotal)}</span>
                          {order.tipsPdfUrl && (
                            <a href={order.tipsPdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn--primary btn--sm" onClick={(e) => e.stopPropagation()}>
                              PDF Tips
                            </a>
                          )}
                          <span className="order-card__toggle">{isExpanded ? '▲' : '▼'}</span>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="order-itinerary">
                          <h4 className="order-itinerary__title">Itinerario y horarios</h4>
                          {order.hotel && (
                            <div className="order-extras">
                              <span>Hotel: {order.hotel.nombre} {'★'.repeat(order.hotel.estrellas)}</span>
                            </div>
                          )}
                          {order.vuelo && (
                            <div className="order-extras">
                              <span>Vuelo: {order.vuelo.aerolinea} ({order.vuelo.origen} → {order.vuelo.destino})</span>
                            </div>
                          )}
                          {itinerary.length > 0 ? (
                            itinerary.map((dia) => (
                              <div key={dia.numeroDia} className="itinerary-day">
                                <div className="itinerary-day__header">
                                  <span className="itinerary-day__number">Día {dia.numeroDia}</span>
                                  <span className="itinerary-day__title">{dia.titulo}</span>
                                </div>
                                <div className="itinerary-day__activities">
                                  {dia.actividades?.map((slot, i) => (
                                    <div key={i} className="itinerary-slot">
                                      <div className="itinerary-slot__time">
                                        {slot.horaInicio ? `${slot.horaInicio} - ${slot.horaFin}` : '—'}
                                      </div>
                                      <div className="itinerary-slot__info">
                                        <strong>{slot.actividad?.nombre || 'Actividad'}</strong>
                                        {slot.actividad?.categoria && (
                                          <span className="itinerary-slot__category">{slot.actividad.categoria}</span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted">No hay itinerario disponible</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'profile' && (
          <div className="profile-section">
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <h2>Editar perfil</h2>
              {profileMsg && <div className="profile-success">{profileMsg}</div>}
              {profileError && <div className="auth-error">{profileError}</div>}

              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  value={profileData.nombre}
                  onChange={(e) => setProfileData({ ...profileData, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  required
                />
              </div>
              <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
              <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>Cambiar contraseña (opcional)</h3>
              <div className="form-group">
                <label>Contraseña actual</label>
                <input
                  type="password"
                  value={profileData.currentPassword}
                  onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Nueva contraseña</label>
                <input
                  type="password"
                  value={profileData.password}
                  onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                  minLength={6}
                />
              </div>
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
