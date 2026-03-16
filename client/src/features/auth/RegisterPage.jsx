import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';
import './Auth.css';

const ONLY_LETTERS = /^[A-Za-zÀ-ÿñÑ\s'-]+$/;
const SPANISH_PHONE = /^[679]\d{8}$/;
const NIE_REGEX = /^[XYZ]\d{7}[A-Z]$/i;
const PASSPORT_REGEX = /^[A-Z]{3}\d{6}$/i;

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

export default function RegisterPage() {
  const [accountType, setAccountType] = useState('USER'); // USER or COMERCIAL
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    fechaNacimiento: '',
    genero: '',
    tipoDocumento: 'NIE',
    pasaporte: '',
    empresaNombre: '',
    empresaCIF: '',
    motivoComercial: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Field validations
    const errs = {};
    if (!ONLY_LETTERS.test(form.nombre)) errs.nombre = 'Solo letras';
    if (!ONLY_LETTERS.test(form.apellidos)) errs.apellidos = 'Solo letras';
    if (form.telefono && !SPANISH_PHONE.test(form.telefono.replace(/\s/g, ''))) errs.telefono = 'Formato: 6XX XXX XXX / 7XX XXX XXX / 9XX XXX XXX';
    if (form.fechaNacimiento) {
      const bdErr = validateBirthDate(form.fechaNacimiento);
      if (bdErr) errs.fechaNacimiento = bdErr;
    }
    if (form.pasaporte) {
      if (form.tipoDocumento === 'NIE' && !NIE_REGEX.test(form.pasaporte)) errs.pasaporte = 'Formato NIE: X/Y/Z + 7 dígitos + letra';
      if (form.tipoDocumento === 'PASAPORTE' && !PASSPORT_REGEX.test(form.pasaporte)) errs.pasaporte = 'Formato: 3 letras + 6 dígitos';
    }
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (!/[A-Z]/.test(form.password)) {
      setError('La contraseña debe contener al menos una letra mayúscula');
      return;
    }
    if (!/[a-z]/.test(form.password)) {
      setError('La contraseña debe contener al menos una letra minúscula');
      return;
    }
    if (!/[0-9]/.test(form.password)) {
      setError('La contraseña debe contener al menos un número');
      return;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password)) {
      setError('La contraseña debe contener al menos un carácter especial (!@#$%...)');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (accountType === 'COMERCIAL') {
      if (!form.empresaNombre.trim()) {
        setError('El nombre de la empresa es obligatorio para cuentas Comerciales');
        return;
      }
      if (!form.empresaCIF.trim()) {
        setError('El CIF/NIF de la empresa es obligatorio');
        return;
      }
    }

    setLoading(true);
    try {
      const { confirmPassword, tipoDocumento, ...data } = form;
      if (data.telefono) data.telefono = `+34 ${data.telefono.replace(/\s/g, '')}`;
      data.nacionalidad = 'España';
      if (accountType === 'COMERCIAL') {
        const res = await api.post('/auth/registro', { ...data, role: 'COMERCIAL' });
        setSuccess(res.data.message);
      } else {
        await register(data);
        navigate('/');
      }
    } catch (err) {
      const serverError = err.response?.data?.error;
      if (serverError) {
        setError(serverError);
      } else if (!navigator.onLine) {
        setError('No hay conexión a Internet. Comprueba tu red e inténtalo de nuevo.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('No se pudo conectar con el servidor. Inténtalo más tarde.');
      } else {
        setError('Error al registrarse. Por favor, revisa los datos e inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, background: '#f0fdf4', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 16px' }}>&#10003;</div>
            <h1>Solicitud enviada</h1>
            <p style={{ color: '#666', margin: '16px 0 24px' }}>{success}</p>
            <Link to="/login" className="btn btn--primary">Volver al inicio de sesion</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        <h1>Crear cuenta</h1>
        <p className="auth-subtitle">Únete a ChinaTravel y descubre China</p>

        {/* Account type selector */}
        <div className="account-type-selector">
          <button
            type="button"
            className={`account-type-btn ${accountType === 'USER' ? 'account-type-btn--active' : ''}`}
            onClick={() => setAccountType('USER')}
          >
            <span className="account-type-btn__icon">👤</span>
            <span className="account-type-btn__label">Usuario</span>
            <span className="account-type-btn__desc">Explora y reserva viajes</span>
          </button>
          <button
            type="button"
            className={`account-type-btn ${accountType === 'COMERCIAL' ? 'account-type-btn--active' : ''}`}
            onClick={() => setAccountType('COMERCIAL')}
          >
            <span className="account-type-btn__icon">🏢</span>
            <span className="account-type-btn__label">Comercial</span>
            <span className="account-type-btn__desc">Gestiona y publica contenido</span>
          </button>
        </div>

        {accountType === 'COMERCIAL' && (
          <div className="comercial-notice">
            Las cuentas Comerciales requieren aprobacion del administrador. Una vez enviada tu solicitud, recibiras una notificacion cuando sea aprobada.
          </div>
        )}

        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nombre *</label>
              <input type="text" value={form.nombre} onChange={set('nombre')} required placeholder="Tu nombre" />
              {fieldErrors.nombre && <span className="field-error">{fieldErrors.nombre}</span>}
            </div>
            <div className="form-group">
              <label>Apellidos *</label>
              <input type="text" value={form.apellidos} onChange={set('apellidos')} required placeholder="Tus apellidos" />
              {fieldErrors.apellidos && <span className="field-error">{fieldErrors.apellidos}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input type="email" value={form.email} onChange={set('email')} required placeholder="tu@email.com" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Contraseña *</label>
              <input type="password" value={form.password} onChange={set('password')} required placeholder="Mín. 8 car., mayús., minús., número, especial" minLength={8} />
            </div>
            <div className="form-group">
              <label>Confirmar contraseña *</label>
              <input type="password" value={form.confirmPassword} onChange={set('confirmPassword')} required placeholder="Repite la contraseña" minLength={8} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Teléfono</label>
              <div className="phone-field">
                <span className="phone-prefix">+34</span>
                <input type="tel" value={form.telefono} onChange={set('telefono')} placeholder="612 345 678" maxLength={9} />
              </div>
              {fieldErrors.telefono && <span className="field-error">{fieldErrors.telefono}</span>}
            </div>
            <div className="form-group">
              <label>Fecha de nacimiento</label>
              <input type="date" value={form.fechaNacimiento} onChange={set('fechaNacimiento')} max={new Date().toISOString().split('T')[0]} />
              {fieldErrors.fechaNacimiento && <span className="field-error">{fieldErrors.fechaNacimiento}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Género</label>
              <select value={form.genero} onChange={set('genero')}>
                <option value="">Prefiero no decir</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
            <div className="form-group">
              <label>Documento de identidad</label>
              <select value={form.tipoDocumento} onChange={set('tipoDocumento')}>
                <option value="NIE">NIE</option>
                <option value="PASAPORTE">Pasaporte</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>N° {form.tipoDocumento === 'NIE' ? 'NIE' : 'Pasaporte'}</label>
            <input
              type="text"
              value={form.pasaporte}
              onChange={set('pasaporte')}
              placeholder={form.tipoDocumento === 'NIE' ? 'X1234567A' : 'PAA123456'}
            />
            {fieldErrors.pasaporte && <span className="field-error">{fieldErrors.pasaporte}</span>}
          </div>

          {/* Comercial-specific fields */}
          {accountType === 'COMERCIAL' && (
            <>
              <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />
              <h3 style={{ marginBottom: '12px', color: 'var(--color-primary)' }}>Datos de la empresa</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre de la empresa *</label>
                  <input type="text" value={form.empresaNombre} onChange={set('empresaNombre')} required placeholder="Nombre de tu empresa" />
                </div>
                <div className="form-group">
                  <label>CIF / NIF *</label>
                  <input type="text" value={form.empresaCIF} onChange={set('empresaCIF')} required placeholder="B12345678" />
                </div>
              </div>
              <div className="form-group">
                <label>Motivo de la solicitud</label>
                <textarea
                  value={form.motivoComercial}
                  onChange={set('motivoComercial')}
                  placeholder="Describe brevemente por que deseas una cuenta Comercial y que tipo de contenido quieres gestionar..."
                  rows={3}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius)', fontSize: 'var(--font-size-base)', resize: 'vertical' }}
                />
              </div>
            </>
          )}

          <button type="submit" className="btn btn--primary btn--lg auth-btn" disabled={loading}>
            {loading
              ? (accountType === 'COMERCIAL' ? 'Enviando solicitud...' : 'Creando cuenta...')
              : (accountType === 'COMERCIAL' ? 'Enviar solicitud' : 'Registrarse')
            }
          </button>
        </form>
        <div className="auth-links">
          <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
        </div>
      </div>
    </div>
  );
}
