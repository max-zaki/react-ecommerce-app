import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../contexts/AuthContext';
import { clearCart } from '../store/cartSlice';

export default function Navbar() {
  const items = useSelector((state) => state.cart.items);
  const totalCount = items.reduce((sum, item) => sum + item.count, 0);
  const { currentUser, logout } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    dispatch(clearCart());
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <span className="brand-icon">🛍️</span>
        <span className="brand-name">ShopReact</span>
      </Link>

      <div className="nav-right">
        {currentUser ? (
          <>
            <span className="nav-user">👤 {currentUser.displayName || currentUser.email}</span>
            <Link to="/orders" className="nav-link">My Orders</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <button className="nav-logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link nav-link-primary">Register</Link>
          </>
        )}
        <Link to="/cart" className="nav-cart">
          <span className="cart-icon">🛒</span>
          <span className="cart-label">Cart</span>
          {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
        </Link>
      </div>
    </nav>
  );
}
