import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../store/cartSlice';
import ProductCard from '../components/ProductCard';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ currentUser: null }),
}));

vi.mock('../hooks/useProducts', () => ({
  useDeleteProduct: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useCreateProduct: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useUpdateProduct: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

const mockProduct = {
  id: 'cart-test-001',
  title: 'Integration Test Jacket',
  price: 79.99,
  category: "men's clothing",
  description: 'A slim-fit jacket for testing.',
  rating: { rate: 4.0, count: 85 },
  image: '',
};

describe('Cart integration — adding products', () => {
  it('adds a product to the Redux store when Add to Cart is clicked', () => {
    const store = configureStore({ reducer: { cart: cartReducer } });

    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    );

    expect(store.getState().cart.items).toHaveLength(0);

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    const { items } = store.getState().cart;
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe('cart-test-001');
    expect(items[0].title).toBe('Integration Test Jacket');
    expect(items[0].count).toBe(1);
  });

  it('increments count instead of duplicating when the same product is added twice', () => {
    const store = configureStore({ reducer: { cart: cartReducer } });

    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    );

    const btn = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(btn);
    fireEvent.click(btn);

    const { items } = store.getState().cart;
    expect(items).toHaveLength(1);
    expect(items[0].count).toBe(2);
  });

  it('saves the cart to sessionStorage after adding a product', () => {
    const store = configureStore({ reducer: { cart: cartReducer } });

    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    const stored = JSON.parse(sessionStorage.getItem('cart'));
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('cart-test-001');
  });
});
