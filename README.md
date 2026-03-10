# ShopReact — Advanced React E-Commerce Web App

A fully-featured e-commerce web application built with **React**, **Redux Toolkit**, **React Query**, and **React Router**. Products are fetched from the [FakeStore API](https://fakestoreapi.com/).

---

## Features

| Feature | Details |
|---|---|
| **Product Catalog** | Displays all products with title, price, category, description, rating, and image |
| **Category Filter** | Dynamic dropdown sourced from the API — filters the catalog in real time |
| **Image Fallback** | Broken API images are replaced with a placeholder automatically |
| **Shopping Cart** | Add, remove, and adjust quantities for any product |
| **Cart Persistence** | Cart state is stored in `sessionStorage` and survives page refreshes |
| **Order Summary** | Live total item count and total price in the cart sidebar |
| **Checkout** | Simulated checkout clears Redux state and sessionStorage with a success screen |
| **Responsive Layout** | Mobile-friendly grid and cart layout |

---

## Tech Stack

- **React 19** — UI framework
- **Redux Toolkit** — Shopping cart global state management
- **React Query (@tanstack/react-query)** — Data fetching and caching
- **React Router DOM** — Client-side routing
- **Vite** — Build tooling

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/max-zaki/react-ecommerce-app.git
cd adv_react_ecommerce_web_app
npm install
```

### Run in Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx        # Sticky navigation bar with live cart badge
│   └── ProductCard.jsx   # Individual product display card
├── hooks/
│   └── useProducts.js    # React Query hooks for FakeStore API
├── pages/
│   ├── Home.jsx          # Product catalog + category filter
│   └── Cart.jsx          # Shopping cart, summary, and checkout
├── store/
│   ├── cartSlice.js      # Redux Toolkit slice (add/remove/update/clear)
│   └── store.js          # Redux store configuration
├── App.jsx               # Root component — providers and routing
└── index.css             # Global styles
```

---

## API Endpoints Used

| Purpose | Endpoint |
|---|---|
| All products | `GET /products` |
| All categories | `GET /products/categories` |
| Products by category | `GET /products/category/{category}` |

---

## Notes

- The FakeStore API occasionally returns broken image URLs. A `via.placeholder.com` fallback is displayed whenever an image fails to load.
- Checkout is simulated — no real payment processing occurs.
- Cart data persists in `sessionStorage` as an array of product objects.
