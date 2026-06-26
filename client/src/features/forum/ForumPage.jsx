import { useState } from 'react';
import { useForum } from '../../hooks/useForum.js';
import { useCities } from '../../hooks/useCities.js';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ImageUploadField from '../../components/common/ImageUploadField';
import { getImageUrl } from '../../utils/imageHelper';
import './Forum.css';

export default function ForumPage() {
  // Filtro por ciudad (el hook re-consulta al cambiar)
  const [filtroCiudad, setFiltroCiudad] = useState('');
  const { posts, loading } = useForum({ ciudad: filtroCiudad });
  const { cities } = useCities();

  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({
    titulo: '',
    contenido: '',
    ciudad: '',
    imagen: '',
  });
  const [error, setError] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const isAdmin = user?.role === 'ADMIN';
  const canCreatePost = token && (user?.role === 'USER' || isAdmin);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.contenido) {
      setError('El contenido es obligatorio');
      return;
    }

    setLoadingSubmit(true);
    setError('');
    try {
      await api.post(
        '/foro',
        {
          titulo: newPost.titulo,
          contenido: newPost.contenido,
          ciudad: newPost.ciudad || null,
          imagen: newPost.imagen || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowModal(false);
      setNewPost({ titulo: '', contenido: '', ciudad: '', imagen: '' });
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError('No se pudo crear el post');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <>
      <section className="forum-banner">
        <div className="forum-banner__overlay" />
        <div className="container forum-banner__content">
          <h1>Foro de viajeros</h1>
          <p>Descubre la cultura de China y comparte tus experiencias, consejos y preguntas</p>
        </div>
      </section>

      <div className="page">
        <div className="container">

          {/* BARRA DE ACCIONES: crear post + filtro por ciudad */}
          <div className="forum-toolbar">
            {canCreatePost && (
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                {isAdmin ? '✦ Publicar post oficial' : 'Crear Post'}
              </button>
            )}

            <div className="forum-filter">
              <label htmlFor="forum-city-filter">Filtrar por ciudad:</label>
              <select
                id="forum-city-filter"
                value={filtroCiudad}
                onChange={(e) => setFiltroCiudad(e.target.value)}
              >
                <option value="">Todas las ciudades</option>
                {cities.map((c) => (
                  <option key={c._id} value={c._id}>{c.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* MODAL CREAR POST */}
          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)} role="presentation">
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="forum-modal-title"
              >
                <h2 id="forum-modal-title">
                  {isAdmin ? 'Publicar post oficial' : 'Comparte tu experiencia'}
                </h2>
                {isAdmin && (
                  <p className="forum-modal-hint">
                    Este post se mostrará como contenido <strong>oficial</strong> del equipo ChinaTravel.
                  </p>
                )}

                {error && <div className="auth-error" role="alert">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Título (opcional)</label>
                    <input
                      value={newPost.titulo}
                      onChange={(e) => setNewPost({ ...newPost, titulo: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>{isAdmin ? 'Contenido' : '¿Qué quieres contar?'}</label>
                    <textarea
                      value={newPost.contenido}
                      onChange={(e) => setNewPost({ ...newPost, contenido: e.target.value })}
                      placeholder={isAdmin ? '' : 'Cuenta tu experiencia, tus sensaciones, consejos...'}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Ciudad</label>
                    <select
                      value={newPost.ciudad}
                      onChange={(e) => setNewPost({ ...newPost, ciudad: e.target.value })}
                    >
                      <option value="">Seleccionar</option>
                      {cities.map((c) => (
                        <option key={c._id} value={c._id}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>

                  {/* Foto opcional */}
                  <ImageUploadField
                    label="Foto (opcional)"
                    value={newPost.imagen}
                    onChange={(url) => setNewPost({ ...newPost, imagen: url })}
                  />

                  <div style={{ marginTop: '1rem' }}>
                    <button type="submit" className="btn btn-success" disabled={loadingSubmit}>
                      {loadingSubmit ? 'Publicando...' : 'Publicar'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                      style={{ marginLeft: '0.5rem' }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* POSTS */}
          {loading ? (
            <LoadingSpinner />
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <h3>No hay posts todavía</h3>
              <p>Sé el primero en iniciar una conversación</p>
            </div>
          ) : (
            <div className="grid grid-3">
              {posts.map((post) => {
                const oficial = post.oficial || post.autor?.role === 'ADMIN';
                return (
                  <Card
                    key={post._id}
                    to={`/foro/${post._id}`}
                    title={post.titulo || (oficial ? 'Publicación oficial' : 'Experiencia de viajero')}
                    image={getImageUrl(post.imagen, post._id)}
                    badge={oficial ? '✦ Oficial' : null}
                    className={oficial ? 'forum-card forum-card--oficial' : 'forum-card forum-card--user'}
                  >
                    <p className="card__subtitle">
                      {post.contenido.substring(0, 120)}
                      {post.contenido.length > 120 ? '…' : ''}
                    </p>

                    <div className="forum-meta">
                      <span className="forum-author">
                        {oficial ? 'Equipo ChinaTravel' : (post.autor?.nombre || 'Viajero')}
                      </span>
                      {post.ciudad && <span className="forum-city">{post.ciudad.nombre}</span>}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
