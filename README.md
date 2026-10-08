# OIBSIP Web Development Internship – All Projects

**Oasis Infobyte Summer Internship Program (OIBSIP) · Web Development**

This repository holds all my internship tasks, from static pages to a full-stack MERN application.

| Level | Task | Project | Stack |
|---|---|---|---|
| 1 | 1 | [Landing Page](#level-1--task-1-landing-page) | HTML, CSS |
| 1 | 2 | [Temperature Converter](#level-1--task-2-temperature-converter) | HTML, CSS, JavaScript |
| 2 | 1 | [Calculator](#level-2--task-1-calculator) | HTML, CSS, JavaScript |
| 2 | 2 | [Tribute Page](#level-2--task-2-tribute-page) | HTML, CSS |
| 2 | 3 | [To-Do App](#level-2--task-3-to-do-app) | HTML, CSS, JavaScript |
| 2 | 4 | [Login Authentication System](#level-2--task-4-login-authentication-system) | HTML, CSS, JavaScript |
| 3 | 1 | [Pizza Delivery Full-Stack App (Forno)](#level-3--task-1-pizza-delivery-full-stack-app) | React, Node, Express, MongoDB, Razorpay |


## Repository structure

```
.
├── LEVEL 1/
│   ├── TASK 1-landing-page/
│   └── TASK 2-temperature-converter/
├── LEVEL 2/
│   ├── TASK 1-calculator/
│   ├── TASK 2-tribute-page/
│   ├── TASK 3-todo-app/
│   └── TASK 4-login-system/
├── LEVEL 3/
│   └── TASK 1-pizza-app/
│       ├── client/
│       └── server/
└── README.md
```

Levels 1 and 2 need no build step or installation: open the folder's `index.html` in a browser. Level 3 needs Node.js and is explained in its own section.

---

# Level 1

## Level 1 · Task 1: Landing Page

**Objective:** Build a polished static landing page using only HTML and CSS.

**Brand:** "Brewly", a fictional coffee subscription.

**What it includes**
- Sticky navigation bar with three links (Features, Reviews, Contact)
- Hero section with a headline, subheadline and call-to-action button
- Two content sections: Features, and Reviews (testimonials)
- Footer with placeholder contact and social links
- One consistent colour palette (coffee browns, cream and an amber accent) defined as CSS variables
- Responsive layout using CSS Grid and Flexbox, with a mobile-friendly nav
- Global `box-sizing: border-box` with intentional spacing, so no elements overlap
- Heading and body type scales

**Files:** `index.html`, `style.css`

## Level 1 · Task 2: Temperature Converter

**Objective:** An interactive converter between Celsius, Fahrenheit and Kelvin with input validation.

**What it includes**
- Numeric input that rejects empty or non-numeric values with an error message
- Unit selector (Celsius, Fahrenheit or Kelvin) for the input unit
- Convert button, plus the Enter key
- Result list showing all three units at once, rounded to two decimals, with unit labels
- Absolute-zero check that shows a friendly message for any value below absolute zero (−273.15 °C, 0 K or −459.67 °F)
- Centred, clearly labelled layout

**Formulas used:** C→F: `C × 9/5 + 32` · F→C: `(F − 32) × 5/9` · K→C: `K − 273.15`. Every input is converted to Celsius first, then to the other units.

**Files:** `index.html`, `style.css`, `script.js`

---

# Level 2

## Level 2 · Task 1: Calculator

**Objective:** A browser calculator with a button interface.

**What it includes**
- Display showing the current number, and a smaller line showing the pending operation
- Digits 0–9, a decimal point, and the operators +, −, ×, ÷
- Equals, Clear (C) and Backspace buttons
- Division by zero shows an error message instead of crashing
- Operator chaining without a reset
- Button layout built with CSS Grid
- Event listeners on every button, with no inline `onclick`
- Written without `eval()`, using variables and a `switch` statement

**Note on chaining:** operations are evaluated as they are entered, from left to right, like a basic pocket calculator. So `5 + 3 × 2` gives `16`, not `11`.

**Files:** `index.html`, `style.css`, `script.js`

## Level 2 · Task 2: Tribute Page

**Objective:** A visually engaging tribute to a person I admire.

**Subject:** Dr. A.P.J. Abdul Kalam.

**What it includes**
- Page title with his name and a one-line tagline
- Portrait image
- Four-paragraph biography in my own words
- Timeline of key milestones as a styled ordered list
- Distinct, styled quote block
- Several background colours across sections
- Serif headings (Georgia) with sans-serif body text
- Responsive layout

**Image:** save a royalty-free portrait (for example from Wikimedia Commons) as `images/kalam.jpg`. It is not included in the repo.

**Sources:** facts were summarised in my own words from Wikipedia and Britannica.

**Files:** `index.html`, `style.css`, `images/`

## Level 2 · Task 3: To-Do App

**Objective:** A task manager with separate pending and completed lists.

**What it includes**
- Input and "Add Task" button (Enter also works)
- New tasks appear straight away in **Pending Tasks**
- "Mark Complete" toggle that moves a task between lists, with Undo
- Inline editing (Enter to save, Escape to cancel)
- Delete from either list
- Count indicators such as "2 pending" and "1 completed"
- Added and completed timestamps on each task
- Persistence across page refreshes with `localStorage`
- Friendly empty-state messages in both lists

**Files:** `index.html`, `style.css`, `script.js`

## Level 2 · Task 4: Login Authentication System

**Objective:** Registration, login and a protected page.

**Approach chosen:** front-end only (option A), using `localStorage` and SHA-256 hashing with the browser's Web Crypto API.

**What it includes**
- Registration and login on one page, with a switch between them
- Password rules: at least 8 characters and at least one number
- Duplicate-email check on registration
- One generic error ("Invalid email or password") that doesn't reveal which field was wrong
- Protected `dashboard.html` that redirects to the login page if there is no session
- Logout button that clears the session and redirects to login
- Passwords are salted and hashed with SHA-256, never stored in plain text
- Empty-form and email-format validation

**Important:** this is a learning demo. Client-side authentication can't be made secure, because anyone can edit `localStorage`. A real application must hash and verify passwords on a server (for example with bcrypt). Run it by opening the file or from `localhost`; `crypto.subtle` needs a secure context, which includes `localhost`.

**Files:** `index.html`, `dashboard.html`, `style.css`, `script.js`, `dashboard.js`

---

# Level 3

## Level 3 · Task 1: Pizza Delivery Full-Stack App

**Objective:** A production-style pizza ordering and inventory platform with separate customer and admin roles, live order tracking, Razorpay test payments and automatic low-stock email alerts. The app is called **Forno**.

### Features

**Customer**
- Registration with an email verification link
- Login with JWT authorisation
- Forgot-password flow with an emailed reset link (valid for 1 hour)
- Dashboard with the pizza menu and the user's orders
- Custom pizza builder: base (5 options), sauce (5), cheese (4) and veggies (multi-select from 8)
- Live SVG pizza preview that updates as ingredients are chosen
- Order summary before payment
- Razorpay checkout in test mode
- Order tracking that updates by itself: **Order Received → In Kitchen → Sent to Delivery**

**Admin**
- Separate admin login at `/admin/login`, not reachable from the registration flow (admin accounts are only created by the seed script)
- Inventory dashboard for bases, sauces, cheeses and veggies, with low-stock highlighting
- Stock decreases automatically after each paid order
- Manual stock and alert-threshold updates for every item
- Scheduled email alert (node-cron) when an item falls below its threshold
- Order board where each status change shows up on the customer's dashboard

### Tech stack

| Layer | Tools |
|---|---|
| Frontend | React 18, Vite, React Router, Tailwind CSS v4 |
| Backend | Node.js, Express |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcryptjs |
| Payments | Razorpay (test mode) |
| Email | Nodemailer (any SMTP, or an Ethereal test inbox) |
| Scheduling | node-cron |

### How it works

- **Pricing and validation:** the client sends only ingredient IDs. The server checks that every item exists, is the right type and is in stock, and calculates the price itself.
- **Payment:** the server creates a Razorpay order, the Razorpay window opens in the browser, and after payment the server verifies the signature before marking the order paid. Stock is deducted only at this point, one unit of each chosen ingredient.
- **Real-time status:** the customer dashboard and the admin board poll the API every 5 seconds.
- **Low-stock alerts:** a node-cron job (default every 15 minutes) emails `ADMIN_EMAIL` once per low item, and sends again only after the item has been restocked.

### Setup

Requires Node.js 18+, a MongoDB Atlas cluster and Razorpay test keys.

```bash
# 1. Server
cd "LEVEL 3/TASK 1-pizza-app/server"
cp .env.example .env        # fill in the variables below
npm install
npm run seed                # creates admin, sample users, inventory and menu
npm run dev                 # API on http://localhost:5000

# 2. Client (in a second terminal)
cd "LEVEL 3/TASK 1-pizza-app/client"
npm install
npm run dev                 # http://localhost:5173
```

| Variable | Purpose |
|---|---|
| `MONGO_URI` | Atlas connection string |
| `JWT_SECRET` | any long random string |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | admin account created by the seed; alerts are sent to this email |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Razorpay **test** keys |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | optional. If `SMTP_HOST` is empty, an Ethereal test inbox is used and preview links print in the server console |
| `CRON_SCHEDULE` | cron expression for the stock check (default `*/15 * * * *`) |
| `DNS_SERVERS` | optional. Defaults to `8.8.8.8,1.1.1.1` to avoid `querySrv ECONNREFUSED` on some networks |

### Sample logins (created by `npm run seed`, for local testing only)

| Role | Page | Email | Password |
|---|---|---|---|
| Admin | `/admin/login` | value of `ADMIN_EMAIL` | value of `ADMIN_PASSWORD` |
| User | `/login` | priya@forno.test | Pizza@123 |
| User | `/login` | karthik@forno.test | Pizza@123 |
| User | `/login` | meena@forno.test | Pizza@123 |

The sample users are pre-verified, so no email is needed. Change the admin password before deploying anywhere public.

### Testing the payment

Use Razorpay **test** keys. In the Razorpay window choose any method and click **Success**. The order then appears on the dashboard as _Order Received_, and the admin can move it through the kitchen.

---

## Steps performed (overall)

1. Read each task checklist and planned the folder structure and tech for it.
2. Built Levels 1 and 2 with plain HTML, CSS and JavaScript, keeping each project in its own folder with separate HTML, CSS and JS files.
3. Designed the Level 3 data model (users, inventory, menu, orders) and built the Express API with JWT auth, role guards and bcrypt hashing.
4. Added email verification, password reset and the scheduled low-stock alert with Nodemailer and node-cron.
5. Integrated Razorpay with server-side pricing, signature verification and automatic stock deduction.
6. Built the React frontend: auth screens, menu, four-step builder with live preview, order tracker and the admin panel.
7. Tested each project against its feature checklist.

## Outcome

Seven working projects that cover every item on the task checklists, from responsive static layouts and DOM-based tools to a full-stack ordering platform with payments, inventory automation and role-based access.

## What I learned

- Responsive layout with Flexbox and Grid, and consistent styling with CSS variables
- DOM manipulation, event handling, input validation and `localStorage` in vanilla JavaScript
- Why client-side authentication is only a demo, and how real authentication works with JWT and bcrypt
- Structuring a MERN application with separate user and admin roles
- Verifying payments on the server instead of trusting the browser
- Scheduling background jobs and avoiding repeat notifications
- Debugging real deployment issues such as the Atlas SRV DNS failure

## Possible improvements

- WebSockets instead of polling for the pizza app
- A cart, quantities and delivery addresses
- Server-side authentication for the Level 2 login system
- Deploying the apps (GitHub Pages for Levels 1–2, Render or Railway plus Vercel for Level 3)

---
