import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatPrice } from '../../utils/formatters';
import '../dashboard/Dashboard.css';

export default function ManageGuidesPage() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGuides = () => {
    api.get('/guias')
      .then((res) => setGuides(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchGuides(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta guía?')) return;
    try {
      await api.delete(`/guias/${id}`);
      fetchGuides();
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
        <h1 className="page-title">Gestionar guías</h1>
        <table className="data-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Ciudad</th>
              <th>Días</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {guides.map((guide) => (
              <tr key={guide._id}>
                <td>{guide.titulo}</td>
                <td>{guide.ciudad?.nombre}</td>
                <td>{guide.duracionDias}</td>
                <td>{formatPrice(guide.precio)}</td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn--danger btn--sm" onClick={() => handleDelete(guide._id)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}
