import { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatPrice } from '../../utils/formatters';
import '../dashboard/Dashboard.css';

export default function ManagePublicationsPage() {
  const [rutas, setRutas] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [activeTab, setActiveTab] = useState('rutas');
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [priceDraft, setPriceDraft] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rutasRes, actividadesRes] = await Promise.all([
        api.get('/rutas/mis-rutas'),
        api.get('/actividades/mis-actividades'),
      ]);
      setRutas(rutasRes.data.data || []);
      setActividades(actividadesRes.data.data || []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Error al cargar tus publicaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const togglePublication = async (type, item) => {
    const action = item.isActive ? 'desactivar' : 'activar';
    if (!window.confirm(`¿${action[0].toUpperCase() + action.slice(1)} esta publicación?`)) return;

    setSavingId(item._id);
    try {
      const endpoint = type === 'ruta' ? `/rutas/${item._id}` : `/actividades/${item._id}`;
      await api.put(endpoint, { isActive: !item.isActive });
      if (type === 'ruta') {
        setRutas((prev) => prev.map((x) => (x._id === item._id ? { ...x, isActive: !x.isActive } : x)));
      } else {
        setActividades((prev) => prev.map((x) => (x._id === item._id ? { ...x, isActive: !x.isActive } : x)));
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Error al actualizar el estado');
    } finally {
      setSavingId(null);
    }
  };

  const startEditingActivity = (activity) => {
    setEditingActivityId(activity._id);
    setPriceDraft(String(activity.precio ?? 0));
  };

  const cancelEditingActivity = () => {
    setEditingActivityId(null);
    setPriceDraft('');
  };

  const saveActivityPrice = async (activity) => {
    const parsedPrice = Number(priceDraft);
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      alert('Introduce un precio válido');
      return;
    }

    setSavingId(activity._id);
    try {
      const res = await api.put(`/actividades/${activity._id}`, { precio: parsedPrice });
      setActividades((prev) => prev.map((item) => (item._id === activity._id ? { ...item, precio: res.data.data?.precio ?? parsedPrice } : item)));
      setEditingActivityId(null);
      setPriceDraft('');
    } catch (err) {
      alert(err.response?.data?.error || 'Error al actualizar el precio');
    } finally {
      setSavingId(null);
    }
  };

  const renderList = (items, type) => {
    if (!items.length) {
      return (
        <div className="empty-state">
          <h3>No hay {type === 'ruta' ? 'rutas' : 'actividades'} para mostrar</h3>
        </div>
      );
    }

    return (
      <div className="orders-list">
        {items.map((item) => (
          <div key={item._id} className="order-card-full" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <strong>{item.titulo || item.nombre}</strong>
                  <span className={`badge ${item.isActive ? 'badge--success' : 'badge--danger'}`}>
                    {item.isActive ? 'Activa' : 'Desactivada'}
                  </span>
                  {item.ciudad?.nombre && <span style={{ color: '#6b7280' }}>{item.ciudad.nombre}</span>}
                </div>
                <p style={{ color: '#6b7280', marginBottom: '8px' }}>{item.descripcion}</p>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  {type === 'ruta' ? `Duración: ${item.duracionDias} días` : `Precio: ${formatPrice(item.precio)}`}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {type === 'actividad' && editingActivityId === item._id ? (
                  <>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={priceDraft}
                      onChange={(e) => setPriceDraft(e.target.value)}
                      style={{ width: '110px', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                    />
                    <button className="btn btn--primary btn--sm" onClick={() => saveActivityPrice(item)} disabled={savingId === item._id}>Guardar</button>
                    <button className="btn btn--outline btn--sm" onClick={cancelEditingActivity}>Cancelar</button>
                  </>
                ) : (
                  <>
                    {type === 'actividad' && (
                      <button className="btn btn--outline btn--sm" onClick={() => startEditingActivity(item)}>
                        Editar
                      </button>
                    )}
                    <button
                      className="btn btn--outline btn--sm"
                      onClick={() => togglePublication(type, item)}
                      disabled={savingId === item._id}
                    >
                      {item.isActive ? 'Desactivar' : 'Activar'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const summary = useMemo(() => ({
    rutas: rutas.filter((x) => x.isActive).length,
    rutasInactivas: rutas.filter((x) => !x.isActive).length,
    actividades: actividades.filter((x) => x.isActive).length,
    actividadesInactivas: actividades.filter((x) => !x.isActive).length,
  }), [rutas, actividades]);

  return (
    <div>
      <h1 className="page-title">Mis publicaciones</h1>
      <p className="page-subtitle">Gestiona tus rutas y actividades, revisa su estado y actívalas o desactívalas cuando sea necesario.</p>

      <div className="orders-list" style={{ marginBottom: '20px' }}>
        <div className="order-card-full" style={{ padding: '16px 20px' }}>
          <strong>Resumen</strong>
          <p style={{ margin: '8px 0 0', color: '#6b7280' }}>
            Rutas activas: {summary.rutas} · Rutas desactivadas: {summary.rutasInactivas} · Actividades activas: {summary.actividades} · Actividades desactivadas: {summary.actividadesInactivas}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button className={`btn ${activeTab === 'rutas' ? 'btn--primary' : 'btn btn--outline'}`} onClick={() => setActiveTab('rutas')}>Rutas</button>
        <button className={`btn ${activeTab === 'actividades' ? 'btn--primary' : 'btn btn--outline'}`} onClick={() => setActiveTab('actividades')}>Actividades</button>
      </div>

      {loading ? <LoadingSpinner /> : activeTab === 'rutas' ? renderList(rutas, 'ruta') : renderList(actividades, 'actividad')}
    </div>
  );
}
