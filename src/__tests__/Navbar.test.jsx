import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../store/cartSlice';
import Navbar from '../components/Navbar';

// Mock AuthContext so Navbar never touches Firebase
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ currentUser: null, logout: vi.fn() }),
}));

const makeStore = (items = []) =>
  configureStore({
    reducer: { cart: cartReducer },
    preloadedState: { cart: { items } },
  });

const renderNavbar = (store) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </Provider>
  );

describe('Navbar — unit tests', () => {
  it('renders the ShopReact brand name', () => {
    renderNavbar(makeStore());
    expect(screen.getByText('ShopReact')).toBeInTheDocument();
  });

  it('shows Login and Register links when no user is authenticated', () => {
    renderNavbar(makeStore());
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
  });

  it('does not render the cart badge when the cart is empty', () => {
    const { container } = renderNavbar(makeStore());
    expect(container.querySelector('.cart-badge')).not.toBeInTheDocument();
  });

  it('renders the cart badge with the correct total when items exist', () => {
    const store = makeStore([
      { id: '1', title: 'Widget', price: 9.99, count: 2 },
      { id: '2', title: 'Gadget', price: 4.99, count: 3 },
    ]);
    renderNavbar(store);
    // 2 + 3 = 5 total items
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
