import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      const serverError = err.response?.data?.error;
      if (serverError) {
        setError(serverError);
      } else if (!navigator.onLine) {
        setError('No hay conexión a Internet. Comprueba tu red e inténtalo de nuevo.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('No se pudo conectar con el servidor. Inténtalo más tarde.');
      } else {
        setError('Email o contraseña incorrectos. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Iniciar sesión</h1>
        <p className="auth-subtitle">Accede a tu cuenta de ChinaTravel</p>
        {error && <div className="auth-error" role="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="tu@email.com" autoComplete="email" />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Contraseña</label>
            <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••" autoComplete="current-password" />
          </div>
          <button type="submit" className="btn btn--primary btn--lg auth-btn" disabled={loading}>
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>
        <div className="auth-links">
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          <p>¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
        </div>
      </div>
    </div>
  );
}
