## **CaseBox**

A full-stack legal case management platform for law firms and independent practitioners. CaseBox centralises case tracking, hearing session notes, internal comments, document storage, and strict role-based access — with a custom-designed frontend and a Django REST API backend.

***NOTE*: It is suggested to wait a minute or so for Backend to connect coz I'm burnin free tier.**

---

## 🚀 What Does It Do?

Legal workflows are fragmented by default. Case files live in folders, hearing notes get lost in notebooks, and client visibility into their own cases is either nonexistent or completely uncontrolled. For small firms and solo practitioners, there is no lightweight tool that handles the full picture — case lifecycle with proper legal statuses, per-hearing session notes, internal advocate-only comments hidden from clients, document uploads, and role-gated access — without the overhead of enterprise software.

CaseBox solves this. Every case is tracked with court-specific metadata, assigned to the right people across four roles, and access is enforced at the database query level — not just the UI layer.

**Key capabilities:**
- Case management with 5 legal statuses, 8 case types, and 4 priority levels
- Per-hearing session notes with next hearing date tracking, added by advocates or admin
- Internal comments — visible only to admin and advocates, never to clients
- Client visibility toggle per case — admin controls exactly what each client sees
- Progress tracking (0–100%) per case, admin-controlled
- Role-based queryset filtering — each role's query is scoped at the ORM level
- Advocate coverage includes both client-side and opposition-side assignments
- Client accounts blocked at token generation until admin approves
- JWT authentication with automatic silent token refresh
- Admin dashboard stats — case counts by status/type, upcoming hearings, pending approvals
- Audit logging on case views and edits
- Document system with per-role visibility filtering
- Custom-designed frontend — no component library

---

## ✨ Features

### Authentication & Access Control
Secure login/logout with JWT (access + refresh token pair). The custom `CaseBoxTokenObtainPairSerializer` extends SimpleJWT to embed `role` and `is_approved` directly into the token payload — the frontend renders the correct dashboard at login without an extra API call.

Four roles:
- **Admin** — full access; creates, edits, and deletes all cases; manages users; approves clients; accesses dashboard stats and audit log
- **Advocate** — read access to cases where assigned as `client_advocate` or `opposition_advocate`; can add hearing notes and internal comments
- **Judge** — read access to cases where assigned as `judge`
- **Client** — read access only to their own cases where `is_visible_to_client=True`; documents filtered to client-visible ones only

The `can_access` property on the User model enforces the approval gate: non-client roles always pass, clients only pass if `is_approved=True`. This check runs inside the token serializer — unapproved clients are blocked at login, not just at the view layer.

### Case Model
Each case stores:
- `case_no` (unique), `case_title`, `case_type`, `priority`, `tags` (comma-separated)
- `court_name`, `court_city`
- Four role FKs: `client`, `judge`, `client_advocate`, `opposition_advocate`
- Dates: `filing_date`, `next_hearing_date`, `last_hearing_date`
- Text fields: `last_verdict`, `final_verdict`, `case_summary`
- `status` — ongoing, adjourned, judgement_reserved, closed, disposed
- `progress` — integer 0–100, admin-controlled via dedicated endpoint
- `is_visible_to_client` — boolean, toggled by admin per case

### Hearing Notes
Each case has multiple `HearingNote` records. Each stores the hearing date, next scheduled date, note text, and who added it. Only admin and advocates can POST — judges and clients are read-only, and clients don't see hearing notes at all in the detail response.

### Internal Comments
`CaseComment` is strictly internal. Comments are excluded from client-facing serializer responses at the data layer — not just hidden in the UI.

### Document System
Documents attach to cases via a separate `documents` app. The detail serializer filters the document queryset at query time — clients only receive documents where `is_visible_to_client=True`.

### Admin Dashboard
The `/cases/dashboard/` endpoint (admin only) returns:
- Total case count
- Breakdown by all 5 statuses
- Breakdown by case type (non-zero types only)
- Next 8 upcoming hearings within 30 days, ordered by date
- Total user count
- Count of pending unapproved client accounts

### Search & Filtering
- Full-text search across `case_no`, `case_title`, `court_name`, and `tags`
- Filter by `status`, `case_type`, `priority` via query params
- Ordering by `created_at`, `next_hearing_date`, `status`, `priority`

---

## 🛠️ Tech Stack

**Backend:**
- Python 3.10+
- Django 4.x
- Django REST Framework
- SimpleJWT — custom token serializer with role embedding
- Pillow — image processing for document uploads
- dj-database-url — environment-based database config
- Gunicorn — production WSGI server
- whitenoise — static file serving

**Frontend:**
- React 18
- Axios — HTTP client with JWT refresh interceptor
- Context API — global auth state management
- Custom CSS — no component library, built from scratch

**Infrastructure:**
- Frontend: Vercel
- Backend: Render
- Database: SQLite (dev), PostgreSQL-ready via `dj-database-url`

