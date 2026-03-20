import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ROLES } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import '../dashboard/Dashboard.css';

const emptyUserForm = { nombre: '', email: '', password: '', role: 'USER' };

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [pendingComercials, setPendingComercials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [userForm, setUserForm] = useState(emptyUserForm);

  const fetchData = () => {
    Promise.all([
      api.get('/usuarios'),
      api.get('/usuarios/pending-comercials'),
    ])
      .then(([usersRes, pendingRes]) => {
        setUsers(usersRes.data.data);
        setPendingComercials(pendingRes.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      await api.put(`/usuarios/${userId}`, { role });
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role } : u)));
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  const handleToggleActive = async (userId, isActive) => {
    try {
      await api.put(`/usuarios/${userId}`, { isActive: !isActive });
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, isActive: !isActive } : u)));
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  const handleDelete = async (userId, nombre) => {
    if (!confirm(`¿Eliminar el usuario "${nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      await api.delete(`/usuarios/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/usuarios', userForm);
      setUserForm(emptyUserForm);
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  const handleApprove = async (userId, approved) => {
    try {
      await api.put(`/usuarios/${userId}/approve`, { approved });
      setPendingComercials((prev) => prev.filter((u) => u._id !== userId));
      if (approved) {
        // Refresh users list to include the newly approved user
        const res = await api.get('/usuarios');
        setUsers(res.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="page-title">Gestionar usuarios</h1>

      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <button className="btn btn--primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : 'Nuevo usuario'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateUser} className="submission-form" style={{ marginBottom: 'var(--space-xl)' }}>
          <h2>Crear usuario</h2>
          <div className="form-group">
            <label>Nombre</label>
            <input value={userForm.nombre} onChange={(e) => setUserForm({ ...userForm, nombre: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} minLength={6} required />
          </div>
          <div className="form-group">
            <label>Rol</label>
            <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
              {Object.values(ROLES).map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <button type="submit" className="btn btn--primary">Crear</button>
        </form>
      )}

      {/* Pending comercial approvals */}
      {pendingComercials.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ marginBottom: '16px', color: 'var(--color-primary)' }}>
            Solicitudes Comerciales pendientes ({pendingComercials.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pendingComercials.map((user) => (
              <div key={user._id} style={{
                background: '#fff7ed',
                border: '1px solid #fed7aa',
                borderRadius: '12px',
                padding: '20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px' }}>{user.nombre} {user.apellidos}</h3>
                    <p style={{ margin: '0 0 8px', color: '#666', fontSize: '0.9rem' }}>{user.email}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem' }}>
                      {user.empresaNombre && (
                        <span><strong>Empresa:</strong> {user.empresaNombre}</span>
                      )}
                      {user.empresaCIF && (
                        <span><strong>CIF:</strong> {user.empresaCIF}</span>
                      )}
                      {user.telefono && (
                        <span><strong>Tel:</strong> {user.telefono}</span>
                      )}
                      {user.nacionalidad && (
                        <span><strong>Nacionalidad:</strong> {user.nacionalidad}</span>
                      )}
                    </div>
                    {user.motivoComercial && (
                      <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: '#555', fontStyle: 'italic' }}>
                        "{user.motivoComercial}"
                      </p>
                    )}
                    <p style={{ margin: '8px 0 0', fontSize: '0.8rem', color: '#999' }}>
                      Solicitado: {formatDate(user.createdAt)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button
                      className="btn btn--primary btn--sm"
                      onClick={() => handleApprove(user._id, true)}
                    >
                      Aprobar
                    </button>
                    <button
                      className="btn btn--danger btn--sm"
                      onClick={() => {
                        if (window.confirm(`¿Rechazar la solicitud de ${user.nombre}? Se eliminará su cuenta.`)) {
                          handleApprove(user._id, false);
                        }
                      }}
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.nombre}</td>
              <td>{user.email}</td>
              <td>
                <select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)}>
                  {Object.values(ROLES).map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </td>
              <td>
                <span className={`badge badge--${user.isActive ? 'success' : 'error'}`}>
                  {user.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                <div className="table-actions">
                  <button
                    className={`btn btn--sm ${user.isActive ? 'btn--outline' : 'btn--primary'}`}
                    onClick={() => handleToggleActive(user._id, user.isActive)}
                  >
                    {user.isActive ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    className="btn btn--danger btn--sm"
                    onClick={() => handleDelete(user._id, user.nombre)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
