# Customer Management System

A beginner-friendly Customer Management System using FastAPI, SQLAlchemy, MySQL, HTML, CSS, and JavaScript Fetch API.

## Features
- Create, list, view, update, and delete customers
- Customer name, email, phone, address, and active/inactive status
- Layered files: database, model, schema, repository, service, controller
- FastAPI Swagger documentation

## 1. Create the database
In MySQL Workbench, run:

```sql
CREATE DATABASE customer_db;
```

## 2. Configure the database connection
Edit `database.py` and replace `YOUR_PASSWORD` in:

`mysql+pymysql://root:YOUR_PASSWORD@localhost/customer_db`

For a password containing URL-special characters, use a URL-encoded password or configure `DATABASE_URL` as an environment variable.

## 3. Install dependencies (Windows PowerShell)
Run these commands from this folder:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

If PowerShell blocks activation, use Command Prompt and run `.venv\Scripts\activate.bat`, or run `.venv\Scripts\python.exe -m pip install -r requirements.txt` and `.venv\Scripts\python.exe -m uvicorn main:app --reload`.

## 4. Start the backend
```powershell
uvicorn main:app --reload
```

API: http://127.0.0.1:8000  
Swagger: http://127.0.0.1:8000/docs

The app creates missing tables when it starts. `create_all()` does not add columns to an existing table. If you already have an older `customers` table, run the relevant migration in MySQL Workbench, for example:

```sql
ALTER TABLE customers ADD COLUMN address VARCHAR(255) NULL;
ALTER TABLE customers ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;
```

Run only the statements for columns that are not already present.

## 5. Start the frontend
Open `frontend/index.html` using VS Code Live Server. The default address should be `http://127.0.0.1:5500`. If your Live Server uses a different port, add that origin to the CORS `allow_origins` list in `main.py`.

## Notes
- Keep database credentials private; do not commit real passwords to GitHub.
- This is a learning/demo project. Add authentication and migrations before production use.
