# ShopReact — Advanced React E-Commerce Web App

A fully-featured e-commerce web application built with **React**, **Redux Toolkit**, **React Query**, **React Router**, and **Firebase**. Products, users, and orders are all managed through **Firestore**, with **Firebase Authentication** for secure login.

---

## Features

| Feature | Details |
|---|---|
| **User Registration & Login** | Email/password auth via Firebase Authentication |
| **User Profile** | View, edit (name, address), and delete your account |
| **Product Catalog** | Displays all products from Firestore with title, price, category, description, rating, and image |
| **Category Filter** | Dynamic dropdown derived from Firestore data |
| **Product CRUD** | Logged-in users can create, edit, and delete products |
| **Seed Products** | One-click import of FakeStore API products into Firestore (shown when catalog is empty) |
| **Image Fallback** | Broken images replaced with a placeholder |
| **Shopping Cart** | Add, remove, and adjust quantities — persisted via Redux + sessionStorage |
| **Checkout → Firestore Order** | Checkout saves the full order to Firestore (requires login) |
| **Order History** | View a list of your past orders with date, item count, and total |
| **Order Detail** | Click any order to see the full item breakdown and totals |

---

## Tech Stack

- **React 19** — UI framework
- **Firebase Authentication** — Email/password login and registration
- **Firestore** — Products, users, and orders database
- **Redux Toolkit** — Shopping cart state management
- **React Query (@tanstack/react-query)** — Data fetching and cache invalidation
- **React Router DOM** — Client-side routing with protected routes
- **Vite** — Build tooling with manual chunk splitting

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with **Authentication (Email/Password)** and **Firestore** enabled

### 1. Clone and install

```bash
git clone https://github.com/max-zaki/react-ecommerce-app.git
cd adv_react_ecommerce_web_app
npm install
```

### 2. Configure Firebase

Copy the env template and fill in your Firebase project values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> `.env.local` is in `.gitignore` — your secrets will never be committed.

### 3. Firestore Indexes

The orders query uses a composite index on `(userId, createdAt DESC)`. If you see an index error in the console, Firebase will show a direct link to create it automatically.

### 4. Run in Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 5. Build for Production

```bash
npm run build
npm run preview
```

---

## Seeding Products

On first run, your Firestore `products` collection is empty. After logging in, the home page will show an **"Import Sample Products from FakeStore API"** button that pulls 20 products into Firestore automatically.

---

## Project Structure

```
src/
├── firebase/
│   ├── config.js        # Firebase app init (reads from .env.local)
│   ├── auth.js          # register, login, logout
│   ├── users.js         # Firestore user CRUD
│   ├── products.js      # Firestore product CRUD + seeder
│   └── orders.js        # Firestore order creation and queries
├── contexts/
│   └── AuthContext.jsx  # Auth state provider (currentUser, login, logout, register)
├── components/
│   ├── Navbar.jsx        # Sticky nav with user info, cart badge, logout
│   ├── ProductCard.jsx   # Product display with admin edit/delete overlay
│   ├── ProductForm.jsx   # Create/Edit product modal
│   └── ProtectedRoute.jsx# Redirects unauthenticated users to /login
├── hooks/
│   └── useProducts.js   # React Query hooks wrapping Firestore queries
├── pages/
│   ├── Home.jsx          # Catalog + category filter + add product
│   ├── Cart.jsx          # Cart management + checkout (saves to Firestore)
│   ├── Login.jsx         # Login form
│   ├── Register.jsx      # Registration form
│   ├── Profile.jsx       # View/edit/delete profile
│   ├── Orders.jsx        # Order history list
│   └── OrderDetail.jsx   # Single order detail
├── store/
│   ├── cartSlice.js     # Redux Toolkit cart slice
│   └── store.js         # Redux store
└── App.jsx              # Providers + routing
```

---

## Firestore Data Model

```
users/{uid}
  name, email, address, createdAt

products/{auto-id}
  title, price, description, category, image, rating.rate, rating.count, createdAt

orders/{auto-id}
  userId, userEmail, items[], totalItems, totalPrice, createdAt
```

---

## Notes

- Checkout requires a logged-in user. Guest users are prompted to log in before completing their order.
- Logging out automatically clears the Redux cart state.
- The cart is also cleared from sessionStorage on logout.
