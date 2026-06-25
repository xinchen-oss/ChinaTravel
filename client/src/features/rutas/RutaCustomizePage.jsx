import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { formatPrice } from '../../utils/formatters';
import './Rutas.css';

const POR_LIBRE = {
  esPorLibre: true,
  nombre: 'Actividad por libre',
  descripcion: 'Tiempo libre — organiza tu propia actividad. No se cobra entrada.',
  precio: 0,
};

export default function RutaCustomizePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ruta, setRuta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customizations, setCustomizations] = useState({});
  const [swapModal, setSwapModal] = useState({ open: false, activityId: null, categoria: null });
  const [alternatives, setAlternatives] = useState([]);
  const [loadingAlts, setLoadingAlts] = useState(false);

  useEffect(() => {
    api.get(`/rutas/${id}`)
      .then((res) => setRuta(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const openSwapModal = async (activityId, categoria) => {
    setSwapModal({ open: true, activityId, categoria });
    setLoadingAlts(true);
    try {
      const res = await api.get(`/rutas/${id}/actividades-alternativas`, {
        params: { categoria, exclude: activityId },
      });
      setAlternatives(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAlts(false);
    }
  };

  const closeModal = () => setSwapModal({ open: false, activityId: null, categoria: null });

  const selectAlternative = (newActivity) => {
    setCustomizations((prev) => ({ ...prev, [swapModal.activityId]: newActivity }));
    closeModal();
  };

  const selectPorLibre = () => {
    setCustomizations((prev) => ({ ...prev, [swapModal.activityId]: { ...POR_LIBRE } }));
    closeModal();
  };

  const restoreOriginal = () => {
    setCustomizations((prev) => {
      const next = { ...prev };
      delete next[swapModal.activityId];
      return next;
    });
    closeModal();
  };

  const handleAccept = () => {
    // Pass map { oldActivityId: newActivityObject (or POR_LIBRE) } back to the ruta detail page.
    navigate(`/rutas/${id}`, { state: { customizations } });
  };

  const handleCancel = () => {
    navigate(`/rutas/${id}`);
  };

  if (loading) return <LoadingSpinner />;
  if (!ruta) return <div className="page"><div className="container"><p>Ruta no encontrada</p></div></div>;

  const numCambios = Object.keys(customizations).length;
  const isSwapped = customizations[swapModal.activityId] !== undefined;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Personalizar: {ruta.titulo}</h1>
        <p className="page-subtitle">Haz clic en una actividad para cambiarla por otra de la misma categoría o marcarla como actividad por libre</p>

        <div className="guide-detail__days">
          {ruta.dias?.map((dia) => (
            <div key={dia.numeroDia} className="day-card">
              <h3 className="day-card__title">Día {dia.numeroDia}: {dia.titulo}</h3>
              <div className="day-card__activities">
                {dia.actividades?.map((slot, i) => {
                  const actId = slot.actividad?._id;
                  const swapped = customizations[actId];
                  const display = swapped || slot.actividad;
                  const esPorLibre = display?.esPorLibre;
                  return (
                    <div
                      key={i}
                      className={`activity-slot activity-slot--clickable ${swapped ? 'activity-slot--swapped' : ''}`}
                      onClick={() => openSwapModal(actId, slot.actividad?.categoria)}
                    >
                      <div className="activity-slot__time">
                        {slot.horaInicio && <span>{slot.horaInicio} - {slot.horaFin}</span>}
                      </div>
                      <div className="activity-slot__info">
                        <h4>{display?.nombre} {swapped && (esPorLibre ? '(por libre)' : '(modificada)')}</h4>
                        <p>{display?.descripcion}</p>
                        <span className="activity-slot__swap-hint">
                          {esPorLibre ? 'Por libre · 0€ · Clic para cambiar' : `${formatPrice(display?.precio || 0)} · Clic para cambiar`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="customize-footer">
          <p>{numCambios} actividad(es) modificada(s)</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleCancel} className="btn btn--outline btn--lg">
              Cancelar cambios
            </button>
            <button onClick={handleAccept} className="btn btn--primary btn--lg" disabled={numCambios === 0}>
              Aceptar personalización
            </button>
          </div>
        </div>

        <Modal
          isOpen={swapModal.open}
          onClose={closeModal}
          title="Cambiar actividad"
        >
          {/* Free-activity option, always available */}
          <div className="alt-list" style={{ marginBottom: 'var(--space-md)' }}>
            <div className="alt-item" onClick={selectPorLibre} style={{ borderLeft: '4px solid var(--color-primary)' }}>
              <h4>🕊️ Actividad por libre</h4>
              <p>No te gusta esta actividad. Reserva el tiempo libre y organiza tú la visita.</p>
              <span>Sin coste · 0€</span>
            </div>
            {isSwapped && (
              <div className="alt-item" onClick={restoreOriginal}>
                <h4>↩️ Restaurar actividad original</h4>
                <p>Vuelve a la actividad incluida en la ruta.</p>
              </div>
            )}
          </div>

          <h4 style={{ margin: '0 0 8px' }}>Otras actividades de la categoría</h4>
          {loadingAlts ? (
            <LoadingSpinner />
          ) : alternatives.length === 0 ? (
            <p>No hay alternativas disponibles para esta categoría</p>
          ) : (
            <div className="alt-list">
              {alternatives.map((alt) => (
                <div key={alt._id} className="alt-item" onClick={() => selectAlternative(alt)}>
                  <h4>{alt.nombre}</h4>
                  <p>{alt.descripcion}</p>
                  <span>{alt.duracionHoras}h - {formatPrice(alt.precio)}</span>
                </div>
              ))}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
