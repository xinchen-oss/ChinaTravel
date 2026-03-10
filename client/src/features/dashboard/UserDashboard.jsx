import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatPrice, formatDate } from '../../utils/formatters';
import './Dashboard.css';

const PAISES = [
  'España', 'México', 'Argentina', 'Colombia', 'Chile', 'Perú', 'Venezuela',
  'Ecuador', 'Guatemala', 'Cuba', 'Bolivia', 'Rep. Dominicana', 'Honduras',
  'Paraguay', 'El Salvador', 'Nicaragua', 'Costa Rica', 'Panamá', 'Uruguay',
  'Puerto Rico', 'China', 'Estados Unidos', 'Francia', 'Alemania', 'Italia',
  'Portugal', 'Reino Unido', 'Japón', 'Corea del Sur', 'Otro',
];

export default function UserDashboard() {
  const { user, updateProfile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Profile form
  const [profileData, setProfileData] = useState({
    nombre: '', apellidos: '', email: '', telefono: '',
    fechaNacimiento: '', genero: '', nacionalidad: '', pasaporte: '',
    direccion: { calle: '', ciudad: '', codigoPostal: '', pais: '' },
    currentPassword: '', password: '',
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
      setProfileData((prev) => ({
        ...prev,
        nombre: user.nombre || '',
        apellidos: user.apellidos || '',
        email: user.email || '',
        telefono: user.telefono || '',
        fechaNacimiento: user.fechaNacimiento ? user.fechaNacimiento.substring(0, 10) : '',
        genero: user.genero || '',
        nacionalidad: user.nacionalidad || '',
        pasaporte: user.pasaporte || '',
        direccion: {
          calle: user.direccion?.calle || '',
          ciudad: user.direccion?.ciudad || '',
          codigoPostal: user.direccion?.codigoPostal || '',
          pais: user.direccion?.pais || '',
        },
      }));
    }
  }, [user]);

  const set = (field) => (e) => setProfileData({ ...profileData, [field]: e.target.value });
  const setDir = (field) => (e) => setProfileData({
    ...profileData,
    direccion: { ...profileData.direccion, [field]: e.target.value },
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setProfileMsg('');
    setProfileError('');
    try {
      const { currentPassword, password, ...rest } = profileData;
      const data = { ...rest };
      if (password) {
        data.password = password;
        data.currentPassword = currentPassword;
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
        <p className="page-subtitle">Hola, {user?.nombre} {user?.apellidos}</p>

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
            <form onSubmit={handleProfileSubmit} className="profile-form profile-form--wide">
              <h2>Datos personales</h2>
              {profileMsg && <div className="profile-success">{profileMsg}</div>}
              {profileError && <div className="auth-error">{profileError}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label>Nombre</label>
                  <input type="text" value={profileData.nombre} onChange={set('nombre')} required />
                </div>
                <div className="form-group">
                  <label>Apellidos</label>
                  <input type="text" value={profileData.apellidos} onChange={set('apellidos')} />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" value={profileData.email} onChange={set('email')} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Teléfono</label>
                  <input type="tel" value={profileData.telefono} onChange={set('telefono')} placeholder="+34 600 000 000" />
                </div>
                <div className="form-group">
                  <label>Fecha de nacimiento</label>
                  <input type="date" value={profileData.fechaNacimiento} onChange={set('fechaNacimiento')} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Género</label>
                  <select value={profileData.genero} onChange={set('genero')}>
                    <option value="">Prefiero no decir</option>
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMENINO">Femenino</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Nacionalidad</label>
                  <select value={profileData.nacionalidad} onChange={set('nacionalidad')}>
                    <option value="">Seleccionar</option>
                    {PAISES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>N° Pasaporte / DNI</label>
                <input type="text" value={profileData.pasaporte} onChange={set('pasaporte')} placeholder="Número de documento" />
              </div>

              <h3 className="profile-form__section-title">Dirección</h3>
              <div className="form-group">
                <label>Calle y número</label>
                <input type="text" value={profileData.direccion.calle} onChange={setDir('calle')} placeholder="Calle, número, piso" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ciudad</label>
                  <input type="text" value={profileData.direccion.ciudad} onChange={setDir('ciudad')} />
                </div>
                <div className="form-group">
                  <label>Código postal</label>
                  <input type="text" value={profileData.direccion.codigoPostal} onChange={setDir('codigoPostal')} />
                </div>
              </div>
              <div className="form-group">
                <label>País</label>
                <select value={profileData.direccion.pais} onChange={setDir('pais')}>
                  <option value="">Seleccionar</option>
                  {PAISES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <h3 className="profile-form__section-title">Cambiar contraseña</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Contraseña actual</label>
                  <input type="password" value={profileData.currentPassword} onChange={set('currentPassword')} />
                </div>
                <div className="form-group">
                  <label>Nueva contraseña</label>
                  <input type="password" value={profileData.password} onChange={set('password')} minLength={6} />
                </div>
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
