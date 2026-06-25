import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useCities } from '../../hooks/useCities';
import { SUBMISSION_TYPES, ACTIVITY_CATEGORIES } from '../../utils/constants';
import { formatPrice } from '../../utils/formatters';
import '../dashboard/Dashboard.css';
import '../auth/Auth.css';

const emptyDay = () => ({ titulo: '', actividades: [{ actividad: '', horaInicio: '', horaFin: '' }] });

export default function SubmitContentPage() {
  const navigate = useNavigate();
  const { cities } = useCities();
  const [tipo, setTipo] = useState('ACTIVIDAD');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Activity fields
  const [actForm, setActForm] = useState({ nombre: '', descripcion: '', ciudad: '', categoria: 'CULTURAL', duracionHoras: 2, precio: '' });

  // Ruta builder fields
  const [rutaForm, setRutaForm] = useState({ titulo: '', descripcion: '', ciudad: '' });
  const [dias, setDias] = useState([emptyDay()]);
  const [cityActivities, setCityActivities] = useState([]);

  // Image
  const [imagen, setImagen] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Load activities for the ruta's city so the comercial can pick them per day.
  useEffect(() => {
    if (tipo !== 'RUTA' || !rutaForm.ciudad) { setCityActivities([]); return; }
    api.get('/actividades', { params: { ciudad: rutaForm.ciudad } })
      .then((res) => setCityActivities(res.data.data))
      .catch(() => setCityActivities([]));
  }, [tipo, rutaForm.ciudad]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ── Ruta builder helpers ──
  const addDay = () => setDias((prev) => [...prev, emptyDay()]);
  const removeDay = (di) => setDias((prev) => prev.filter((_, i) => i !== di));
  const setDayTitle = (di, value) => setDias((prev) => prev.map((d, i) => (i === di ? { ...d, titulo: value } : d)));
  const addSlot = (di) => setDias((prev) => prev.map((d, i) => (i === di ? { ...d, actividades: [...d.actividades, { actividad: '', horaInicio: '', horaFin: '' }] } : d)));
  const removeSlot = (di, si) => setDias((prev) => prev.map((d, i) => (i === di ? { ...d, actividades: d.actividades.filter((_, j) => j !== si) } : d)));
  const setSlot = (di, si, field, value) =>
    setDias((prev) => prev.map((d, i) => (i === di
      ? { ...d, actividades: d.actividades.map((a, j) => (j === si ? { ...a, [field]: value } : a)) }
      : d)));

  const rutaTotal = dias.reduce((t, d) => t + d.actividades.reduce((s, a) => {
    const act = cityActivities.find((x) => x._id === a.actividad);
    return s + (act?.precio || 0);
  }, 0), 0);

  const buildRutaContenido = () => ({
    titulo: rutaForm.titulo,
    descripcion: rutaForm.descripcion,
    ciudad: rutaForm.ciudad,
    duracionDias: dias.length,
    dias: dias.map((d, di) => ({
      numeroDia: di + 1,
      titulo: d.titulo || `Día ${di + 1}`,
      actividades: d.actividades
        .filter((a) => a.actividad)
        .map((a, ai) => ({ actividad: a.actividad, orden: ai + 1, horaInicio: a.horaInicio || undefined, horaFin: a.horaFin || undefined })),
    })),
  });

  const validateRuta = () => {
    if (!rutaForm.titulo.trim()) return 'Indica el título de la ruta';
    if (!rutaForm.ciudad) return 'Selecciona la ciudad';
    const totalActs = dias.reduce((n, d) => n + d.actividades.filter((a) => a.actividad).length, 0);
    if (totalActs === 0) return 'Añade al menos una actividad a la ruta';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let contenido;
    if (tipo === 'ACTIVIDAD') {
      contenido = { ...actForm, duracionHoras: Number(actForm.duracionHoras), precio: Number(actForm.precio) };
    } else {
      const err = validateRuta();
      if (err) { setError(err); return; }
      contenido = buildRutaContenido();
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('tipoContenido', tipo);
      formData.append('contenido', JSON.stringify(contenido));
      if (imagen) formData.append('imagen', imagen);

      await api.post('/solicitudes', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
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
                <input type="number" value={actForm.duracionHoras} onChange={(e) => setActForm({ ...actForm, duracionHoras: e.target.value })} min={0.5} step={0.5} required />
              </div>
              <div className="form-group">
                <label>Precio de la entrada (EUR) — 0 si es gratuita</label>
                <input type="number" value={actForm.precio} onChange={(e) => setActForm({ ...actForm, precio: e.target.value })} min={0} required />
              </div>
            </>
          )}

          {tipo === 'RUTA' && (
            <>
              <div className="form-group">
                <label>Título de la ruta</label>
                <input value={rutaForm.titulo} onChange={(e) => setRutaForm({ ...rutaForm, titulo: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea value={rutaForm.descripcion} onChange={(e) => setRutaForm({ ...rutaForm, descripcion: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Ciudad</label>
                <select value={rutaForm.ciudad} onChange={(e) => setRutaForm({ ...rutaForm, ciudad: e.target.value })} required>
                  <option value="">Seleccionar</option>
                  {cities.map((c) => <option key={c._id} value={c._id}>{c.nombre}</option>)}
                </select>
              </div>

              {!rutaForm.ciudad ? (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Selecciona una ciudad para añadir actividades al itinerario.</p>
              ) : cityActivities.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>No hay actividades en esta ciudad todavía. Crea actividades primero.</p>
              ) : (
                <>
                  <h3 style={{ marginTop: 'var(--space-md)' }}>Itinerario</h3>
                  {dias.map((dia, di) => (
                    <div key={di} style={{ border: '1px solid var(--color-border, #e5e7eb)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 10 }}>
                        <div className="form-group" style={{ flex: 1, margin: 0 }}>
                          <label>Día {di + 1} — título</label>
                          <input value={dia.titulo} onChange={(e) => setDayTitle(di, e.target.value)} placeholder={`Ej: Día ${di + 1} en la ciudad`} />
                        </div>
                        {dias.length > 1 && (
                          <button type="button" className="btn btn--danger btn--sm" onClick={() => removeDay(di)}>Quitar día</button>
                        )}
                      </div>

                      {dia.actividades.map((slot, si) => (
                        <div key={si} style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 8, flexWrap: 'wrap' }}>
                          <div className="form-group" style={{ flex: 2, margin: 0, minWidth: 200 }}>
                            <label>Actividad</label>
                            <select value={slot.actividad} onChange={(e) => setSlot(di, si, 'actividad', e.target.value)}>
                              <option value="">Seleccionar actividad</option>
                              {cityActivities.map((a) => (
                                <option key={a._id} value={a._id}>{a.nombre} — {a.precio > 0 ? formatPrice(a.precio) : 'Gratis'}</option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group" style={{ margin: 0, width: 110 }}>
                            <label>Inicio</label>
                            <input type="time" value={slot.horaInicio} onChange={(e) => setSlot(di, si, 'horaInicio', e.target.value)} />
                          </div>
                          <div className="form-group" style={{ margin: 0, width: 110 }}>
                            <label>Fin</label>
                            <input type="time" value={slot.horaFin} onChange={(e) => setSlot(di, si, 'horaFin', e.target.value)} />
                          </div>
                          {dia.actividades.length > 1 && (
                            <button type="button" className="btn btn--outline btn--sm" onClick={() => removeSlot(di, si)}>✕</button>
                          )}
                        </div>
                      ))}
                      <button type="button" className="btn btn--outline btn--sm" onClick={() => addSlot(di)}>+ Añadir actividad</button>
                    </div>
                  ))}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <button type="button" className="btn btn--outline btn--sm" onClick={addDay}>+ Añadir día</button>
                    <strong>Precio total (entradas): {formatPrice(rutaTotal)}</strong>
                  </div>
                </>
              )}
            </>
          )}

          {/* Image upload */}
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
