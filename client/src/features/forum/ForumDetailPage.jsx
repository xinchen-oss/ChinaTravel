import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/formatters';
import './Forum.css';

export default function ForumDetailPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  // cargar post
  useEffect(() => {

    const fetchPost = async () => {

      try {

        const res = await api.get(`/foro/${id}`);

        if (res.data.ok) {
          setPost(res.data.data.post);
          setReplies(res.data.data.replies);
        }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }

    };

    fetchPost();

  }, [id]);

  // cargar usuario
  useEffect(() => {

    if (token) {

      api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data.user))
      .catch(console.error);

    }

  }, [token]);

  // crear respuesta
  const handleReply = async (e) => {

    e.preventDefault();

    if (!replyText.trim()) return;

    if (!user) {
      alert('Debes iniciar sesión para responder');
      return;
    }

    try {

      const res = await api.post(
        `/foro/${id}/reply`,
        { contenido: replyText, autor: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReplies([...replies, res.data.data || res.data]);
      setReplyText('');

    } catch (error) {

      console.error(error);
      alert('No se pudo enviar la respuesta');

    }

  };

  // eliminar post
  const handleDeletePost = async () => {

    if (!window.confirm('¿Seguro que quieres eliminar este post?')) return;

    try {

      await api.delete(`/foro/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/foro');

    } catch (error) {

      console.error(error);
      alert('No se pudo eliminar el post');

    }

  };

  // eliminar respuesta
  const handleDeleteReply = async (replyId) => {

    if (!window.confirm('¿Eliminar este comentario?')) return;

    try {

      await api.delete(`/foro/reply/${replyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReplies(replies.filter(r => r._id !== replyId));

    } catch (error) {

      console.error(error);
      alert('No se pudo eliminar la respuesta');

    }

  };

  if (loading) return <LoadingSpinner />;

  if (!post) {
    return (
      <div className="page">
        <div className="container">
          <p>Post no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">

        <Link to="/foro" className="back-link">
          &larr; Volver al foro
        </Link>

        {/* POST */}
        <article className="forum-post">

          <header className="forum-post__header">

            <h1>{post.titulo}</h1>

            <div className="forum-post__meta">

              <span className="forum-post__author">
                {post.autor?.nombre || post.autor}
              </span>

              {post.ciudad && (
                <span className="forum-post__city">
                  {post.ciudad.nombre}
                </span>
              )}

              <time>
                {post.createdAt ? formatDate(post.createdAt) : ''}
              </time>

            </div>

            {user && (user.id === post.autor?._id || user.id === post.autor) && (
              <div className="forum-post-actions">
                <button
                  className="btn-delete-soft"
                  onClick={handleDeletePost}
                >
                  Eliminar
                </button>
              </div>
            )}

          </header>

          {post.imagen && (
            <img src={post.imagen} alt={post.titulo} className="forum-post__image" />
          )}

          <div className="forum-post__content">
            {post.contenido}
          </div>

        </article>

        {/* RESPUESTAS */}

        <section className="forum-replies">

          <h2>Respuestas ({replies.length})</h2>

          {replies.length === 0 ? (
            <p>Aún no hay respuestas</p>
          ) : (

            replies.map(reply => (

              <div key={reply._id} className="forum-reply">

                <div className="forum-reply__meta">

                  <strong>
                    {reply.autor?.nombre || reply.autor}
                  </strong>

                  <time>
                    {reply.createdAt ? formatDate(reply.createdAt) : ''}
                  </time>

                </div>

                <p>{reply.contenido}</p>

                {user && (user.id === reply.autor?._id || user.id === reply.autor) && (
                  <div className="forum-reply-actions">
                    <button
                      className="btn-delete-soft"
                      onClick={() => handleDeleteReply(reply._id)}
                    >
                      Eliminar
                    </button>
                  </div>
                )}

              </div>

            ))

          )}

        </section>

        {/* FORMULARIO RESPUESTA */}

        {user ? (

          <section className="forum-reply-form">

            <h3>Responder</h3>

            <form onSubmit={handleReply}>

              <textarea
                placeholder="Escribe tu respuesta..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                required
              />

              <button
                type="submit"
                className="btn btn-primary"
              >
                Enviar respuesta
              </button>

            </form>

          </section>

        ) : (

          <p>Inicia sesión para responder</p>

        )}

      </div>
    </div>
  );
}
