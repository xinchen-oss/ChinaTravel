import { useState, useEffect } from 'react';
import api from '../api/axios';

export const useRutas = (cityId) => {
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = cityId ? { ciudad: cityId } : {};
    api.get('/rutas', { params })
      .then((res) => setRutas(res.data.data))
      .catch((err) => setError(err.response?.data?.error || 'Error cargando rutas'))
      .finally(() => setLoading(false));
  }, [cityId]);

  return { rutas, loading, error };
};
