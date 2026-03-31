import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatPrice, formatDate } from '../../utils/formatters';
import './Dashboard.css';

// Validation helpers
const ONLY_LETTERS = /^[A-Za-zÀ-ÿñÑ\s'-]+$/;
const SPANISH_PHONE = /^[679]\d{8}$/;
const SPANISH_CP = /^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/;
const NIE_REGEX = /^[XYZ]\d{7}[A-Z]$/i;
const PASSPORT_REGEX = /^[A-Z]{3}\d{6}$/i;

const validateNIE = (v) => NIE_REGEX.test(v);
const validatePassport = (v) => PASSPORT_REGEX.test(v);

const validateBirthDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Fecha inválida';
  const now = new Date();
  if (d > now) return 'La fecha no puede ser futura';
  const age = now.getFullYear() - d.getFullYear();
  if (age > 120) return 'Fecha no válida';
  if (age < 16) return 'Debes tener al menos 16 años';
  return '';
};

export default function UserDashboard() {
  const { user, updateProfile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(user?.role === ROLES.USER ? 'orders' : 'profile');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelModal, setCancelModal] = useState({ open: false, orderId: null, motivo: '', selectedReason: '' });
  const [cancelResult, setCancelResult] = useState({ open: false, success: false, reembolso: false, mensaje: '' });

  // Profile form
  const [profileData, setProfileData] = useState({
    nombre: '', apellidos: '', email: '', telefono: '',
    fechaNacimiento: '', genero: '', tipoDocumento: 'NIE', pasaporte: '',
    direccion: { calle: '', ciudad: '', codigoPostal: '', pais: 'España' },
    currentPassword: '', password: '',
  });
  const [profileMsg, setProfileMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [emailChangeMode, setEmailChangeMode] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (user?.role !== ROLES.USER) {
      setLoading(false);
      return;
    }
    api.get('/pedidos/mis-pedidos')
      .then((res) => setOrders(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (user) {
      const doc = user.pasaporte || '';
      const isNIE = NIE_REGEX.test(doc);
      setProfileData((prev) => ({
        ...prev,
        nombre: user.nombre || '',
        apellidos: user.apellidos || '',
        email: user.email || '',
        telefono: user.telefono ? user.telefono.replace(/^\+34\s?/, '') : '',
        fechaNacimiento: user.fechaNacimiento ? user.fechaNacimiento.substring(0, 10) : '',
        genero: user.genero || '',
        tipoDocumento: isNIE || !doc ? 'NIE' : 'PASAPORTE',
        pasaporte: doc,
        direccion: {
          calle: user.direccion?.calle || '',
          ciudad: user.direccion?.ciudad || '',
          codigoPostal: user.direccion?.codigoPostal || '',
          pais: 'España',
        },
      }));
    }
  }, [user]);

  const set = (field) => (e) => setProfileData({ ...profileData, [field]: e.target.value });
  const setDir = (field) => (e) => setProfileData({
    ...profileData,
    direccion: { ...profileData.direccion, [field]: e.target.value },
  });

  const validateProfile = () => {
    const errs = {};
    if (!profileData.nombre.trim()) errs.nombre = 'Obligatorio';
    else if (!ONLY_LETTERS.test(profileData.nombre)) errs.nombre = 'Solo letras';
    if (profileData.apellidos && !ONLY_LETTERS.test(profileData.apellidos)) errs.apellidos = 'Solo letras';
    if (profileData.telefono && !SPANISH_PHONE.test(profileData.telefono.replace(/\s/g, ''))) errs.telefono = 'Formato: 6XX XXX XXX / 7XX XXX XXX / 9XX XXX XXX';
    if (profileData.fechaNacimiento) {
      const bdErr = validateBirthDate(profileData.fechaNacimiento);
      if (bdErr) errs.fechaNacimiento = bdErr;
    }
    if (profileData.pasaporte) {
      if (profileData.tipoDocumento === 'NIE' && !validateNIE(profileData.pasaporte)) errs.pasaporte = 'Formato NIE: X/Y/Z + 7 dígitos + letra (ej: X1234567A)';
      if (profileData.tipoDocumento === 'PASAPORTE' && !validatePassport(profileData.pasaporte)) errs.pasaporte = 'Formato pasaporte: 3 letras + 6 dígitos (ej: PAA123456)';
    }
    if (profileData.direccion.codigoPostal && !SPANISH_CP.test(profileData.direccion.codigoPostal)) errs.codigoPostal = 'Código postal español: 01000-52999';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleEmailChange = async () => {
    if (!newEmail || newEmail === profileData.email) return;
    try {
      await api.post('/auth/solicitar-cambio-email', { nuevoEmail: newEmail });
      setEmailSent(true);
    } catch (err) {
      setProfileError(err.response?.data?.error || 'Error al solicitar cambio de email');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileError('');
    if (!validateProfile()) return;
    setSaving(true);
    try {
      const { currentPassword, password, tipoDocumento, email, ...rest } = profileData;
      const data = { ...rest, telefono: rest.telefono ? `+34 ${rest.telefono.replace(/\s/g, '')}` : '' };
      data.direccion = { ...data.direccion, pais: 'España' };
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

  const cancelReasons = [
    'He cambiado de planes de viaje',
    'He encontrado una opción mejor',
    'Problemas económicos',
    'El viaje ya no es posible por motivos personales',
    'Otro motivo',
  ];

  const openCancelModal = (orderId) => {
    setCancelModal({ open: true, orderId, motivo: '', selectedReason: '' });
  };

  const closeCancelModal = () => {
    setCancelModal({ open: false, orderId: null, motivo: '', selectedReason: '' });
  };

  const handleCancelSubmit = async () => {
    const motivo = cancelModal.selectedReason === 'Otro motivo'
      ? cancelModal.motivo
      : cancelModal.selectedReason;
    if (!motivo) return;
    const orderId = cancelModal.orderId;
    closeCancelModal();
    setCancellingId(orderId);
    try {
      const res = await api.put(`/pedidos/${orderId}/cancelar`, { motivo });
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, estado: res.data.data.estado } : o));
      setCancelResult({ open: true, success: true, reembolso: false, pendiente: true, mensaje: res.data.mensaje });
    } catch (err) {
      setCancelResult({ open: true, success: false, reembolso: false, mensaje: err.response?.data?.error || 'Error al cancelar' });
    } finally {
      setCancellingId(null);
    }
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

        <div className="dashboard-tabs" role="tablist" aria-label="Secciones de mi cuenta">
          {user?.role === ROLES.USER && (
            <button
              className={`dashboard-tab ${activeTab === 'orders' ? 'dashboard-tab--active' : ''}`}
              onClick={() => setActiveTab('orders')}
              role="tab"
              aria-selected={activeTab === 'orders'}
              aria-controls="tabpanel-orders"
              id="tab-orders"
            >
              Mis pedidos
            </button>
          )}
          <button
            className={`dashboard-tab ${activeTab === 'profile' ? 'dashboard-tab--active' : ''}`}
            onClick={() => setActiveTab('profile')}
            role="tab"
            aria-selected={activeTab === 'profile'}
            aria-controls="tabpanel-profile"
            id="tab-profile"
          >
            Mi perfil
          </button>
        </div>

        {activeTab === 'orders' && (
          <div role="tabpanel" id="tabpanel-orders" aria-labelledby="tab-orders">
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
                      <div className="order-card" onClick={() => toggleOrder(order._id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleOrder(order._id); } }} style={{ cursor: 'pointer' }} role="button" tabIndex={0} aria-expanded={isExpanded} aria-label={`Pedido: ${order.guia?.titulo || 'Guía'}`}>
                        <div className="order-card__info">
                          <h3>{order.guia?.titulo || 'Guía'}</h3>
                          <p>{formatDate(order.createdAt)} | {order.guia?.duracionDias || '—'} días | {order.guia?.ciudad?.nombre || ''}</p>
                          <span className={`badge badge--${order.estado === 'CONFIRMADO' ? 'success' : order.estado === 'REEMBOLSADO' ? 'info' : 'warning'}`}>
                            {order.estado === 'PENDIENTE_CANCELACION' ? 'Cancelación pendiente' : order.estado}
                          </span>
                        </div>
                        <div className="order-card__actions">
                          <span className="order-card__price">{formatPrice(order.precioTotal)}</span>
                          {order.tipsPdfUrl && (
                            <a href={order.tipsPdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn--primary btn--sm" onClick={(e) => e.stopPropagation()}>
                              PDF Tips
                            </a>
                          )}
                          {order.estado === 'CONFIRMADO' && (
                            <button
                              className="btn btn--outline btn--sm"
                              onClick={(e) => { e.stopPropagation(); openCancelModal(order._id); }}
                              disabled={cancellingId === order._id}
                            >
                              {cancellingId === order._id ? '...' : 'Cancelar'}
                            </button>
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
          </div>
        )}

        {activeTab === 'profile' && (<div role="tabpanel" id="tabpanel-profile" aria-labelledby="tab-profile">
          <div className="profile-section">
            <form onSubmit={handleProfileSubmit} className="profile-form profile-form--wide">
              <h2>Datos personales</h2>
              {profileMsg && <div className="profile-success" role="status">{profileMsg}</div>}
              {profileError && <div className="auth-error" role="alert">{profileError}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input type="text" value={profileData.nombre} onChange={set('nombre')} required />
                  {fieldErrors.nombre && <span className="field-error">{fieldErrors.nombre}</span>}
                </div>
                <div className="form-group">
                  <label>Apellidos</label>
                  <input type="text" value={profileData.apellidos} onChange={set('apellidos')} />
                  {fieldErrors.apellidos && <span className="field-error">{fieldErrors.apellidos}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <div className="email-field">
                  <input type="email" value={profileData.email} disabled className="input--disabled" />
                  {!emailChangeMode ? (
                    <button type="button" className="btn btn--outline btn--sm" onClick={() => setEmailChangeMode(true)}>
                      Cambiar email
                    </button>
                  ) : emailSent ? (
                    <span className="field-success">Se ha enviado un enlace de verificación a tu email actual ({profileData.email}). Confírmalo para cambiar a {newEmail}.</span>
                  ) : (
                    <div className="email-change-row">
                      <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Nuevo email" />
                      <button type="button" className="btn btn--primary btn--sm" onClick={handleEmailChange}>Enviar verificación</button>
                      <button type="button" className="btn btn--outline btn--sm" onClick={() => { setEmailChangeMode(false); setNewEmail(''); }}>Cancelar</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Teléfono</label>
                  <div className="phone-field">
                    <span className="phone-prefix">+34</span>
                    <input
                      type="tel"
                      value={profileData.telefono}
                      onChange={set('telefono')}
                      placeholder="612 345 678"
                      maxLength={9}
                    />
                  </div>
                  {fieldErrors.telefono && <span className="field-error">{fieldErrors.telefono}</span>}
                </div>
                <div className="form-group">
                  <label>Fecha de nacimiento</label>
                  <input
                    type="date"
                    value={profileData.fechaNacimiento}
                    onChange={set('fechaNacimiento')}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {fieldErrors.fechaNacimiento && <span className="field-error">{fieldErrors.fechaNacimiento}</span>}
                </div>
              </div>

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
                <label>Tipo de documento</label>
                <div className="form-row">
                  <div className="form-group">
                    <select value={profileData.tipoDocumento} onChange={set('tipoDocumento')}>
                      <option value="NIE">NIE</option>
                      <option value="PASAPORTE">Pasaporte</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      value={profileData.pasaporte}
                      onChange={set('pasaporte')}
                      placeholder={profileData.tipoDocumento === 'NIE' ? 'X1234567A' : 'PAA123456'}
                    />
                    {fieldErrors.pasaporte && <span className="field-error">{fieldErrors.pasaporte}</span>}
                  </div>
                </div>
              </div>

              <h3 className="profile-form__section-title">Dirección (España)</h3>
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
                  <input
                    type="text"
                    value={profileData.direccion.codigoPostal}
                    onChange={setDir('codigoPostal')}
                    placeholder="28001"
                    maxLength={5}
                  />
                  {fieldErrors.codigoPostal && <span className="field-error">{fieldErrors.codigoPostal}</span>}
                </div>
              </div>
              <div className="form-group">
                <label>País</label>
                <input type="text" value="España" disabled className="input--disabled" />
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
        </div>
        )}

      </div>

      {/* Cancel order modal */}
      {cancelModal.open && (
        <div className="cancel-modal-overlay" onClick={closeCancelModal} role="presentation">
          <div className="cancel-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="cancel-modal-title">
            <button className="cancel-modal__close" onClick={closeCancelModal} aria-label="Cerrar diálogo">&times;</button>
            <div className="cancel-modal__icon">&#10007;</div>
            <h3 className="cancel-modal__title" id="cancel-modal-title">¿Por qué quieres cancelar este pedido?</h3>
            <p className="cancel-modal__subtitle">Tu opinión nos ayuda a mejorar</p>
            <div className="cancel-modal__reasons">
              {cancelReasons.map((reason) => (
                <label key={reason} className={`cancel-modal__reason ${cancelModal.selectedReason === reason ? 'cancel-modal__reason--active' : ''}`}>
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={cancelModal.selectedReason === reason}
                    onChange={() => setCancelModal((prev) => ({ ...prev, selectedReason: reason, motivo: reason === 'Otro motivo' ? prev.motivo : reason }))}
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
            {cancelModal.selectedReason === 'Otro motivo' && (
              <textarea
                className="cancel-modal__textarea"
                placeholder="Cuéntanos el motivo..."
                value={cancelModal.motivo}
                onChange={(e) => setCancelModal((prev) => ({ ...prev, motivo: e.target.value }))}
                rows={3}
                autoFocus
              />
            )}
            <div className="cancel-modal__actions">
              <button className="btn btn--outline" onClick={closeCancelModal}>Volver</button>
              <button
                className="btn btn--danger"
                onClick={handleCancelSubmit}
                disabled={!cancelModal.selectedReason || (cancelModal.selectedReason === 'Otro motivo' && !cancelModal.motivo.trim())}
              >
                Confirmar cancelación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel result modal */}
      {cancelResult.open && (
        <div className="cancel-modal-overlay" onClick={() => setCancelResult({ ...cancelResult, open: false })} role="presentation">
          <div className="cancel-modal cancel-result-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Resultado de la cancelación">
            <button className="cancel-modal__close" onClick={() => setCancelResult({ ...cancelResult, open: false })} aria-label="Cerrar diálogo">&times;</button>
            {cancelResult.success ? (
              <>
                <div className={`cancel-result__icon cancel-result__icon--refund`}>
                  &#9203;
                </div>
                <h3 className="cancel-modal__title">Solicitud de cancelación enviada</h3>
                <div className="cancel-result__detail">
                  <div className="cancel-result__badge cancel-result__badge--warning">Pendiente de revisión</div>
                  <p>Tu solicitud de cancelación ha sido enviada al administrador. Te notificaremos por email cuando sea revisada.</p>
                  <div className="cancel-result__info">
                    <span>El administrador decidirá si procede el reembolso</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="cancel-result__icon cancel-result__icon--error">&#10007;</div>
                <h3 className="cancel-modal__title">Error al cancelar</h3>
                <p className="cancel-result__error-msg">{cancelResult.mensaje}</p>
              </>
            )}
            <div className="cancel-modal__actions" style={{ justifyContent: 'center' }}>
              <button className="btn btn--primary" onClick={() => setCancelResult({ ...cancelResult, open: false })}>
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
