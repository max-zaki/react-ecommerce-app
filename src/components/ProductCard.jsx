import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';

const PLACEHOLDER = 'https://via.placeholder.com/300x300?text=No+Image';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [imgSrc, setImgSrc] = useState(product.image || PLACEHOLDER);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img
          src={imgSrc}
          alt={product.title}
          onError={() => setImgSrc(PLACEHOLDER)}
        />
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-meta">
          <div className="product-rating">
            <span className="stars">{'★'.repeat(Math.round(product.rating?.rate || 0))}{'☆'.repeat(5 - Math.round(product.rating?.rate || 0))}</span>
            <span className="rating-count">({product.rating?.count || 0})</span>
          </div>
          <span className="product-price">${product.price?.toFixed(2)}</span>
        </div>
        <button
          className={`add-to-cart-btn ${added ? 'added' : ''}`}
          onClick={handleAddToCart}
        >
          {added ? '✓ Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
