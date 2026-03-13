import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../store/cartSlice';
import ProductCard from '../components/ProductCard';

// Mock auth so the component never tries to reach Firebase
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ currentUser: null }),
}));

// Mock the product mutation hooks used inside ProductCard / ProductForm
vi.mock('../hooks/useProducts', () => ({
  useDeleteProduct: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useCreateProduct: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useUpdateProduct: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

const mockProduct = {
  id: 'prod-001',
  title: 'Wireless Headphones',
  price: 49.99,
  category: 'electronics',
  description: 'High-quality wireless headphones with noise cancellation.',
  rating: { rate: 4.3, count: 210 },
  image: 'https://via.placeholder.com/300',
};

const makeStore = () => configureStore({ reducer: { cart: cartReducer } });

const renderCard = () =>
  render(
    <Provider store={makeStore()}>
      <ProductCard product={mockProduct} />
    </Provider>
  );

describe('ProductCard — unit tests', () => {
  it('renders the product title', () => {
    renderCard();
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
  });

  it('renders the formatted product price', () => {
    renderCard();
    expect(screen.getByText('$49.99')).toBeInTheDocument();
  });

  it('renders the product category badge', () => {
    renderCard();
    expect(screen.getByText('electronics')).toBeInTheDocument();
  });

  it('renders the product description', () => {
    renderCard();
    expect(
      screen.getByText(/high-quality wireless headphones/i)
    ).toBeInTheDocument();
  });

  it('renders the Add to Cart button', () => {
    renderCard();
    expect(
      screen.getByRole('button', { name: /add to cart/i })
    ).toBeInTheDocument();
  });
});
