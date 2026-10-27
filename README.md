# NextGen Learners

> Learn. Build. Get Certified.

A complete, front-end platform for an ed-tech organisation — internships, courses,
student projects, certificate verification, a learner **portal**, and an **admin
panel**. Built with React + Vite and a self-contained mock data layer, so it runs
with zero back-end dependency and is ready to swap onto a real API later.

---

## ✨ Features

**Public site**
- Marketing home page (hero, programs, about, why-choose-us, stats, testimonials, partners, CTA)
- Internship & course directories with search, filtering and pagination
- Internship / course / project detail pages
- Public **certificate verification** (`/verify-certificate?code=…`)
- Services, About, Contact and a 404 page

**Student portal** (login required)
- Dashboard with live stats, application timeline and course progress
- Browse & apply for internships
- Track applications, enrolled courses and earned certificates
- Profile editing and notification/privacy settings

**Admin panel** (admin login required)
- Platform overview & application pipeline
- Manage internships, courses, projects (full add / edit / delete, persisted)
- Review applications and move them through statuses
- Student roster, certificate issuing/revoking, and contact-message inbox

---

## 🧱 Tech stack

| Concern         | Choice                                   |
| --------------- | ---------------------------------------- |
| Framework       | React 18                                  |
| Build tool      | Vite 5                                    |
| Routing         | React Router DOM 6                        |
| Styling         | Hand-rolled CSS design system (no UI lib) |
| State / data    | React Context + a localStorage mock layer |

---

## 🚀 Getting started

```bash
# 1. install dependencies
npm install

# 2. start the dev server (http://localhost:3000)
npm run dev

# 3. create a production build (outputs to dist/)
npm run build

# 4. preview the production build locally
npm run preview
```

> **Windows note:** if `npm` fails with *"running scripts is disabled"*, invoke
> `npm.cmd` instead of `npm`, or relax the PowerShell execution policy.

---

## 🔑 Demo accounts

| Role    | Email                            | Password     |
| ------- | -------------------------------- | ------------ |
| Student | `student@nextgenlearners.com`    | `student123` |
| Admin   | `admin@nextgenlearners.com`      | `admin123`   |

Sample verification code: **`NGL-PY-2026-0417`**

---

## 🗂️ Project structure

```
nextgen-learners/
├── public/            # static assets (logo, favicons, images, certificates)
├── src/
│   ├── assets/        # bundled images / icons / fonts
│   ├── components/    # layout · common · cards · portal · forms
│   ├── context/       # AuthContext (session + role guards)
│   ├── data/          # mock catalogs & navigation
│   ├── hooks/         # useSearch, useScrollToTop
│   ├── pages/         # public · portal · admin screens
│   ├── routes/        # AppRoutes.jsx (guards + layout wiring)
│   ├── sections/      # home-page sections
│   ├── services/      # api abstraction + per-domain services + mock DB
│   ├── styles/        # variables · components · layout · portal · responsive
│   ├── utils/         # constants · validators · formatters
│   ├── App.jsx
│   └── main.jsx
├── backend/           # reserved for the future FastAPI service
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

---

## 🔌 Mock data layer → real backend

Every service (`internshipService`, `applicationService`, `courseService`,
`certificateService`, `authService`, `messages`) calls the single
`request()` helper in [`src/services/api.js`](src/services/api.js).

- **No** `VITE_API_BASE_URL` set → requests are served from localStorage via mock
  handlers (with simulated latency).
- **`VITE_API_BASE_URL` set** → the same calls hit a real REST endpoint and attach
  a bearer token.

To go live, copy `.env.example` to `.env`, set the base URL, and implement the
matching FastAPI routes in `backend/` — **no page or component changes required.**

```bash
# .env
VITE_API_BASE_URL=https://api.nextgenlearners.com
```

---

## 🛠️ Notes & current behaviour

- Admin catalog edits (internships/courses/projects) and issued certificates persist
  to localStorage under `ngl_admin_*` / `ngl_certificates` keys. Reset them by
  clearing site data.
- Portal and admin screens stay in sync through a lightweight event bus
  ([`src/services/events.js`](src/services/events.js)) — submitting an application
  refreshes the admin inbox instantly.
- `backend/` is a documented placeholder only; the app is fully functional without it.

---

## 📄 License

Released under the [MIT License](LICENSE).
