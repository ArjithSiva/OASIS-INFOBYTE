# Pizzeria – MERN pizza ordering & inventory app

## Setup
1. `cd server && cp .env.example .env` → fill MONGO_URI (Atlas), JWT_SECRET, Razorpay TEST keys (and SMTP if wanted).
2. `npm install && npm run seed` (creates admin + sample inventory/menu) then `npm run dev` (API on :5000).
3. `cd client && npm install && npm run dev` (app on http://localhost:5173).

## Use
- User: /register → verify email link → /login → pick a pizza or build one → pay (Razorpay test → "Success").
- Admin: /admin/login (credentials from .env, created by the seed script; not reachable from registration).
- Without SMTP_HOST, emails go to an Ethereal inbox; preview URLs print in the server console.
- Low-stock alerts: node-cron job (CRON_SCHEDULE, default every 15 min) emails ADMIN_EMAIL once per item until restocked.
- Live status: dashboards poll every 5 seconds.
