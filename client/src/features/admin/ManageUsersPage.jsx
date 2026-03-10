import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ROLES } from '../../utils/constants';
import '../dashboard/Dashboard.css';

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/usuarios')
      .then((res) => setUsers(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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

  if (loading) return <LoadingSpinner />;

  return (
    <div>
        <h1 className="page-title">Gestionar usuarios</h1>
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
                  <button
                    className={`btn btn--sm ${user.isActive ? 'btn--danger' : 'btn--primary'}`}
                    onClick={() => handleToggleActive(user._id, user.isActive)}
                  >
                    {user.isActive ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}
