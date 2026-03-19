const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&q=80';
const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

// Pool of unique China-themed images for culture articles
const CULTURE_IMAGES_POOL = [
  'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=600&q=80',  // lanterns festival
  'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80',  // chinese food
  'https://images.unsplash.com/photo-1528164344705-47542687000d?w=600&q=80', // temple
  'https://images.unsplash.com/photo-1553808991-e39e7611442c?w=600&q=80',  // great wall
  'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&q=80', // calligraphy
  'https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=600&q=80', // writing
  'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=600&q=80',  // forbidden city
  'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&q=80', // dragon boat
  'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=600&q=80', // pagoda
  'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?w=600&q=80', // chinese garden
  'https://images.unsplash.com/photo-1504457047772-27faf1c00561?w=600&q=80', // shanghai skyline
  'https://images.unsplash.com/photo-1533050487297-09b450131914?w=600&q=80', // tea ceremony
  'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=600&q=80', // dumpling
  'https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=600&q=80',  // red lantern street
  'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=600&q=80', // terracotta warriors
  'https://images.unsplash.com/photo-1559564484-e48b3e040ff4?w=600&q=80', // li river guilin
  'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80', // beijing hutong
  'https://images.unsplash.com/photo-1569074187119-c87815b476da?w=600&q=80', // chinese architecture
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80', // opera mask
  'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&q=80', // neon asia street
  'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=600&q=80', // mountain landscape
  'https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?w=600&q=80', // rice terraces
];

export const getImageUrl = (url, uniqueKey) => {
  if (!url) {
    if (uniqueKey) {
      // Use uniqueKey to pick a different image from the pool for each item
      let hash = 0;
      for (let i = 0; i < uniqueKey.length; i++) {
        hash = ((hash << 5) - hash) + uniqueKey.charCodeAt(i);
        hash |= 0;
      }
      return CULTURE_IMAGES_POOL[Math.abs(hash) % CULTURE_IMAGES_POOL.length];
    }
    return FALLBACK_IMAGE;
  }
  if (url.startsWith('http')) return url;
  if (API_BASE && url.startsWith('/')) return `${API_BASE}${url}`;
  return url;
};

export const getCultureImageUrl = (url, categoria, index = 0) => {
  if (url) return getImageUrl(url);
  return CULTURE_IMAGES_POOL[index % CULTURE_IMAGES_POOL.length];
};

export const handleImageError = (e) => {
  // Pick a unique fallback based on alt text so broken images don't all look the same
  const alt = e.target.alt || '';
  let hash = 0;
  for (let i = 0; i < alt.length; i++) {
    hash = ((hash << 5) - hash) + alt.charCodeAt(i);
    hash |= 0;
  }
  e.target.src = CULTURE_IMAGES_POOL[Math.abs(hash) % CULTURE_IMAGES_POOL.length];
};
