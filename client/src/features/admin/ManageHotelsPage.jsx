import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ImageUploadField from '../../components/common/ImageUploadField';
import { formatPrice } from '../../utils/formatters';
import '../dashboard/Dashboard.css';

const emptyForm = {
  nombre: '',
  descripcion: '',
  ciudad: '',
  estrellas: '',
  precioPorNoche: '',
  imagen: '',
  sillasRuedas: false,
  ascensor: false,
  habitacionAdaptada: false,
};

export default function ManageHotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);

  const fetchHotels = () => {
    api.get('/hoteles')
      .then((res) => setHotels(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHotels();
    api.get('/ciudades').then((res) => setCities(res.data.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      ciudad: form.ciudad,
      estrellas: Number(form.estrellas),
      precioPorNoche: Number(form.precioPorNoche),
      imagen: form.imagen,
      accesibilidad: {
        sillasRuedas: form.sillasRuedas,
        ascensor: form.ascensor,
        habitacionAdaptada: form.habitacionAdaptada,
      },
    };
    try {
      if (editing) {
        await api.put(`/hoteles/${editing}`, payload);
      } else {
        await api.post('/hoteles', payload);
      }
      setForm(emptyForm);
      setEditing(null);
      fetchHotels();
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  const handleEdit = (hotel) => {
    setEditing(hotel._id);
    setForm({
      nombre: hotel.nombre,
      descripcion: hotel.descripcion || '',
      ciudad: hotel.ciudad?._id || hotel.ciudad || '',
      estrellas: hotel.estrellas,
      precioPorNoche: hotel.precioPorNoche,
      imagen: hotel.imagen || '',
      sillasRuedas: hotel.accesibilidad?.sillasRuedas || false,
      ascensor: hotel.accesibilidad?.ascensor || false,
      habitacionAdaptada: hotel.accesibilidad?.habitacionAdaptada || false,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este hotel?')) return;
    try {
      await api.delete(`/hoteles/${id}`);
      fetchHotels();
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="page-title">Gestionar hoteles</h1>

      <form onSubmit={handleSubmit} className="submission-form" style={{ marginBottom: 'var(--space-xl)' }}>
        <h2>{editing ? 'Editar hotel' : 'Nuevo hotel'}</h2>
        <div className="form-group">
          <label>Nombre</label>
          <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Descripción</label>
          <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
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
          <label>Estrellas (1-5)</label>
          <input type="number" min="1" max="5" value={form.estrellas} onChange={(e) => setForm({ ...form, estrellas: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Precio por noche (€)</label>
          <input type="number" value={form.precioPorNoche} onChange={(e) => setForm({ ...form, precioPorNoche: e.target.value })} required />
        </div>
        <ImageUploadField
          value={form.imagen}
          onChange={(url) => setForm({ ...form, imagen: url })}
        />
        <div className="form-group">
          <label>Accesibilidad</label>
          <label style={{ display: 'block', fontWeight: 'normal' }}>
            <input type="checkbox" checked={form.sillasRuedas} onChange={(e) => setForm({ ...form, sillasRuedas: e.target.checked })} />
            {' '}Acceso para sillas de ruedas
          </label>
          <label style={{ display: 'block', fontWeight: 'normal' }}>
            <input type="checkbox" checked={form.ascensor} onChange={(e) => setForm({ ...form, ascensor: e.target.checked })} />
            {' '}Ascensor
          </label>
          <label style={{ display: 'block', fontWeight: 'normal' }}>
            <input type="checkbox" checked={form.habitacionAdaptada} onChange={(e) => setForm({ ...form, habitacionAdaptada: e.target.checked })} />
            {' '}Habitación adaptada
          </label>
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
            <th>Estrellas</th>
            <th>Precio / noche</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel) => (
            <tr key={hotel._id}>
              <td>{hotel.nombre}</td>
              <td>{hotel.ciudad?.nombre}</td>
              <td>{'★'.repeat(hotel.estrellas)}</td>
              <td>{formatPrice(hotel.precioPorNoche)}</td>
              <td>
                <div className="table-actions">
                  <button className="btn btn--outline btn--sm" onClick={() => handleEdit(hotel)}>Editar</button>
                  <button className="btn btn--danger btn--sm" onClick={() => handleDelete(hotel._id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
