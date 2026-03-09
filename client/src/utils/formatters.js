export const formatPrice = (price) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);

export const formatDate = (date) =>
  new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date));

export const formatStars = (count) => '★'.repeat(count) + '☆'.repeat(5 - count);
