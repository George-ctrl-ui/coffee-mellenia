# Coffee Mellenia — Specialty Coffee Platform

Coffee Mellenia is a modern, production-quality specialty coffee brand web application featuring an artisanal storefront, real-time cart state management, checkout with server-validated Philippine phone numbers, unique reference order tracking, admin status controls, contact messaging, and a NestJS REST API with Prisma ORM and PostgreSQL.

---

## ☕ Key Architecture

```
coffee-mellenia/
├── src/                    # Frontend React SPA
│   ├── assets/             # Generated photography & brand assets
│   ├── components/         # Reusable UI (Navbar, CartDrawer, ProductCard, Footer)
│   ├── context/            # React Shopping Cart Context
│   ├── pages/              # Home, Menu, OurStory, Contact, Checkout, OrderConfirmation, OrderTracker, AdminDashboard
│   ├── services/           # REST API client
│   └── types/              # TypeScript domain types
├── backend/                # Production NestJS & Prisma Backend
│   ├── prisma/             # Schema definitions & database seeder
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/                # NestJS modules (products, orders, contact, admin, prisma)
├── server.ts               # Full-Stack live runtime (Express + REST API + Vite dev/prod server)
├── docker-compose.yml      # PostgreSQL + NestJS container configuration
└── package.json
```

---

## 🚀 Quick Start

### Live Applet Server (Runs Frontend + REST API on port 3000)
```bash
npm install
npm run dev
```

### Running with Docker Compose (PostgreSQL Database)
```bash
docker-compose up -d
```

### NestJS Backend Standalone (Port 3001)
```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
```

---

## 📋 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Retrieve menu drinks & pastries with category & search filters |
| `GET` | `/api/products/:id` | Retrieve single product details |
| `POST` | `/api/orders` | Place pickup order (recalculates prices server-side, validates Philippine phone) |
| `GET` | `/api/orders/:reference` | Look up order status by public reference (e.g., `CM-849201`) |
| `GET` | `/api/admin/orders` | View all customer orders (Protected with Bearer Token) |
| `PATCH` | `/api/admin/orders/:id/status` | Update order preparation status (Protected with Bearer Token) |
| `POST` | `/api/contact` | Submit customer message with validation |

---

## 🔒 Security & Reliability
- **Server-Side Price Verification**: Order totals are recalculated using authoritative database item prices, never client payload amounts.
- **Strict Format Validation**: Philippine mobile numbers are validated (`^(09|+639|9)\d{9}$`).
- **Protected Administrative Endpoints**: Admin endpoints require `Authorization: Bearer <ADMIN_TOKEN>`.
- **Unique Order References**: Orders are looked up by secure non-sequential references (e.g., `CM-849201`).
