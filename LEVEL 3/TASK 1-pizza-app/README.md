# Pizzeria – MERN pizza ordering & inventory app

## Setup
1. `cd server && cp .env.example .env` → fill MONGO_URI (Atlas), JWT_SECRET, Razorpay TEST keys (and SMTP if wanted).
2. `npm install && npm run seed` (creates admin + sample inventory/menu) then `npm run dev` (API on :5000).
3. `cd client && npm install && npm run dev` (app on http://localhost:5173).

## Sample logins (created by `npm run seed`, for local testing only)
| Role | Where | Email | Password |
|---|---|---|---|
| Admin | /admin/login | `ADMIN_EMAIL` from `.env` (default `admin@pizzeria.test`) | `ADMIN_PASSWORD` from `.env` (default `Admin@12345`) |
| User | /login | priya@forno.test | Pizza@123 |
| User | /login | karthik@forno.test | Pizza@123 |
| User | /login | meena@forno.test | Pizza@123 |

The sample users are pre-verified, so no email is needed. Change the admin password in `.env` before deploying anywhere public.

## Use
- User: /register → verify email link → /login → pick a pizza or build one → pay (Razorpay test → "Success").
- Admin: /admin/login (credentials from .env, created by the seed script; not reachable from registration).
- Without SMTP_HOST, emails go to an Ethereal inbox; preview URLs print in the server console.
- Low-stock alerts: node-cron job (CRON_SCHEDULE, default every 15 min) emails ADMIN_EMAIL once per item until restocked.
- Live status: dashboards poll every 5 seconds.
