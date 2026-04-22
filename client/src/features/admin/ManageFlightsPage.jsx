import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatPrice } from '../../utils/formatters';
import '../dashboard/Dashboard.css';

const emptyForm = {
  aerolinea: '',
  origen: '',
  destino: '',
  ciudadDestino: '',
  precio: '',
  horaSalida: '',
  horaLlegada: '',
  duracionHoras: '',
  sillasRuedas: false,
  asistenciaEspecial: false,
};

export default function ManageFlightsPage() {
  const [flights, setFlights] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);

  const fetchFlights = () => {
    api.get('/vuelos')
      .then((res) => setFlights(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFlights();
    api.get('/ciudades').then((res) => setCities(res.data.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      aerolinea: form.aerolinea,
      origen: form.origen,
      destino: form.destino,
      ciudadDestino: form.ciudadDestino,
      precio: Number(form.precio),
      horaSalida: form.horaSalida,
      horaLlegada: form.horaLlegada,
      duracionHoras: form.duracionHoras ? Number(form.duracionHoras) : undefined,
      accesibilidad: {
        sillasRuedas: form.sillasRuedas,
        asistenciaEspecial: form.asistenciaEspecial,
      },
    };
    try {
      if (editing) {
        await api.put(`/vuelos/${editing}`, payload);
      } else {
        await api.post('/vuelos', payload);
      }
      setForm(emptyForm);
      setEditing(null);
      fetchFlights();
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  const handleEdit = (flight) => {
    setEditing(flight._id);
    setForm({
      aerolinea: flight.aerolinea,
      origen: flight.origen,
      destino: flight.destino,
      ciudadDestino: flight.ciudadDestino?._id || flight.ciudadDestino || '',
      precio: flight.precio,
      horaSalida: flight.horaSalida || '',
      horaLlegada: flight.horaLlegada || '',
      duracionHoras: flight.duracionHoras || '',
      sillasRuedas: flight.accesibilidad?.sillasRuedas || false,
      asistenciaEspecial: flight.accesibilidad?.asistenciaEspecial || false,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este vuelo?')) return;
    try {
      await api.delete(`/vuelos/${id}`);
      fetchFlights();
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="page-title">Gestionar vuelos</h1>

      <form onSubmit={handleSubmit} className="submission-form" style={{ marginBottom: 'var(--space-xl)' }}>
        <h2>{editing ? 'Editar vuelo' : 'Nuevo vuelo'}</h2>
        <div className="form-group">
          <label>Aerolínea</label>
          <input value={form.aerolinea} onChange={(e) => setForm({ ...form, aerolinea: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Origen</label>
          <input value={form.origen} onChange={(e) => setForm({ ...form, origen: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Destino</label>
          <input value={form.destino} onChange={(e) => setForm({ ...form, destino: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Ciudad de destino</label>
          <select value={form.ciudadDestino} onChange={(e) => setForm({ ...form, ciudadDestino: e.target.value })} required>
            <option value="">Seleccionar ciudad</option>
            {cities.map((c) => (
              <option key={c._id} value={c._id}>{c.nombre}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Precio (€)</label>
          <input type="number" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Hora de salida</label>
          <input placeholder="ej. 10:30" value={form.horaSalida} onChange={(e) => setForm({ ...form, horaSalida: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Hora de llegada</label>
          <input placeholder="ej. 22:45" value={form.horaLlegada} onChange={(e) => setForm({ ...form, horaLlegada: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Duración (horas)</label>
          <input type="number" step="0.1" value={form.duracionHoras} onChange={(e) => setForm({ ...form, duracionHoras: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Accesibilidad</label>
          <label style={{ display: 'block', fontWeight: 'normal' }}>
            <input type="checkbox" checked={form.sillasRuedas} onChange={(e) => setForm({ ...form, sillasRuedas: e.target.checked })} />
            {' '}Acceso para sillas de ruedas
          </label>
          <label style={{ display: 'block', fontWeight: 'normal' }}>
            <input type="checkbox" checked={form.asistenciaEspecial} onChange={(e) => setForm({ ...form, asistenciaEspecial: e.target.checked })} />
            {' '}Asistencia especial
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
            <th>Aerolínea</th>
            <th>Ruta</th>
            <th>Destino</th>
            <th>Horario</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => (
            <tr key={flight._id}>
              <td>{flight.aerolinea}</td>
              <td>{flight.origen} → {flight.destino}</td>
              <td>{flight.ciudadDestino?.nombre}</td>
              <td>{flight.horaSalida && flight.horaLlegada ? `${flight.horaSalida} - ${flight.horaLlegada}` : '-'}</td>
              <td>{formatPrice(flight.precio)}</td>
              <td>
                <div className="table-actions">
                  <button className="btn btn--outline btn--sm" onClick={() => handleEdit(flight)}>Editar</button>
                  <button className="btn btn--danger btn--sm" onClick={() => handleDelete(flight._id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
