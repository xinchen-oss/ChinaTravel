import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CitySelector from '../../components/common/CitySelector';
import ImageUploadField from '../../components/common/ImageUploadField';
import { CULTURE_CATEGORIES } from '../../utils/constants';
import { getImageUrl } from '../../utils/imageHelper';
import '../dashboard/Dashboard.css';

const emptyForm = { titulo: '', contenido: '', resumen: '', ciudad: '', categoria: '', imagen: '' };

export default function ManageCulturePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = list, 'new' = create, id = edit
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchArticles = () => {
    setLoading(true);
    api.get('/cultura')
      .then((res) => setArticles(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este artículo?')) return;
    try {
      await api.delete(`/cultura/${id}`);
      fetchArticles();
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await api.get(`/cultura/${id}`);
      const a = res.data.data;
      setForm({
        titulo: a.titulo || '',
        contenido: a.contenido || '',
        resumen: a.resumen || '',
        ciudad: a.ciudad?._id || '',
        categoria: a.categoria || '',
        imagen: a.imagen || '',
      });
      setEditing(id);
      setError('');
    } catch (err) {
      alert('Error cargando artículo');
    }
  };

  const handleNew = () => {
    setForm(emptyForm);
    setEditing('new');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const data = { ...form };
      if (!data.ciudad) delete data.ciudad;
      if (editing === 'new') {
        await api.post('/cultura', data);
      } else {
        await api.put(`/cultura/${editing}`, data);
      }
      setEditing(null);
      fetchArticles();
    } catch (err) {
      setError(err.response?.data?.error || 'Error guardando');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  // Edit/Create form
  if (editing !== null) {
    return (
      <div>
        <h1 className="page-title">{editing === 'new' ? 'Nuevo artículo' : 'Editar artículo'}</h1>
        <form onSubmit={handleSubmit} className="submission-form" style={{ maxWidth: '700px' }}>
          {error && <div className="auth-error">{error}</div>}

          <ImageUploadField
            value={form.imagen}
            onChange={(url) => setForm({ ...form, imagen: url })}
          />

          <div className="form-group">
            <label>Título *</label>
            <input
              type="text"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Resumen</label>
            <input
              type="text"
              value={form.resumen}
              onChange={(e) => setForm({ ...form, resumen: e.target.value })}
              placeholder="Breve descripción del artículo"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Categoría *</label>
              <select
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                required
              >
                <option value="">Seleccionar</option>
                {CULTURE_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <CitySelector
              value={form.ciudad}
              onChange={(val) => setForm({ ...form, ciudad: val || '' })}
            />
          </div>

          <div className="form-group">
            <label>Contenido *</label>
            <textarea
              value={form.contenido}
              onChange={(e) => setForm({ ...form, contenido: e.target.value })}
              required
              rows={10}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button type="button" className="btn btn--outline" onClick={() => setEditing(null)}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    );
  }

  // List view
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Gestionar cultura</h1>
        <button className="btn btn--primary" onClick={handleNew}>+ Nuevo artículo</button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Título</th>
            <th>Categoría</th>
            <th>Ciudad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article._id}>
              <td>
                <img
                  src={getImageUrl(article.imagen, article._id)}
                  alt=""
                  style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                />
              </td>
              <td>{article.titulo}</td>
              <td>{article.categoria}</td>
              <td>{article.ciudad?.nombre || 'General'}</td>
              <td>
                <div className="table-actions">
                  <button className="btn btn--outline btn--sm" onClick={() => handleEdit(article._id)}>Editar</button>
                  <button className="btn btn--danger btn--sm" onClick={() => handleDelete(article._id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
