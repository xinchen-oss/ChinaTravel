import { useCities } from '../../hooks/useCities';
import './CitySelector.css';

export default function CitySelector({ value, onChange, label = 'Ciudad' }) {
  const { cities, loading } = useCities();

  return (
    <div className="city-selector">
      <label className="city-selector__label">{label}</label>
      <select
        className="city-selector__select"
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        disabled={loading}
      >
        <option value="">Todas las ciudades</option>
        {cities.map((city) => (
          <option key={city._id} value={city._id}>{city.nombre}</option>
        ))}
      </select>
    </div>
  );
}
