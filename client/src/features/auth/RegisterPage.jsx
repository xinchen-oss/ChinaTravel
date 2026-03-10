import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Auth.css';

const PAISES = [
  'España', 'México', 'Argentina', 'Colombia', 'Chile', 'Perú', 'Venezuela',
  'Ecuador', 'Guatemala', 'Cuba', 'Bolivia', 'Rep. Dominicana', 'Honduras',
  'Paraguay', 'El Salvador', 'Nicaragua', 'Costa Rica', 'Panamá', 'Uruguay',
  'Puerto Rico', 'China', 'Estados Unidos', 'Francia', 'Alemania', 'Italia',
  'Portugal', 'Reino Unido', 'Japón', 'Corea del Sur', 'Otro',
];

export default function RegisterPage() {
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
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      await register(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        <h1>Crear cuenta</h1>
        <p className="auth-subtitle">Únete a ChinaTravel y descubre China</p>
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

          <button type="submit" className="btn btn--primary btn--lg auth-btn" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>
        <div className="auth-links">
          <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
        </div>
      </div>
    </div>
  );
}
