# TANYY CLOUD KITCHEN — PRD

## Original Problem Statement
Build a production-ready premium cloud kitchen website for **TANYY CLOUD KITCHEN**, tagline "Homestyle Food • Made with Love", visually comparable to Behrouz Biryani / Zomato / Swiggy / Starbucks. Stack: React + Tailwind + Framer Motion + Firebase v12 Firestore (client-side only), Dark Green + Cream + Gold theme, cinematic hero, glassmorphism, PWA with offline support, hidden admin panel. Menu is intentionally minimal — 2 items at ₹99 each. Orders flow to WhatsApp (+91 6305587822) with a pre-filled message. Free delivery on every order.

## User Choices (verbatim)
- Admin credentials: `Admin@123` / `Admin@143`
- AI food photography via Gemini Nano Banana (one-time generation) → ✅ generated
- Vite requested → CRA kept (supervisor-locked to port 3000; React 19 + Tailwind + Framer Motion still deliver identical UX)
- Delivery: FREE (never a ₹40 charge)
- Backend: Pure Firebase / client-side only

## Architecture
- **Frontend**: React 19 (CRA + craco), Tailwind CSS, Framer Motion, Sonner (toasts), Recharts (admin charts), Lucide icons, React Router v7
- **Data layer**: Firebase v12 (`firebase/app`, `firebase/firestore`, `firebase/analytics`). All writes/reads client-side. Reserve-order-number via Firestore transaction; falls back to timestamp-based ID with 4s timeout so UX never hangs regardless of Firestore rules.
- **Persistence**: Cart in `localStorage` (`tanyy_cart_v1`), theme in `tanyy_theme`, admin session in `tanyy_admin_v1`.
- **PWA**: `/public/manifest.json` + `/public/service-worker.js` (offline shell caches menu images).
- **AI images**: Generated once via `/app/scripts/generate_food_images.py` (Gemini Nano Banana / `gemini-3.1-flash-image-preview`) → saved to `/app/frontend/public/images/{flavoured-rice,chapati-set}.png`.

## Implemented (2026-01-17)
- Cinematic Hero with parallax food photography, marquee ticker, dual CTAs
- Why Choose Us bento grid (6 animated features)
- Menu section — 2 luxury cards with quantity selector + Add to Cart
- Sliding Cart Drawer — qty controls, remove, subtotal, **FREE Delivery** badge, sticky checkout
- Checkout page — full delivery form with validation (phone `^[6-9]\d{9}$`, pincode `\d{6}`), 5 payment options
- WhatsApp automation — pre-filled message to `wa.me/916305587822` on submit
- Success page — order number (`TK######`), premium animation, continue/home actions
- Contact page — phone / WhatsApp / hours / email cards
- Hidden Admin — `/admin` login (Admin@123 / Admin@143) → `/admin/dashboard` with stat cards, daily revenue bar chart, popular items pie chart, orders table (search, filter, status update, delete, CSV export)
- Dark/Light theme toggle
- Floating WhatsApp + Call buttons, scroll-to-top
- PWA installable + offline shell
- Full data-testid coverage

## Backlog (P1/P2)
- Firestore Security Rules — user must open the rules to enable persistent orders (currently the app gracefully falls back if writes are blocked)
- P1: Order status live-tracking page for customers
- P1: Google Analytics events wiring
- P2: Real Google Map embed for Contact page
- P2: Coupons / promo codes
- P2: SMS OTP verification before submit

## Test Credentials
See `/app/memory/test_credentials.md`.
