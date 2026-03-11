import { useState, useEffect } from 'react';
import api from '../api/axios';

export const useForum = (filters = {}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = {};
    if (filters.ciudad) params.ciudad = filters.ciudad;
    if (filters.search) params.search = filters.search; // para búsqueda de texto

    api.get('/foro', { params })
      .then((res) => setPosts(res.data.data))
      .catch((err) =>
        setError(err.response?.data?.error || 'Error cargando posts')
      )
      .finally(() => setLoading(false));
  }, [filters.ciudad, filters.search]);

  return { posts, loading, error };
};
