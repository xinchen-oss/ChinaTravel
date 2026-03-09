import { useState, useEffect } from 'react';
import api from '../api/axios';

export const useCulture = (filters = {}) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = {};
    if (filters.ciudad) params.ciudad = filters.ciudad;
    if (filters.categoria) params.categoria = filters.categoria;

    api.get('/cultura', { params })
      .then((res) => setArticles(res.data.data))
      .catch((err) => setError(err.response?.data?.error || 'Error cargando artículos'))
      .finally(() => setLoading(false));
  }, [filters.ciudad, filters.categoria]);

  return { articles, loading, error };
};
