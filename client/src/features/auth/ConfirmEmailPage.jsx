import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import './Auth.css';

export default function ConfirmEmailPage() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get(`/auth/confirmar-email/${token}`)
      .then((res) => {
        setStatus('success');
        setMessage(res.data.message);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Token inválido o expirado');
      });
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        {status === 'loading' && <p role="status">Verificando...</p>}
        {status === 'success' && (
          <>
            <div style={{ width: 64, height: 64, background: '#f0fdf4', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 16px' }}>&#10003;</div>
            <h2>Email actualizado</h2>
            <p style={{ color: '#666', margin: '12px 0 24px' }}>{message}</p>
            <Link to="/dashboard" className="btn btn--primary">Ir a mi cuenta</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ width: 64, height: 64, background: '#fef2f2', color: '#dc2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 16px' }}>&#10007;</div>
            <h2>Error</h2>
            <p style={{ color: '#666', margin: '12px 0 24px' }}>{message}</p>
            <Link to="/dashboard" className="btn btn--primary">Volver</Link>
          </>
        )}
      </div>
    </div>
  );
}
