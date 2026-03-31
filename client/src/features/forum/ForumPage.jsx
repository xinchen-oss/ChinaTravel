import { useState } from 'react';
import { useForum } from '../../hooks/useForum.js';
import { useCities } from '../../hooks/useCities.js';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getImageUrl } from '../../utils/imageHelper';
import './Forum.css';

export default function ForumPage() {

  const { posts, loading } = useForum({});
  const { cities } = useCities();

  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({
    titulo: '',
    contenido: '',
    ciudad: '',
    imagen: null
  });

  const [error] = useState('');
  const [loadingSubmit] = useState(false);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const canCreatePost =
    token && (user?.role === 'USER' || user?.role === 'ADMIN');

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!newPost.contenido) {
      return alert('El contenido es obligatorio');
    }

    try {
      const response = await fetch('/api/foro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo: newPost.titulo,
          contenido: newPost.contenido,
          ciudad: newPost.ciudad,
        })
      });

      if (!response.ok) throw new Error('Error creando post');

      setShowModal(false);

      setNewPost({
        titulo: '',
        contenido: '',
        ciudad: '',
        imagen: null
      });

      window.location.reload();

    } catch (error) {
      console.error(error);
      alert('No se pudo crear el post');
    }
  };

  return (
    <>
      <section className="forum-banner">
        <div className="forum-banner__overlay" />
        <div className="container forum-banner__content">
          <h1>Foro de viajeros</h1>
          <p>Comparte tus experiencias, consejos y preguntas sobre viajar a China</p>
        </div>
      </section>
    <div className="page">
      <div className="container">

        {/* BOTÓN CREAR POST SOLO SI USER O ADMIN */}
        {canCreatePost && (
          <div style={{ marginBottom: '1rem' }}>
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              Crear Post
            </button>
          </div>
        )}

        {/* MODAL */}
        {showModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowModal(false)}
            role="presentation"
          >

            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="forum-modal-title"
            >

              <h2 id="forum-modal-title">Crear nuevo post</h2>

              {error && <div className="auth-error" role="alert">{error}</div>}

              <form onSubmit={handleSubmit}>

                <div className="form-group">
                  <label>Título (opcional)</label>
                  <input
                    value={newPost.titulo}
                    onChange={(e) =>
                      setNewPost({
                        ...newPost,
                        titulo: e.target.value
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Contenido</label>
                  <textarea
                    value={newPost.contenido}
                    onChange={(e) =>
                      setNewPost({
                        ...newPost,
                        contenido: e.target.value
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Ciudad</label>

                  <select
                    value={newPost.ciudad}
                    onChange={(e) =>
                      setNewPost({
                        ...newPost,
                        ciudad: e.target.value
                      })
                    }
                  >

                    <option value="">Seleccionar</option>

                    {cities.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.nombre}
                      </option>
                    ))}

                  </select>
                </div>

                <div style={{ marginTop: '1rem' }}>

                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={loadingSubmit}
                  >
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

            {posts.map((post, index) => (

              <Card
                key={post._id}
                to={`/foro/${post._id}`}
                title={post.titulo}
                image={getImageUrl(post.imagen, post._id)}
              >

                <p className="card__subtitle">
                  {post.contenido.substring(0, 120)}...
                </p>

                <div className="forum-meta">

                  <span className="forum-author">
                    {post.autor?.nombre || post.autor}
                  </span>

                  {post.ciudad && (
                    <span className="forum-city">
                      {post.ciudad.nombre}
                    </span>
                  )}

                </div>

              </Card>

            ))}

          </div>

        )}

      </div>
    </div>
    </>
  );
}
