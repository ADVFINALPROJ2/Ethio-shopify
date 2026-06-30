# Ethio Shopify — Multi-Seller Telegram E-Commerce Bot

**Bot:** [@EthShopify_bot](https://t.me/EthShopify_bot)

Ethio Shopify is a full-stack, multi-seller e-commerce platform that runs inside Telegram. Buyers browse products, manage carts, and place orders through the Telegram WebApp. Sellers manage their shops, inventory, and orders — all from within the chat.

Both the **frontend** and **backend** are hosted and the bot is live for testing.

---

## Table of Contents

- [Live Links](#live-links)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Backend (Rails API)](#backend-rails-api)
  - [Database Schema](#database-schema)
  - [API Endpoints](#api-endpoints)
  - [Authentication Flow](#authentication-flow)
  - [Background Jobs](#background-jobs)
  - [Checkout Logic](#checkout-logic)
- [Frontend (React + Vite)](#frontend-react--vite)
  - [Pages & Views](#pages--views)
  - [API Client Modules](#api-client-modules)
- [Deployment](#deployment)
  - [Backend (Render)](#backend-render)
  - [Frontend (Vercel)](#frontend-vercel)

---

## Live Links

| Service | URL |
|---|---|
| Telegram Bot | [@EthShopify_bot](https://t.me/EthShopify_bot) |
| Frontend (Vercel) | [https://ethio-shopify-blue.vercel.app](https://ethio-shopify-blue.vercel.app) |
| Backend API (Render) | [https://ethio-shopify.onrender.com](https://ethio-shopify.onrender.com) |
| Health Check | [https://ethio-shopify.onrender.com/up](https://ethio-shopify.onrender.com/up) |

---

## Tech Stack

### Backend
| Technology | Version |
|---|---|
| Ruby | 3.4.8 |
| Rails | 8.1 |
| Database (prod) | PostgreSQL |
| Database (dev/test) | SQLite3 |
| Background Jobs | Solid Queue (Rails 8 built-in) |
| Cache | Solid Cache (Rails 8 built-in) |
| File Storage (prod) | Supabase (via Active Storage) |
| File Storage (dev) | Local disk |
| Auth | Telegram initData verification + JWT |
| HTTP Server | Puma |

### Frontend
| Technology | Version |
|---|---|
| React | 19.2 |
| Vite | 8.0 |
| Axios | 1.17 |
| Runtime | Inside Telegram WebView |

---

## Architecture Overview

```
Telegram App
    │
    ▼
[@EthShopify_bot] ──► Telegram WebApp (React SPA)
                            │
                            ▼ (HTTP + JWT)
                    Rails API (Render)
                            │
                            ├── PostgreSQL
                            ├── Active Storage (Supabase)
                            ├── Solid Queue
                            └── Telegram API (notifications)
```

The app uses **Telegram-first authentication**: the Telegram WebApp SDK provides `initData` (signed with the bot token), which the backend verifies using HMAC-SHA256. On success, a JWT is issued. All subsequent API calls include this JWT in the `Authorization` header.

The frontend is a single-page React app that runs inside Telegram's WebView. Navigation uses a state-based router (`currentView` + `viewParams`) rather than React Router, which is better suited for the constrained WebView environment.

---

## Project Structure

```
Ethio-shopify/
├── README.md
├── .github/
│   ├── workflows/
│   │   └── ci.yml                 # CI pipeline (RuboCop, Brakeman, bundle-audit, tests)
│   └── dependabot.yml             # Weekly dependency updates
│
├── backend_api/                   # Rails 8.1 API (deployed on Render)
│   ├── Dockerfile                 # Multi-stage Docker build
│   ├── render.yaml                # Render deployment config
│   ├── render-build.sh            # Render build script
│   ├── docker-entrypoint.sh       # Container entrypoint (db:prepare + Puma)
│   ├── Gemfile
│   ├── Rakefile
│   ├── config/
│   │   ├── routes.rb              # All API routes
│   │   ├── database.yml           # SQLite3 (dev/test), PostgreSQL (prod)
│   │   ├── puma.rb                # Puma config (3-5 workers, 60s timeout)
│   │   ├── environments/
│   │   │   ├── development.rb
│   │   │   └── production.rb      # Active Storage :supabase, STDOUT logging
│   │   └── initializers/
│   │       └── cors.rb            # CORS: Vercel + localhost:5173
│   ├── app/
│   │   ├── controllers/
│   │   │   ├── application_controller.rb    # JWT decoding, current_user
│   │   │   ├── auth_controller.rb          # POST /auth/telegram
│   │   │   ├── users_controller.rb
│   │   │   ├── shops_controller.rb         # CRUD shops by slug
│   │   │   ├── products_controller.rb      # Seller product CRUD
│   │   │   ├── storefront_products_controller.rb  # Public product browsing
│   │   │   ├── cart_items_controller.rb    # GET/POST/DELETE cart items
│   │   │   ├── carts_controller.rb         # POST /cart/checkout
│   │   │   ├── orders_controller.rb        # Buyer order views
│   │   │   ├── seller_orders_controller.rb # Seller order management
│   │   │   └── dashboard_controller.rb     # Seller dashboard stats
│   │   ├── models/
│   │   │   ├── user.rb
│   │   │   ├── shop.rb
│   │   │   ├── product.rb
│   │   │   ├── order.rb
│   │   │   └── order_item.rb
│   │   ├── services/
│   │   │   └── telegram_notification_service.rb  # Sends Telegram messages
│   │   └── jobs/
│   │       ├── new_order_notification_job.rb
│   │       └── low_stock_alert_job.rb
│   ├── lib/
│   │   └── json_web_token.rb      # JWT encode/decode
│   └── db/
│       ├── schema.rb              # Full database schema
│       ├── migrate/
│       └── seeds.rb               # Sample data seeder
│
└── frontend/                      # React 19 + Vite 8 (deployed on Vercel)
    ├── package.json
    ├── vite.config.js
    ├── index.html                 # Loads telegram-web-app.js
    └── src/
        ├── main.jsx               # Entry point, AuthProvider wrapper
        ├── App.jsx                # State-based view router
        ├── App.css
        ├── config/
        │   └── index.js           # API_URL from VITE_API_URL env var
        ├── lib/
        │   └── axios.js           # Axios instance with JWT interceptor
        ├── features/
        │   ├── auth/
        │   │   └── context/
        │   │       └── AuthContext.jsx   # Telegram initData → JWT flow
        │   ├── home/
        │   │   └── pages/
        │   │       └── HomePage.jsx
        │   ├── storefront/
        │   │   └── pages/
        │   │       ├── StorefrontPage.jsx
        │   │       └── StorefrontProductDetailPage.jsx
        │   ├── cart/
        │   │   └── pages/
        │   │       ├── CartPage.jsx
        │   │       └── CheckoutPage.jsx
        │   ├── orders/
        │   │   └── pages/
        │   │       ├── OrdersPage.jsx
        │   │       └── OrderDetailPage.jsx
        │   ├── shops/
        │   │   └── pages/
        │   │       └── ShopSetupPage.jsx
        │   ├── products/
        │   │   └── pages/
        │   │       └── ProductFormPage.jsx
        │   ├── dashboard/
        │   │   ├── pages/
        │   │   │   └── SellerDashboardPage.jsx
        │   │   └── components/
        │   │       ├── StatCard.jsx
        │   │       └── ProductRow.jsx
        │   ├── seller_orders/
        │   │   └── pages/
        │   │       └── SellerOrdersPage.jsx
        │   └── users/
        │       └── pages/
        │           └── UsersPage.jsx
        └── api/                    # API client modules
            ├── index.js
            ├── products.js
            ├── users.js
            ├── cart.js
            ├── orders.js
            ├── shops.js
            └── dashboard.js
```

---

## Backend (Rails API)

### Database Schema

**13 tables** across 3 domains:

| Table | Purpose | Key Columns |
|---|---|---|
| `users` | Telegram-authenticated users | `telegram_id` (unique), `first_name`, `last_name`, `username`, `photo_url` |
| `shops` | Seller shops | `user_id` (FK), `name`, `slug` (unique index), `description`, `telegram_url`, `logo` (AS attachment) |
| `products` | Shop products | `shop_id` (FK), `name`, `description`, `price` (decimal), `stock_count` (integer), `images` (AS attachment) |
| `orders` | Orders grouped by seller | `buyer_id` (FK), `shop_id` (FK), `status` (enum), `total_amount`, `phone`, `address`, `notes` |
| `order_items` | Line items within an order | `order_id` (FK), `product_id` (FK), `quantity`, `unit_price` |
| `active_storage_blobs` | File metadata | Active Storage standard |
| `active_storage_attachments` | File-to-record mapping | Active Storage standard |
| `active_storage_variant_records` | Image variant cache | Active Storage standard |
| `solid_cache_*` | Rails cache table | Solid Cache standard |
| `solid_queue_*` | Background jobs | Solid Queue standard |

**Order statuses:** `pending_payment` → `paid` → `processing` → `accepted` → `shipped` → `completed` / `cancelled`

### API Endpoints

#### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/telegram` | Verify Telegram initData, return JWT |

#### Shops
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/shops` | List all shops |
| `POST` | `/shops` | Create a shop |
| `GET` | `/shops/:slug` | Get shop by slug |
| `PUT` | `/shops/:slug` | Update shop |

#### Products (Seller)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/products` | List seller's products |
| `POST` | `/products` | Create a product |
| `GET` | `/products/:id` | Get product detail |
| `PUT` | `/products/:id` | Update product |
| `DELETE` | `/products/:id` | Delete product |

#### Storefront (Buyer)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/shops/:slug/products` | List products in a shop |
| `GET` | `/shops/:slug/products/:id` | Get product detail |

#### Cart
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/cart/items` | List cart items |
| `POST` | `/cart/items` | Add item to cart (body: `{ product_id }`) |
| `DELETE` | `/cart/items/:id` | Remove item from cart |
| `POST` | `/cart/checkout` | Place order (body: `{ phone, address, notes }`) |

#### Orders
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/orders` | List buyer's orders |
| `GET` | `/orders/:id` | Get order detail |

#### Seller Orders
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/seller/orders` | List seller's orders |
| `PATCH` | `/seller/orders/:id` | Update order status |

#### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/dashboard` | Seller stats (products, orders, revenue, low stock, recent items) |

#### Health
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/up` | Rails health check |

### Authentication Flow

1. User opens Telegram WebApp → `window.Telegram.WebApp.initData` contains signed payload
2. Frontend sends `initData` to `POST /auth/telegram`
3. Backend verifies HMAC-SHA256 signature using the bot token
4. On success: finds or creates the user, issues a JWT (24h expiry, signed with `secret_key_base`)
5. Frontend stores JWT in `localStorage` as `ethio_shopify_auth_token`
6. All subsequent requests include `Authorization: Bearer <token>`


### Checkout Logic

The `POST /cart/checkout` endpoint performs a transactional checkout:

1. Validates stock availability for all cart items
2. Acquires row-level locks (`LOCK IN SHARE MODE`) on all products to prevent overselling
3. Deducts stock from each product
4. Groups cart items by `shop_id`
5. Creates a separate `Order` per seller, each with its own `OrderItem` records
6. Enqueues `NewOrderNotificationJob` per seller order
7. Enqueues `LowStockAlertJob` per seller
8. Clears the cart session
9. Returns all created orders

---

## Frontend (React + Vite)

### Pages & Views

| View | Component | Description |
|---|---|---|
| Home | `HomePage` | Landing with Browse Products / Sell on Ethio-Shopify cards |
| Storefront | `StorefrontPage` | Product listing by shop slug |
| Product Detail | `StorefrontProductDetailPage` | Single product view + Add to Cart |
| Cart | `CartPage` | Cart items, quantities, totals, Clear Cart |
| Checkout | `CheckoutPage` | Delivery form (phone, address, notes) |
| Orders | `OrdersPage` | Buyer's order history |
| Order Detail | `OrderDetailPage` | Single order with items and status |
| Seller Dashboard | `SellerDashboardPage` | Stats cards, recent orders, recent products |
| Shop Setup | `ShopSetupPage` | Create/edit shop form |
| Seller Orders | `SellerOrdersPage` | Seller order list with status update buttons |
| Product Form | `ProductFormPage` | Create/edit product with image upload |
| Users | `UsersPage` | Dev/testing user list |

### API Client Modules

| Module | Functions |
|---|---|
| `api/products.js` | `getProducts`, `createProduct`, `getStorefrontProduct` |
| `api/cart.js` | `addToCart`, `getCartItems`, `removeCartItem`, `checkoutCart` |
| `api/orders.js` | `getOrders`, `getOrder`, `getSellerOrders`, `updateSellerOrder` |
| `api/shops.js` | `getShop`, `createShop`, `updateShop` |
| `api/dashboard.js` | `getDashboard` |
| `api/users.js` | `getUsers`, `createUser` |

---

## Deployment

### Backend (Render)

**Live at:** `https://ethio-shopify.onrender.com`

Configuration: `backend_api/render.yaml`

- Service type: `render`
- Runtime: Ruby
- Region: Ohio (US)
- Plan: Free
- Health check path: `/up`
- Build command: `render-build.sh` (bundle install, yarn install, assets precompile)
- Start command: Puma via Docker entrypoint

### Frontend (Vercel)

**Live at:** `https://ethio-shopify-blue.vercel.app`

- SPA with Vite build output
- Environment variable: `VITE_API_URL=https://ethio-shopify.onrender.com`

---
