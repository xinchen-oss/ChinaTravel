const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&q=80';
const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

export const getImageUrl = (url) => {
  if (!url) return FALLBACK_IMAGE;
  if (url.startsWith('http')) return url;
  // For relative paths like /uploads/filename, prepend API base if configured
  if (API_BASE && url.startsWith('/')) return `${API_BASE}${url}`;
  return url;
};

export const handleImageError = (e) => {
  e.target.src = FALLBACK_IMAGE;
};
