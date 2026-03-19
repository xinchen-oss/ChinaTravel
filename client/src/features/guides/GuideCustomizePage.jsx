import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { formatPrice } from '../../utils/formatters';
import './Guides.css';

export default function GuideCustomizePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customizations, setCustomizations] = useState({});
  const [swapModal, setSwapModal] = useState({ open: false, activityId: null, categoria: null });
  const [alternatives, setAlternatives] = useState([]);
  const [loadingAlts, setLoadingAlts] = useState(false);

  useEffect(() => {
    api.get(`/guias/${id}`)
      .then((res) => setGuide(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const openSwapModal = async (activityId, categoria) => {
    setSwapModal({ open: true, activityId, categoria });
    setLoadingAlts(true);
    try {
      const res = await api.get(`/guias/${id}/actividades-alternativas`, {
        params: { categoria, exclude: activityId },
      });
      setAlternatives(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAlts(false);
    }
  };

  const selectAlternative = (newActivity) => {
    setCustomizations((prev) => ({ ...prev, [swapModal.activityId]: newActivity }));
    setSwapModal({ open: false, activityId: null, categoria: null });
  };

  const handleAccept = () => {
    // Build a map of oldActivityId -> full new activity object
    // Pass it back to the guide detail page via navigate state
    navigate(`/guias/${id}`, { state: { customizations } });
  };

  const handleCancel = () => {
    navigate(`/guias/${id}`);
  };

  if (loading) return <LoadingSpinner />;
  if (!guide) return <div className="page"><div className="container"><p>Guía no encontrada</p></div></div>;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Personalizar: {guide.titulo}</h1>
        <p className="page-subtitle">Haz clic en una actividad para intercambiarla por otra de la misma categoría</p>

        <div className="guide-detail__days">
          {guide.dias?.map((dia) => (
            <div key={dia.numeroDia} className="day-card">
              <h3 className="day-card__title">Día {dia.numeroDia}: {dia.titulo}</h3>
              <div className="day-card__activities">
                {dia.actividades?.map((slot, i) => {
                  const actId = slot.actividad?._id;
                  const swapped = customizations[actId];
                  const display = swapped || slot.actividad;
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
                        <h4>{display?.nombre} {swapped && '(modificada)'}</h4>
                        <p>{display?.descripcion}</p>
                        <span className="activity-slot__swap-hint">Clic para cambiar</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="customize-footer">
          <p>{Object.keys(customizations).length} actividad(es) modificada(s)</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleCancel} className="btn btn--outline btn--lg">
              Cancelar cambios
            </button>
            <button onClick={handleAccept} className="btn btn--primary btn--lg" disabled={Object.keys(customizations).length === 0}>
              Aceptar personalización
            </button>
          </div>
        </div>

        <Modal
          isOpen={swapModal.open}
          onClose={() => setSwapModal({ open: false, activityId: null, categoria: null })}
          title="Actividades alternativas"
        >
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
