import { useState, useEffect } from 'react';
import { useCreateProduct, useUpdateProduct } from '../hooks/useProducts';

const EMPTY_FORM = {
  title: '',
  price: '',
  description: '',
  category: '',
  image: '',
  rating: { rate: 0, count: 0 },
};

export default function ProductForm({ product, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title ?? '',
        price: product.price ?? '',
        description: product.description ?? '',
        category: product.category ?? '',
        image: product.image ?? '',
        rating: product.rating ?? { rate: 0, count: 0 },
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'rating.rate' || name === 'rating.count') {
      const key = name.split('.')[1];
      setForm((f) => ({ ...f, rating: { ...f.rating, [key]: parseFloat(value) || 0 } }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = { ...form, price: parseFloat(form.price) };
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: product.id, updates: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form className="product-form" onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}
          <label>
            Title
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>
          <label>
            Price ($)
            <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required />
          </label>
          <label>
            Category
            <input name="category" value={form.category} onChange={handleChange} required />
          </label>
          <label>
            Image URL
            <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
          </label>
          <div className="form-row">
            <label>
              Rating (0–5)
              <input name="rating.rate" type="number" step="0.1" min="0" max="5" value={form.rating.rate} onChange={handleChange} />
            </label>
            <label>
              Review Count
              <input name="rating.count" type="number" min="0" value={form.rating.count} onChange={handleChange} />
            </label>
          </div>
          <label>
            Description
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} required />
          </label>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isPending}>
              {isPending ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
