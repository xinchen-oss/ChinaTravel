import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../dashboard/Dashboard.css';

export default function ManageCitiesPage() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nombre: '', nombreChino: '', slug: '', descripcion: '' });
  const [editing, setEditing] = useState(null);

  const fetchCities = () => {
    api.get('/ciudades')
      .then((res) => setCities(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCities(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/ciudades/${editing}`, form);
      } else {
        await api.post('/ciudades', form);
      }
      setForm({ nombre: '', nombreChino: '', slug: '', descripcion: '' });
      setEditing(null);
      fetchCities();
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  const handleEdit = (city) => {
    setEditing(city._id);
    setForm({ nombre: city.nombre, nombreChino: city.nombreChino || '', slug: city.slug, descripcion: city.descripcion });
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta ciudad?')) return;
    try {
      await api.delete(`/ciudades/${id}`);
      fetchCities();
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
        <h1 className="page-title">Gestionar ciudades</h1>

        <form onSubmit={handleSubmit} className="submission-form" style={{ marginBottom: 'var(--space-xl)' }}>
          <h2>{editing ? 'Editar ciudad' : 'Nueva ciudad'}</h2>
          <div className="form-group">
            <label>Nombre</label>
            <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Nombre en chino</label>
            <input value={form.nombreChino} onChange={(e) => setForm({ ...form, nombreChino: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Slug</label>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} required />
          </div>
          <div className="table-actions">
            <button type="submit" className="btn btn--primary">{editing ? 'Actualizar' : 'Crear'}</button>
            {editing && (
              <button type="button" className="btn btn--outline" onClick={() => { setEditing(null); setForm({ nombre: '', nombreChino: '', slug: '', descripcion: '' }); }}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Chino</th>
              <th>Slug</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city) => (
              <tr key={city._id}>
                <td>{city.nombre}</td>
                <td>{city.nombreChino}</td>
                <td>{city.slug}</td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn--outline btn--sm" onClick={() => handleEdit(city)}>Editar</button>
                    <button className="btn btn--danger btn--sm" onClick={() => handleDelete(city._id)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}