---

## 📁 Project Structure

```
Casebox/
├── backend/
│   ├── accounts/
│   │   ├── models.py                  # User model — roles, approval, can_access property
│   │   ├── serializers.py             # JWT serializer — embeds role + is_approved in token
│   │   ├── permissions.py             # IsAdmin, IsApprovedClient permission classes
│   │   ├── views.py                   # Auth views, user management
│   │   └── management/commands/
│   │       └── create_admin.py        # Idempotent admin creation from .env
│   ├── cases/
│   │   ├── models.py                  # Case, HearingNote, CaseComment
│   │   ├── serializers.py             # CaseListSerializer, CaseDetailSerializer,
│   │   │                              # HearingNoteSerializer, CaseCommentSerializer
│   │   ├── views.py                   # CaseViewSet with all custom actions
│   │   └── urls.py                    # DefaultRouter registration
│   ├── documents/
│   │   ├── models.py                  # Document model with is_visible_to_client
│   │   └── serializers.py             # DocumentSerializer
│   ├── logs/
│   │   └── utils.py                   # log_action — audit trail utility
│   ├── casebox/
│   │   ├── settings.py                # Environment-driven Django config
│   │   ├── urls.py                    # Root URL routing
│   │   └── wsgi.py                    # Gunicorn entry point
│   ├── media/                         # Uploaded files — gitignored
│   ├── requirements.txt
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js               # Axios instance + JWT refresh interceptor
│   │   │   └── index.js               # API method exports
│   │   ├── components/
│   │   │   └── Layout.jsx             # App shell, sidebar, navigation
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Global user state, token management
│   │   └── pages/
│   │       ├── admin/
│   │       │   ├── Dashboard.jsx      # Stats, upcoming hearings, pending approvals
│   │       │   ├── CasesPage.jsx
│   │       │   └── AdminPages.jsx     # User management, approvals, audit log
│   │       ├── shared/
│   │       │   └── CaseDetail.jsx     # Case detail — role-aware rendering
│   │       ├── LandingPage.jsx
│   │       ├── LoginPage.jsx
│   │       ├── AuthPages.jsx          # Register, pending approval screen
│   │       └── RolePages.jsx          # Advocate, Judge, Client views
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## 📦 Installation

### Prerequisites
- Python 3.10 or higher
- Node.js 16+ and npm
- Git

### Backend Setup

```bash
git clone https://github.com/thattimelessman/Casebox.git
cd Casebox/backend

python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
```

Create `backend/.env`:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
USE_SQLITE=True
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-password
ADMIN_EMAIL=admin@casebox.law
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

```bash
python manage.py migrate
python manage.py create_admin    # reads from .env, safe to re-run (idempotent)
python manage.py runserver
```

Backend runs at `http://localhost:8000`

### Frontend Setup

```bash
cd Casebox/frontend
npm install
```

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

```bash
npm start
```

Frontend runs at `http://localhost:3000`

---

## 🔐 Authentication Flow

1. User submits credentials to `POST /api/token/`
2. `CaseBoxTokenObtainPairSerializer` validates — checks `is_active` and `can_access` (unapproved clients are rejected here before any token is issued)
3. On success, returns access token (short-lived) and refresh token (long-lived) with `role` and `is_approved` in the payload
4. Frontend attaches the access token as `Bearer` header on every request via axios interceptor
5. On 401, the interceptor silently calls `POST /api/token/refresh/` and retries the original request — no visible interruption
6. On logout, tokens are cleared from state

---

## 📚 API Reference

### Base URL
```
http://localhost:8000/api
```

### Authentication

**Obtain Token**
```http
POST /api/token/
Content-Type: application/json

{
  "username": "admin",
  "password": "your-password"
}
```

**Refresh Token**
```http
POST /api/token/refresh/
Content-Type: application/json

{
  "refresh": "<refresh_token>"
}
```

### Cases

**List Cases** *(queryset scoped by role automatically)*
```http
GET /api/cases/
Authorization: Bearer <access_token>

# Optional query params:
# ?search=smith           — searches case_no, case_title, court_name, tags
# ?status=ongoing
# ?case_type=criminal
# ?priority=urgent
```

**Create Case** *(admin only)*
```http
POST /api/cases/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "case_no": "CIV/2026/001",
  "case_title": "Smith vs. Johnson",
  "case_type": "civil",
  "priority": "high",
  "court_name": "District Court",
  "court_city": "Delhi",
  "client": 3,
  "client_advocate": 4,
  "judge": 5,
  "status": "ongoing"
}
```

**Get Case Detail**
```http
GET /api/cases/{id}/
Authorization: Bearer <access_token>
```
*Returns full case with hearing_notes, comments (admin/advocate only), and documents (filtered for clients)*

