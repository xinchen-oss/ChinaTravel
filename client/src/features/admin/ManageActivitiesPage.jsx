import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatPrice } from '../../utils/formatters';
import '../dashboard/Dashboard.css';

export default function ManageActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = () => {
    api.get('/actividades')
      .then((res) => setActivities(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchActivities(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta actividad?')) return;
    try {
      await api.delete(`/actividades/${id}`);
      fetchActivities();
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Gestionar actividades</h1>
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Ciudad</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((act) => (
              <tr key={act._id}>
                <td>{act.nombre}</td>
                <td>{act.ciudad?.nombre}</td>
                <td>{act.categoria}</td>
                <td>{formatPrice(act.precio)}</td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn--danger btn--sm" onClick={() => handleDelete(act._id)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
