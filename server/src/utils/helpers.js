export const formatPrice = (price) => `${Number(price).toFixed(2)}€`;

// A Ruta's price is the sum of the ticket prices of the activities in its itinerary.
// Free attractions (precio 0) and "actividad por libre" slots contribute 0.
// Accepts a ruta whose `dias[].actividades[].actividad` are either populated
// Activity docs or plain objects with a `precio` field.
export const computeRutaPrice = (dias = []) =>
  dias.reduce(
    (total, dia) =>
      total +
      (dia.actividades || []).reduce((sum, slot) => {
        const act = slot?.actividad;
        if (!act || act.esPorLibre) return sum;
        const precio = typeof act === 'object' ? act.precio : undefined;
        return sum + (Number(precio) || 0);
      }, 0),
    0
  );