**Update / Delete Case** *(admin only)*
```http
PUT    /api/cases/{id}/
DELETE /api/cases/{id}/
Authorization: Bearer <access_token>
```

### Hearing Notes

```http
GET  /api/cases/{id}/hearing-notes/
POST /api/cases/{id}/hearing-notes/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "hearing_date": "2026-03-10",
  "next_date": "2026-04-15",
  "note": "Arguments heard. Next date for evidence."
}
```
*POST restricted to admin and advocates only*

### Internal Comments *(admin and advocates only)*

```http
GET  /api/cases/{id}/comments/
POST /api/cases/{id}/comments/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "text": "Client has provided new documents. Review before next hearing."
}
```

### Progress Update *(admin only)*

```http
PATCH /api/cases/{id}/progress/
Authorization: Bearer <access_token>
Content-Type: application/json

{ "progress": 65 }
```

### Client Visibility Toggle *(admin only)*

```http
PATCH /api/cases/{id}/visibility/
Authorization: Bearer <access_token>
```
*Toggles `is_visible_to_client` — no body required*

### Admin Dashboard *(admin only)*

```http
GET /api/cases/dashboard/
Authorization: Bearer <access_token>
```

Sample response:
```json
{
  "total_cases": 42,
  "by_status": {
    "ongoing": 18,
    "adjourned": 7,
    "judgement_reserved": 4,
    "closed": 10,
    "disposed": 3
  },
  "by_type": {
    "civil": 15,
    "criminal": 12
  },
  "pending_clients": 3,
  "total_users": 20,
  "upcoming_hearings": [...]
}
```

---

## 🚦 Role Permission Matrix

| Action | Admin | Advocate | Judge | Client |
|---|---|---|---|---|
| List cases | All | Assigned (both sides) | Assigned | Own + visible only |
| View case detail | ✓ | ✓ | ✓ | ✓ (filtered) |
| Create case | ✓ | ✗ | ✗ | ✗ |
| Edit / Delete case | ✓ | ✗ | ✗ | ✗ |
| Add hearing note | ✓ | ✓ | ✗ | ✗ |
| Add internal comment | ✓ | ✓ | ✗ | ✗ |
| Update progress | ✓ | ✗ | ✗ | ✗ |
| Toggle client visibility | ✓ | ✗ | ✗ | ✗ |
| Dashboard stats | ✓ | ✗ | ✗ | ✗ |
| Approve client accounts | ✓ | ✗ | ✗ | ✗ |

---

## 🌐 Deployment

### Backend — Render

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Runtime | Python 3 |
| Build Command | `pip install -r requirements.txt && python manage.py migrate && python manage.py create_admin` |
| Start Command | `gunicorn casebox.wsgi:application` |

Environment variables:
```env
SECRET_KEY=<strong-random-50-char-key>
DEBUG=False
USE_SQLITE=True
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<strong-password>
ADMIN_EMAIL=admin@casebox.law
ALLOWED_HOSTS=.onrender.com
CORS_ALLOWED_ORIGINS=https://your-vercel-url.vercel.app
```

### Frontend — Vercel

| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Framework Preset | Create React App |
| Build Command | `DISABLE_ESLINT_PLUGIN=true react-scripts build` |
| Output Directory | `build` |

Environment variable:
```env
REACT_APP_API_URL=https://your-render-url.onrender.com/api
```

After both are live, update `CORS_ALLOWED_ORIGINS` on Render to match the exact Vercel URL and redeploy.

---

## 🐛 Known Limitations

- **Media persistence on Render**: Render's free tier has an ephemeral filesystem — uploaded documents are lost on redeploy. For production, integrate `django-storages` with S3 or Cloudinary.
- **SQLite concurrency**: Fine for demos, not for concurrent writes. Set `USE_SQLITE=False` and provide `DATABASE_URL` pointing to a PostgreSQL instance — Neon and Supabase both have free tiers.
- **Render cold starts**: Free tier spins down after inactivity. First request after idle takes 30–60 seconds — Render infrastructure limitation.

---

## 🤝 Areas for Contribution

- Cloud storage for documents (S3 / Cloudinary via django-storages)
- PostgreSQL setup guide and migration scripts
- Email notifications for hearing reminders and client approval events
- Case timeline view — visual history of status and progress changes
- Bulk document upload
- Export case detail to PDF
- Test coverage for all endpoints and the permission matrix
- Mobile-responsive layout improvements

---

## 📝 License

This project is licensed under the MIT License.

---

## 📧 Contact

Questions, ideas, or found a bug?

- **Email**: agrajsingh04@gmail.com
- **LinkedIn**: [thattimelessman](https://www.linkedin.com/in/thattimelessman/)
- **GitHub**: [thattimelessman](https://github.com/thattimelessman)

---

**NOTE: Stealing or copying this project without credit would be deeply unappreciated.**

---

**Built with intent for legal professionals who deserve better tooling.**
