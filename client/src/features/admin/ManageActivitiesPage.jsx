import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ImageUploadField from '../../components/common/ImageUploadField';
import { formatPrice } from '../../utils/formatters';
import '../dashboard/Dashboard.css';

const CATEGORIES = ['CULTURAL', 'AVENTURA', 'GASTRONOMIA', 'NATURALEZA', 'COMPRAS', 'NOCTURNO', 'HISTORICO'];
const emptyForm = { nombre: '', descripcion: '', ciudad: '', categoria: '', duracionHoras: '', precio: '', accesible: false, imagen: '', consejos: '' };

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
      accesible: Boolean(form.accesible),
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
      accesible: act.accesible !== false,
      imagen: act.imagen || '',
      consejos: Array.isArray(act.consejos) ? act.consejos.join('\n') : '',
    });
  };

  const handleToggleActive = async (activity) => {
    if (!window.confirm(activity.isActive ? '¿Desactivar esta actividad?' : '¿Activar esta actividad?')) return;
    try {
      await api.put(`/actividades/${activity._id}`, { isActive: !activity.isActive });
      fetchActivities();
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  const handleDelete = async (activity) => {
    if (!activity.isActive) {
      if (!window.confirm('¿Eliminar esta actividad?')) return;
      try {
        await api.delete(`/actividades/${activity._id}`);
        fetchActivities();
      } catch (err) {
        alert(err.response?.data?.error || 'Error');
      }
      return;
    }

    alert('Desactiva primero esta actividad antes de eliminarla.');
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
          <div className="form-group">
            <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', padding: '12px 14px', background: 'var(--color-surface-alt, #f8f9fb)' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: 6, fontWeight: 700, color: 'var(--color-text)' }}>
                <input type="checkbox" checked={Boolean(form.accesible)} onChange={(e) => setForm({ ...form, accesible: e.target.checked })} />
                <span>
                  ¿Esta actividad es accesible para personas con movilidad reducida?
                  <br />
                  <small style={{ fontWeight: 500, color: 'var(--color-text-muted)' }}>
                    Marca la casilla si hay acceso sin barreras, rampas, ascensores o adaptación suficiente para visitarla cómodamente.
                  </small>
                </span>
              </label>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Por defecto se considera no accesible hasta que se active esta opción.
              </p>
            </div>
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
                    <button className={`btn btn--sm ${act.isActive ? 'btn--outline' : 'btn--primary'}`} onClick={() => handleToggleActive(act)}>
                      {act.isActive ? 'Desactivar' : 'Activar'}
                    </button>
                    <button className="btn btn--danger btn--sm" onClick={() => handleDelete(act)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}
