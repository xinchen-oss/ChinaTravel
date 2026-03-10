import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function ManageCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ codigo: '', descripcion: '', tipo: 'PORCENTAJE', valor: '', minCompra: 0, maxUsos: '', fechaFin: '' });

  const fetchCoupons = () => api.get('/cupones').then((r) => setCoupons(r.data.data));
  useEffect(() => { fetchCoupons(); }, []);

  const resetForm = () => {
    setForm({ codigo: '', descripcion: '', tipo: 'PORCENTAJE', valor: '', minCompra: 0, maxUsos: '', fechaFin: '' });
    setEditing(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, valor: Number(form.valor), minCompra: Number(form.minCompra), maxUsos: form.maxUsos ? Number(form.maxUsos) : null };
    if (editing) {
      await api.put(`/cupones/${editing}`, data);
    } else {
      await api.post('/cupones', data);
    }
    resetForm();
    fetchCoupons();
  };

  const startEdit = (c) => {
    setEditing(c._id);
    setForm({
      codigo: c.codigo, descripcion: c.descripcion || '', tipo: c.tipo,
      valor: c.valor, minCompra: c.minCompra || 0, maxUsos: c.maxUsos || '',
      fechaFin: c.fechaFin ? c.fechaFin.substring(0, 10) : '',
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este cupón?')) return;
    await api.delete(`/cupones/${id}`);
    fetchCoupons();
  };

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  return (
    <>
      <h1 className="section-title">Gestión de cupones</h1>

      <form onSubmit={handleSubmit} className="submission-form" style={{ marginBottom: '24px' }}>
        <h2>{editing ? 'Editar cupón' : 'Nuevo cupón'}</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Código</label>
            <input type="text" value={form.codigo} onChange={set('codigo')} required style={{ textTransform: 'uppercase' }} />
          </div>
          <div className="form-group">
            <label>Tipo</label>
            <select value={form.tipo} onChange={set('tipo')}>
              <option value="PORCENTAJE">Porcentaje (%)</option>
              <option value="FIJO">Descuento fijo (€)</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Valor ({form.tipo === 'PORCENTAJE' ? '%' : '€'})</label>
            <input type="number" value={form.valor} onChange={set('valor')} required min="1" />
          </div>
          <div className="form-group">
            <label>Compra mínima (€)</label>
            <input type="number" value={form.minCompra} onChange={set('minCompra')} min="0" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Máx. usos (vacío = ilimitado)</label>
            <input type="number" value={form.maxUsos} onChange={set('maxUsos')} min="1" />
          </div>
          <div className="form-group">
            <label>Fecha fin</label>
            <input type="date" value={form.fechaFin} onChange={set('fechaFin')} required />
          </div>
        </div>
        <div className="form-group">
          <label>Descripción</label>
          <input type="text" value={form.descripcion} onChange={set('descripcion')} placeholder="Ej: Descuento de verano" />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" className="btn btn--primary">{editing ? 'Guardar' : 'Crear cupón'}</button>
          {editing && <button type="button" className="btn btn--outline" onClick={resetForm}>Cancelar</button>}
        </div>
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Descuento</th>
            <th>Mín.</th>
            <th>Usos</th>
            <th>Válido hasta</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((c) => (
            <tr key={c._id}>
              <td><strong>{c.codigo}</strong></td>
              <td>{c.tipo === 'PORCENTAJE' ? `${c.valor}%` : `${c.valor}€`}</td>
              <td>{c.minCompra}€</td>
              <td>{c.usosActuales}/{c.maxUsos || '∞'}</td>
              <td>{new Date(c.fechaFin).toLocaleDateString('es-ES')}</td>
              <td>
                <span className={`badge badge--${c.activo && new Date(c.fechaFin) > new Date() ? 'success' : 'warning'}`}>
                  {c.activo && new Date(c.fechaFin) > new Date() ? 'Activo' : 'Expirado'}
                </span>
              </td>
              <td className="table-actions">
                <button className="btn btn--primary btn--sm" onClick={() => startEdit(c)}>Editar</button>
                <button className="btn btn--outline btn--sm" onClick={() => handleDelete(c._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
