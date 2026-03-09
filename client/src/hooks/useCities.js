import { useState, useEffect } from 'react';
import api from '../api/axios';

export const useCities = (featured = false) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = featured ? '/ciudades/destacadas' : '/ciudades';
    api.get(url)
      .then((res) => setCities(res.data.data))
      .catch((err) => setError(err.response?.data?.error || 'Error cargando ciudades'))
      .finally(() => setLoading(false));
  }, [featured]);

  return { cities, loading, error };
};
