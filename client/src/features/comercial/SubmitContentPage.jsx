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
  const [flightForm, setFlightForm] = useState({ aerolinea: '', origen: 'Madrid', destino: '', ciudadDestino: '', precio: 0, horaSalida: '', horaLlegada: '', duracionHoras: '' });
  // Image
  const [imagen, setImagen] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let contenido;
      if (tipo === 'ACTIVIDAD') contenido = actForm;
      else if (tipo === 'HOTEL') contenido = hotelForm;
      else contenido = flightForm;

      const formData = new FormData();
      formData.append('tipoContenido', tipo);
      formData.append('contenido', JSON.stringify(contenido));
      if (imagen) {
        formData.append('imagen', imagen);
      }

      await api.post('/solicitudes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/comercial');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Hora salida</label>
                    <input type="time" value={flightForm.horaSalida} onChange={(e) => setFlightForm({ ...flightForm, horaSalida: e.target.value })} required />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Hora llegada</label>
                    <input value={flightForm.horaLlegada} onChange={(e) => setFlightForm({ ...flightForm, horaLlegada: e.target.value })} placeholder="Ej: 05:30+1" required />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Duración (h)</label>
                    <input type="number" value={flightForm.duracionHoras} onChange={(e) => setFlightForm({ ...flightForm, duracionHoras: +e.target.value })} min={1} step={0.5} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Precio (EUR)</label>
                  <input type="number" value={flightForm.precio} onChange={(e) => setFlightForm({ ...flightForm, precio: +e.target.value })} min={0} required />
                </div>
              </>
            )}

            {/* Image upload for all types */}
            <div className="form-group">
              <label>Imagen (opcional)</label>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
              {imagePreview && (
                <div style={{ marginTop: '8px' }}>
                  <img src={imagePreview} alt="Vista previa" style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                  <button type="button" onClick={() => { setImagen(null); setImagePreview(null); }} style={{ display: 'block', marginTop: '4px', fontSize: '0.8rem', color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Eliminar imagen
                  </button>
                </div>
              )}
              <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '4px' }}>Formatos: JPG, PNG, WebP. Máximo 5MB.</p>
            </div>

            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar solicitud'}
            </button>
          </form>
        </div>
    </div>
  );
}
