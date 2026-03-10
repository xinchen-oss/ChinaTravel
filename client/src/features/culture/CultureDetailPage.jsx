import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/formatters';
import { getImageUrl, handleImageError } from '../../utils/imageHelper';
import './Culture.css';

export default function CultureDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/cultura/${id}`)
      .then((res) => setArticle(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!article) return <div className="page"><div className="container"><p>Artículo no encontrado</p></div></div>;

  return (
    <div className="page">
      <div className="container">
        <Link to="/cultura" className="back-link">&larr; Volver a cultura</Link>
        <article className="culture-article">
          <header className="culture-article__header">
            <span className="culture-article__category">{article.categoria}</span>
            <h1>{article.titulo}</h1>
            {article.ciudad && <p className="culture-article__city">{article.ciudad.nombre}</p>}
            <time>{formatDate(article.createdAt)}</time>
          </header>
          {article.imagen && <img src={getImageUrl(article.imagen)} alt={article.titulo} className="culture-article__image" onError={handleImageError} />}
          <div className="culture-article__content" dangerouslySetInnerHTML={{ __html: article.contenido }} />
        </article>
      </div>
    </div>
  );
}
