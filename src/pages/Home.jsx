import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAllProducts, useCategories, useProductsByCategory } from '../hooks/useProducts';
import { seedProductsFromFakeStore } from '../firebase/products';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: allProducts, isLoading: loadingAll, isError: errorAll } = useAllProducts();
  const { data: categories } = useCategories();
  const { data: categoryProducts, isLoading: loadingCatProducts } = useProductsByCategory(selectedCategory);

  const products = selectedCategory ? categoryProducts : allProducts;
  const isLoading = selectedCategory ? loadingCatProducts : loadingAll;
  const isEmpty = !isLoading && (!products || products.length === 0);

  const handleSeed = async () => {
    if (!confirm('Import ~20 sample products from FakeStore API into Firestore?')) return;
    setSeeding(true);
    try {
      await seedProductsFromFakeStore();
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (err) {
      alert('Seed failed: ' + err.message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <main className="home-page">
      <section className="hero">
        <h1>Welcome to ShopReact</h1>
        <p>Discover amazing products at great prices</p>
      </section>

      <section className="catalog-section">
        <div className="catalog-header">
          <h2>
            {selectedCategory
              ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
              : 'All Products'}
          </h2>
          <div className="catalog-header-right">
            <div className="category-filter">
              <label htmlFor="category-select">Filter by Category:</label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories?.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            {currentUser && (
              <button className="btn-primary" onClick={() => setShowForm(true)}>
                + Add Product
              </button>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="loading-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        )}

        {errorAll && (
          <div className="error-message">Failed to load products. Please try again later.</div>
        )}

        {isEmpty && currentUser && (
          <div className="empty-state">
            <p>No products yet.</p>
            <button className="btn-primary" onClick={handleSeed} disabled={seeding}>
              {seeding ? 'Importing…' : 'Import Sample Products from FakeStore API'}
            </button>
          </div>
        )}

        {!isLoading && products && products.length > 0 && (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {showForm && <ProductForm onClose={() => setShowForm(false)} />}
    </main>
  );
}
