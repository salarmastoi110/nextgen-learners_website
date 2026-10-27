# Backend API — NextGen Learners

This directory is reserved for the future backend development of the platform.

## Planned Stack

- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL (with SQLAlchemy ORM)
- **Auth:** JWT-based authentication with role-based access (student / admin)
- **Storage:** Local disk or S3-compatible storage for certificates and uploads

## Structure

```
backend/
├── app/
│   ├── routes/       # API endpoint routers
│   ├── models/       # Database models
│   ├── schemas/      # Pydantic request/response schemas
│   ├── services/     # Business logic
│   ├── database/     # DB connection & session management
│   └── main.py       # Application entry point
├── requirements.txt
└── README.md
```

## Planned API Endpoints

| Area         | Endpoints                                              |
|--------------|--------------------------------------------------------|
| Auth         | `/auth/register`, `/auth/login`, `/auth/forgot-password` |
| Internships  | `/internships`, `/internships/{id}`, `/applications`   |
| Courses      | `/courses`, `/courses/{id}`, `/enrollments`            |
| Certificates | `/certificates`, `/certificates/verify/{code}`         |
| Projects     | `/projects`, `/projects/{id}`                          |
| Contact      | `/contact`                                             |

The frontend currently runs fully on mock data in `src/data/` with service
layers in `src/services/` that are structured to swap in real API calls with
no page-level changes.
