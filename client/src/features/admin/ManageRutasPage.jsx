import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ImageUploadField from '../../components/common/ImageUploadField';
import { formatPrice } from '../../utils/formatters';
import { useCities } from '../../hooks/useCities';
import '../dashboard/Dashboard.css';

const emptyForm = { titulo: '', descripcion: '', ciudad: '', duracionDias: '', imagen: '' };

export default function ManageRutasPage() {
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const { cities } = useCities();

  const fetchRutas = () => {
    api.get('/rutas')
      .then((res) => setRutas(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRutas(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Price is derived from the ruta's activity tickets on the server.
      const data = { ...form, duracionDias: Number(form.duracionDias) };
      if (editing) {
        await api.put(`/rutas/${editing}`, data);
      } else {
        await api.post('/rutas', data);
      }
      setForm(emptyForm);
      setEditing(null);
      fetchRutas();
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  const handleEdit = (ruta) => {
    setEditing(ruta._id);
    setForm({
      titulo: ruta.titulo || '',
      descripcion: ruta.descripcion || '',
      ciudad: ruta.ciudad?._id || '',
      duracionDias: ruta.duracionDias || '',
      imagen: ruta.imagen || '',
    });
  };

  const handleToggleActive = async (ruta) => {
    if (!window.confirm(ruta.isActive ? '¿Desactivar esta ruta?' : '¿Activar esta ruta?')) return;
    try {
      await api.put(`/rutas/${ruta._id}`, { isActive: !ruta.isActive });
      fetchRutas();
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  const handleDelete = async (ruta) => {
    if (!ruta.isActive) {
      if (!window.confirm('¿Eliminar esta ruta?')) return;
      try {
        await api.delete(`/rutas/${ruta._id}`);
        fetchRutas();
      } catch (err) {
        alert(err.response?.data?.error || 'Error');
      }
      return;
    }

    alert('Desactiva primero esta ruta antes de eliminarla.');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="page-title">Gestionar rutas</h1>

      <form onSubmit={handleSubmit} className="submission-form" style={{ marginBottom: 'var(--space-xl)' }}>
        <h2>{editing ? 'Editar ruta' : 'Nueva ruta'}</h2>
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
        <div className="form-group">
          <label>Duración (días)</label>
          <input type="number" value={form.duracionDias} onChange={(e) => setForm({ ...form, duracionDias: e.target.value })} min={1} required />
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light, #6b7280)', margin: '0 0 12px' }}>
          El precio de la ruta se calcula automáticamente como la suma de las entradas de sus actividades.
        </p>
        <ImageUploadField
          value={form.imagen}
          onChange={(url) => setForm({ ...form, imagen: url })}
          label="Imagen (opcional)"
        />
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
            <th>Precio (entradas)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rutas.map((ruta) => (
            <tr key={ruta._id}>
              <td>{ruta.titulo}</td>
              <td>{ruta.ciudad?.nombre}</td>
              <td>{ruta.duracionDias}</td>
              <td>{formatPrice(ruta.precio)}</td>
              <td>
                <div className="table-actions">
                  <button className="btn btn--outline btn--sm" onClick={() => handleEdit(ruta)}>Editar</button>
                  <button className={`btn btn--sm ${ruta.isActive ? 'btn--outline' : 'btn--primary'}`} onClick={() => handleToggleActive(ruta)}>
                    {ruta.isActive ? 'Desactivar' : 'Activar'}
                  </button>
                  <button className="btn btn--danger btn--sm" onClick={() => handleDelete(ruta)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
