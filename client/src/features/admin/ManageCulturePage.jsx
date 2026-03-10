import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../dashboard/Dashboard.css';

export default function ManageCulturePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = () => {
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

  if (loading) return <LoadingSpinner />;

  return (
    <div>
        <h1 className="page-title">Gestionar cultura</h1>
        <table className="data-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Categoría</th>
              <th>Ciudad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article._id}>
                <td>{article.titulo}</td>
                <td>{article.categoria}</td>
                <td>{article.ciudad?.nombre || 'General'}</td>
                <td>
                  <div className="table-actions">
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
