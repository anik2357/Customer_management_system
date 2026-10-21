from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from controller import router
import models  # Registers SQLAlchemy models with Base metadata

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Customer Management System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://customer-management-system-ubp5.onrender.com",  # no trailing slash
        "http://127.0.0.1:5500",   # VS Code Live Server
        "http://localhost:5500",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def home():
    return {"message": "Customer Management API is running"}

