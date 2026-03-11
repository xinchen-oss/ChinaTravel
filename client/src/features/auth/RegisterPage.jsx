import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';
import './Auth.css';

const PAISES = [
  'España', 'México', 'Argentina', 'Colombia', 'Chile', 'Perú', 'Venezuela',
  'Ecuador', 'Guatemala', 'Cuba', 'Bolivia', 'Rep. Dominicana', 'Honduras',
  'Paraguay', 'El Salvador', 'Nicaragua', 'Costa Rica', 'Panamá', 'Uruguay',
  'Puerto Rico', 'China', 'Estados Unidos', 'Francia', 'Alemania', 'Italia',
  'Portugal', 'Reino Unido', 'Japón', 'Corea del Sur', 'Otro',
];

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
    nacionalidad: '',
    empresaNombre: '',
    empresaCIF: '',
    motivoComercial: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

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
      const { confirmPassword, ...data } = form;
      if (accountType === 'COMERCIAL') {
        const res = await api.post('/auth/registro', { ...data, role: 'COMERCIAL' });
        setSuccess(res.data.message);
      } else {
        await register(data);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
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
            </div>
            <div className="form-group">
              <label>Apellidos *</label>
              <input type="text" value={form.apellidos} onChange={set('apellidos')} required placeholder="Tus apellidos" />
            </div>
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input type="email" value={form.email} onChange={set('email')} required placeholder="tu@email.com" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Contraseña *</label>
              <input type="password" value={form.password} onChange={set('password')} required placeholder="Mínimo 6 caracteres" minLength={6} />
            </div>
            <div className="form-group">
              <label>Confirmar contraseña *</label>
              <input type="password" value={form.confirmPassword} onChange={set('confirmPassword')} required placeholder="Repite la contraseña" minLength={6} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Teléfono</label>
              <input type="tel" value={form.telefono} onChange={set('telefono')} placeholder="+34 600 000 000" />
            </div>
            <div className="form-group">
              <label>Fecha de nacimiento</label>
              <input type="date" value={form.fechaNacimiento} onChange={set('fechaNacimiento')} />
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
              <label>Nacionalidad</label>
              <select value={form.nacionalidad} onChange={set('nacionalidad')}>
                <option value="">Seleccionar</option>
                {PAISES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
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
