import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../firebase/orders';

const PLACEHOLDER = 'https://via.placeholder.com/60x60?text=No+Image';

export default function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrderById(orderId)
      .then((data) => {
        if (!data) setError('Order not found.');
        else setOrder(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <main className="order-detail-page"><p className="loading-text">Loading order…</p></main>;
  if (error) return <main className="order-detail-page"><p className="form-error">{error}</p></main>;

  return (
    <main className="order-detail-page">
      <Link to="/orders" className="back-link">← Back to Orders</Link>
      <h1>Order Details</h1>
      <div className="order-meta">
        <div className="order-meta-row">
          <span>Order ID:</span>
          <span className="mono">{order.id}</span>
        </div>
        <div className="order-meta-row">
          <span>Date:</span>
          <span>
            {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })
              : 'Date unavailable'}
          </span>
        </div>
        <div className="order-meta-row">
          <span>Account:</span>
          <span>{order.userEmail}</span>
        </div>
      </div>

      <div className="order-items-list">
        <h2>Items</h2>
        {order.items?.map((item, i) => (
          <div key={i} className="order-item-row">
            <img
              src={item.image || PLACEHOLDER}
              alt={item.title}
              onError={(e) => { e.target.src = PLACEHOLDER; }}
            />
            <div className="order-item-info">
              <span className="order-item-title">{item.title}</span>
              <span className="order-item-category">{item.category}</span>
            </div>
            <div className="order-item-price">
              <span className="order-item-qty">× {item.count}</span>
              <span>${(item.price * item.count).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="order-summary-footer">
        <div className="summary-row">
          <span>Total Items:</span>
          <span>{order.totalItems}</span>
        </div>
        <div className="summary-row total">
          <span>Total Price:</span>
          <span>${order.totalPrice?.toFixed(2)}</span>
        </div>
      </div>
    </main>
  );
}
