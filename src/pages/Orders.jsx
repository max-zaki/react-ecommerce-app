import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserOrders } from '../firebase/orders';

export default function Orders() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    getUserOrders(currentUser.uid)
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [currentUser]);

  if (loading) return <main className="orders-page"><p className="loading-text">Loading orders…</p></main>;

  return (
    <main className="orders-page">
      <h1>My Orders</h1>
      {error && <p className="form-error">{error}</p>}
      {orders.length === 0 ? (
        <div className="empty-state">
          <p>You haven't placed any orders yet.</p>
          <Link to="/" className="continue-shopping-btn">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <Link key={order.id} to={`/orders/${order.id}`} className="order-card">
              <div className="order-card-left">
                <span className="order-id">Order #{order.id.slice(0, 8)}…</span>
                <span className="order-date">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })
                    : 'Date unavailable'}
                </span>
              </div>
              <div className="order-card-right">
                <span className="order-items">{order.totalItems} item{order.totalItems !== 1 ? 's' : ''}</span>
                <span className="order-total">${order.totalPrice?.toFixed(2)}</span>
                <span className="order-arrow">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
