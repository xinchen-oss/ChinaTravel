import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ImageUploadField from '../../components/common/ImageUploadField';
import { formatPrice } from '../../utils/formatters';
import '../dashboard/Dashboard.css';

const CATEGORIES = ['CULTURAL', 'AVENTURA', 'GASTRONOMIA', 'NATURALEZA', 'COMPRAS', 'NOCTURNO', 'HISTORICO'];
const emptyForm = { nombre: '', descripcion: '', ciudad: '', categoria: '', duracionHoras: '', precio: '', imagen: '', consejos: '' };

export default function ManageActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);

  const fetchActivities = () => {
    api.get('/actividades')
      .then((res) => setActivities(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchActivities();
    api.get('/ciudades').then((res) => setCities(res.data.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      duracionHoras: Number(form.duracionHoras),
      precio: Number(form.precio),
      consejos: typeof form.consejos === 'string' ? form.consejos.split('\n').filter(Boolean) : form.consejos,
    };
    try {
      if (editing) {
        await api.put(`/actividades/${editing}`, payload);
      } else {
        await api.post('/actividades', payload);
      }
      setForm(emptyForm);
      setEditing(null);
      fetchActivities();
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  const handleEdit = (act) => {
    setEditing(act._id);
    setForm({
      nombre: act.nombre,
      descripcion: act.descripcion,
      ciudad: act.ciudad?._id || act.ciudad || '',
      categoria: act.categoria,
      duracionHoras: act.duracionHoras,
      precio: act.precio,
      imagen: act.imagen || '',
      consejos: Array.isArray(act.consejos) ? act.consejos.join('\n') : '',
    });
  };

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
    <div>
        <h1 className="page-title">Gestionar actividades</h1>

        <form onSubmit={handleSubmit} className="submission-form" style={{ marginBottom: 'var(--space-xl)' }}>
          <h2>{editing ? 'Editar actividad' : 'Nueva actividad'}</h2>
          <div className="form-group">
            <label>Nombre</label>
            <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Ciudad</label>
            <select value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} required>
              <option value="">Seleccionar ciudad</option>
              {cities.map((c) => (
                <option key={c._id} value={c._id}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Categoría</label>
            <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} required>
              <option value="">Seleccionar categoría</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Duración (horas)</label>
            <input type="number" value={form.duracionHoras} onChange={(e) => setForm({ ...form, duracionHoras: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Precio</label>
            <input type="number" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} required />
          </div>
          <ImageUploadField
            value={form.imagen}
            onChange={(url) => setForm({ ...form, imagen: url })}
          />
          <div className="form-group">
            <label>Consejos (uno por línea)</label>
            <textarea value={form.consejos} onChange={(e) => setForm({ ...form, consejos: e.target.value })} />
          </div>
          <div className="table-actions">
            <button type="submit" className="btn btn--primary">{editing ? 'Actualizar' : 'Crear'}</button>
            {editing && (
              <button type="button" className="btn btn--outline" onClick={() => { setEditing(null); setForm(emptyForm); }}>
                Cancelar
              </button>
            )}
          </div>
        </form>

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
                    <button className="btn btn--outline btn--sm" onClick={() => handleEdit(act)}>Editar</button>
                    <button className="btn btn--danger btn--sm" onClick={() => handleDelete(act._id)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}
