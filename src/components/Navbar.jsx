import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Navbar() {
  const items = useSelector((state) => state.cart.items);
  const totalCount = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <span className="brand-icon">🛍️</span>
        <span className="brand-name">ShopReact</span>
      </Link>
      <Link to="/cart" className="nav-cart">
        <span className="cart-icon">🛒</span>
        <span className="cart-label">Cart</span>
        {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
      </Link>
    </nav>
  );
}
