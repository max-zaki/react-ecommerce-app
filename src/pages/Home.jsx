import { useState } from 'react';
import { useAllProducts, useCategories, useProductsByCategory } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('');

  const { data: allProducts, isLoading: loadingAll, isError: errorAll } = useAllProducts();
  const { data: categories, isLoading: loadingCats } = useCategories();
  const { data: categoryProducts, isLoading: loadingCatProducts } = useProductsByCategory(selectedCategory);

  const products = selectedCategory ? categoryProducts : allProducts;
  const isLoading = selectedCategory ? loadingCatProducts : loadingAll;

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
              ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`
              : 'All Products'}
          </h2>
          <div className="category-filter">
            <label htmlFor="category-select">Filter by Category:</label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={loadingCats}
            >
              <option value="">All Categories</option>
              {categories?.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading && (
          <div className="loading-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        )}

        {errorAll && !selectedCategory && (
          <div className="error-message">
            Failed to load products. Please try again later.
          </div>
        )}

        {!isLoading && products && (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
