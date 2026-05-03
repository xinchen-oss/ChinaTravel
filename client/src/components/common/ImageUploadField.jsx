import { useState } from 'react';
import api from '../../api/axios';
import { getImageUrl } from '../../utils/imageHelper';

export default function ImageUploadField({ value, onChange, label = 'Imagen' }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('imagen', file);
      const res = await api.post('/upload/imagen', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(res.data.data.url);
    } catch (err) {
      alert('Error subiendo imagen');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="form-group">
      <label>{label}</label>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        {value && (
          <img
            src={getImageUrl(value)}
            alt="Preview"
            style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
          />
        )}
        <div>
          <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} />
          {uploading && <p style={{ fontSize: '0.8rem', color: '#666' }}>Subiendo...</p>}
          {value && !uploading && (
            <button
              type="button"
              className="btn btn--outline btn--sm"
              style={{ marginTop: '8px' }}
              onClick={() => onChange('')}
            >
              Quitar imagen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
