import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatPrice } from '../../utils/formatters';
import { useCities } from '../../hooks/useCities';
import '../dashboard/Dashboard.css';

const emptyForm = { titulo: '', descripcion: '', ciudad: '', duracionDias: '', precio: '', imagen: '' };

export default function ManageGuidesPage() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const { cities } = useCities();

  const fetchGuides = () => {
    api.get('/guias')
      .then((res) => setGuides(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchGuides(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, duracionDias: Number(form.duracionDias), precio: Number(form.precio) };
      if (editing) {
        await api.put(`/guias/${editing}`, data);
      } else {
        await api.post('/guias', data);
      }
      setForm(emptyForm);
      setEditing(null);
      fetchGuides();
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  const handleEdit = (guide) => {
    setEditing(guide._id);
    setForm({
      titulo: guide.titulo || '',
      descripcion: guide.descripcion || '',
      ciudad: guide.ciudad?._id || '',
      duracionDias: guide.duracionDias || '',
      precio: guide.precio || '',
      imagen: guide.imagen || '',
    });
  };

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

      <form onSubmit={handleSubmit} className="submission-form" style={{ marginBottom: 'var(--space-xl)' }}>
        <h2>{editing ? 'Editar guía' : 'Nueva guía'}</h2>
        <div className="form-group">
          <label>Título</label>
          <input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Descripción</label>
          <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Ciudad</label>
          <select value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} required>
            <option value="">Seleccionar</option>
            {cities.map((c) => <option key={c._id} value={c._id}>{c.nombre}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Duración (días)</label>
            <input type="number" value={form.duracionDias} onChange={(e) => setForm({ ...form, duracionDias: e.target.value })} min={1} required />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Precio (EUR)</label>
            <input type="number" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} min={0} required />
          </div>
        </div>
        <div className="form-group">
          <label>URL de imagen (opcional)</label>
          <input value={form.imagen} onChange={(e) => setForm({ ...form, imagen: e.target.value })} placeholder="https://..." />
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
                  <button className="btn btn--outline btn--sm" onClick={() => handleEdit(guide)}>Editar</button>
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
