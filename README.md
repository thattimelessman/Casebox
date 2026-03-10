# CaseBox

Legal case management system — Django REST backend + React frontend.

## Run it

```bash
bash start.sh
```

That's it. First run installs everything and sets up the database (~3 minutes).
After that use `bash run.sh` to start quickly.

## Login

| Username | Password  | Role     |
|----------|-----------|----------|
| `admin`  | `Admin@123` | Admin  |

Add more users from the Admin → User Management page.

## How clients get access

1. Client visits the app → clicks **"Request access"** → fills the form
2. Admin logs in → **Pending Approvals** → clicks Approve
3. Client can now log in

## Project structure

```
casebox/
├── backend/    ← Django REST API (SQLite by default)
├── frontend/   ← React app
├── start.sh    ← First-time setup + run
└── run.sh      ← Quick start after setup
```

## Change the admin password

Edit `backend/.env` before running `start.sh`:
```
ADMIN_PASSWORD=your-new-password
```
