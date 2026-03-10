import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../store/cartSlice';
import { Link } from 'react-router-dom';

const PLACEHOLDER = 'https://via.placeholder.com/80x80?text=No+Image';

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const [checkoutDone, setCheckoutDone] = useState(false);

  const totalCount = items.reduce((sum, item) => sum + item.count, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.count, 0);

  const handleCheckout = () => {
    dispatch(clearCart());
    setCheckoutDone(true);
  };

  if (checkoutDone) {
    return (
      <main className="cart-page">
        <div className="checkout-success">
          <div className="success-icon">✅</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your purchase. Your cart has been cleared.</p>
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="cart-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <Link to="/" className="continue-shopping-btn">
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <h1>Shopping Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.image || PLACEHOLDER}
                alt={item.title}
                onError={(e) => { e.target.src = PLACEHOLDER; }}
              />
              <div className="cart-item-details">
                <h3 className="cart-item-title">{item.title}</h3>
                <p className="cart-item-price">${item.price?.toFixed(2)} each</p>
                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <button
                      className="qty-btn"
                      onClick={() => dispatch(updateQuantity({ id: item.id, count: item.count - 1 }))}
                    >
                      −
                    </button>
                    <span className="qty-value">{item.count}</span>
                    <button
                      className="qty-btn"
                      onClick={() => dispatch(updateQuantity({ id: item.id, count: item.count + 1 }))}
                    >
                      +
                    </button>
                  </div>
                  <span className="cart-item-subtotal">
                    ${(item.price * item.count).toFixed(2)}
                  </span>
                  <button
                    className="remove-btn"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Total Items:</span>
            <span>{totalCount}</span>
          </div>
          <div className="summary-row total">
            <span>Total Price:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>
            Checkout
          </button>
          <Link to="/" className="continue-link">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
