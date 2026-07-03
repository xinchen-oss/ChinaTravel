import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../dashboard/Dashboard.css';

export default function ManageReviewsPage() {
  const [forumPosts, setForumPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/foro/admin/moderacion');
      setForumPosts(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Error al cargar la moderación');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const blockedPosts = forumPosts.filter((item) => !item.parentPost);
  const blockedComments = forumPosts.filter((item) => item.parentPost);

  const handleUnblockContent = async (id) => {
    if (!confirm('¿Desbloquear este contenido del foro?')) return;
    try {
      await api.put(`/foro/${id}/moderate`, { bloqueado: false });
      setForumPosts((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  const renderList = (items, emptyText, label) => {
    if (items.length === 0) {
      return (
        <div className="empty-state">
          <h3>{emptyText}</h3>
        </div>
      );
    }

    return (
      <div className="orders-list">
        {items.map((item) => (
          <div key={item._id} className="order-card-full" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <strong>{item.autor?.nombre || 'Usuario'}</strong>
                  <span className="badge badge--danger">Bloqueado</span>
                  <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{label}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                  {item.titulo ? `Título: ${item.titulo}` : 'Contenido del foro'}
                </p>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{item.contenido}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button className="btn btn--outline btn--sm" onClick={() => handleUnblockContent(item._id)}>Desbloquear</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1 className="page-title">Moderación de reseñas</h1>
      <p style={{ color: '#6b7280', marginBottom: '16px' }}>
        Selecciona qué tipo de contenido bloqueado quieres revisar.
      </p>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <button
              className={`btn ${activeTab === 'posts' ? 'btn--primary' : 'btn btn--outline'}`}
              onClick={() => setActiveTab('posts')}
            >
              Posts bloqueados
            </button>
            <button
              className={`btn ${activeTab === 'comments' ? 'btn--primary' : 'btn btn--outline'}`}
              onClick={() => setActiveTab('comments')}
            >
              Comentarios bloqueados
            </button>
          </div>

          {activeTab === 'posts' ? (
            blockedPosts.length > 0 ? renderList(blockedPosts, '', 'Post') : (
              <div className="empty-state">
                <h3>No hay posts bloqueados</h3>
              </div>
            )
          ) : blockedComments.length > 0 ? (
            renderList(blockedComments, '', 'Comentario')
          ) : (
            <div className="empty-state">
              <h3>No hay comentarios bloqueados</h3>
            </div>
          )}
        </>
      )}
    </div>
  );
}
