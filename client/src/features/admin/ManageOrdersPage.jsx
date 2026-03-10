import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatPrice, formatDate } from '../../utils/formatters';
import '../dashboard/Dashboard.css';

export default function ManageOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/pedidos/todos')
      .then((res) => setOrders(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
        <h1 className="page-title">Gestionar pedidos</h1>
        <table className="data-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Guía</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.usuario?.nombre}</td>
                <td>{order.guia?.titulo}</td>
                <td>{formatPrice(order.precioTotal)}</td>
                <td>
                  <span className={`badge badge--${order.estado === 'CONFIRMADO' ? 'success' : 'warning'}`}>
                    {order.estado}
                  </span>
                </td>
                <td>{formatDate(order.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}
