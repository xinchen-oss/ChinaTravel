import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useCities } from '../../hooks/useCities';
import { SUBMISSION_TYPES, ACTIVITY_CATEGORIES } from '../../utils/constants';
import '../dashboard/Dashboard.css';
import '../auth/Auth.css';

export default function SubmitContentPage() {
  const navigate = useNavigate();
  const { cities } = useCities();
  const [tipo, setTipo] = useState('ACTIVIDAD');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Activity fields
  const [actForm, setActForm] = useState({ nombre: '', descripcion: '', ciudad: '', categoria: 'CULTURAL', duracionHoras: 2, precio: 0 });
  // Hotel fields
  const [hotelForm, setHotelForm] = useState({ nombre: '', descripcion: '', ciudad: '', estrellas: 3, precioPorNoche: 0 });
  // Flight fields
  const [flightForm, setFlightForm] = useState({ aerolinea: '', origen: 'Madrid', destino: '', ciudadDestino: '', precio: 0 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let contenido;
      if (tipo === 'ACTIVIDAD') contenido = actForm;
      else if (tipo === 'HOTEL') contenido = hotelForm;
      else contenido = flightForm;

      await api.post('/solicitudes', { tipoContenido: tipo, contenido });
      navigate('/comercial');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Nueva solicitud de contenido</h1>

        <div className="submission-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label>Tipo de contenido</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              {SUBMISSION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSubmit}>
            {tipo === 'ACTIVIDAD' && (
              <>
                <div className="form-group">
                  <label>Nombre</label>
                  <input value={actForm.nombre} onChange={(e) => setActForm({ ...actForm, nombre: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <textarea value={actForm.descripcion} onChange={(e) => setActForm({ ...actForm, descripcion: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Ciudad</label>
                  <select value={actForm.ciudad} onChange={(e) => setActForm({ ...actForm, ciudad: e.target.value })} required>
                    <option value="">Seleccionar</option>
                    {cities.map((c) => <option key={c._id} value={c._id}>{c.nombre}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Categoría</label>
                  <select value={actForm.categoria} onChange={(e) => setActForm({ ...actForm, categoria: e.target.value })}>
                    {ACTIVITY_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Duración (horas)</label>
                  <input type="number" value={actForm.duracionHoras} onChange={(e) => setActForm({ ...actForm, duracionHoras: +e.target.value })} min={0.5} step={0.5} required />
                </div>
                <div className="form-group">
                  <label>Precio (EUR)</label>
                  <input type="number" value={actForm.precio} onChange={(e) => setActForm({ ...actForm, precio: +e.target.value })} min={0} required />
                </div>
              </>
            )}

            {tipo === 'HOTEL' && (
              <>
                <div className="form-group">
                  <label>Nombre</label>
                  <input value={hotelForm.nombre} onChange={(e) => setHotelForm({ ...hotelForm, nombre: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <textarea value={hotelForm.descripcion} onChange={(e) => setHotelForm({ ...hotelForm, descripcion: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Ciudad</label>
                  <select value={hotelForm.ciudad} onChange={(e) => setHotelForm({ ...hotelForm, ciudad: e.target.value })} required>
                    <option value="">Seleccionar</option>
                    {cities.map((c) => <option key={c._id} value={c._id}>{c.nombre}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Estrellas</label>
                  <select value={hotelForm.estrellas} onChange={(e) => setHotelForm({ ...hotelForm, estrellas: +e.target.value })}>
                    {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} estrellas</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Precio por noche (EUR)</label>
                  <input type="number" value={hotelForm.precioPorNoche} onChange={(e) => setHotelForm({ ...hotelForm, precioPorNoche: +e.target.value })} min={0} required />
                </div>
              </>
            )}

            {tipo === 'VUELO' && (
              <>
                <div className="form-group">
                  <label>Aerolínea</label>
                  <input value={flightForm.aerolinea} onChange={(e) => setFlightForm({ ...flightForm, aerolinea: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Origen</label>
                  <input value={flightForm.origen} onChange={(e) => setFlightForm({ ...flightForm, origen: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Destino</label>
                  <input value={flightForm.destino} onChange={(e) => setFlightForm({ ...flightForm, destino: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Ciudad destino</label>
                  <select value={flightForm.ciudadDestino} onChange={(e) => setFlightForm({ ...flightForm, ciudadDestino: e.target.value })} required>
                    <option value="">Seleccionar</option>
                    {cities.map((c) => <option key={c._id} value={c._id}>{c.nombre}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Precio (EUR)</label>
                  <input type="number" value={flightForm.precio} onChange={(e) => setFlightForm({ ...flightForm, precio: +e.target.value })} min={0} required />
                </div>
              </>
            )}

            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar solicitud'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
