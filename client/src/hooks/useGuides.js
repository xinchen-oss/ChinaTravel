import { useState, useEffect } from 'react';
import api from '../api/axios';

export const useGuides = (cityId) => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = cityId ? { ciudad: cityId } : {};
    api.get('/guias', { params })
      .then((res) => setGuides(res.data.data))
      .catch((err) => setError(err.response?.data?.error || 'Error cargando guías'))
      .finally(() => setLoading(false));
  }, [cityId]);

  return { guides, loading, error };
};
