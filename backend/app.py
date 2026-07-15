from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routes import router

# ==========================================
# CREATE DATABASE TABLES
# ==========================================

Base.metadata.create_all(bind=engine)

# ==========================================
# FASTAPI APP
# ==========================================

app = FastAPI(
    title="AI Powered Debt Relief API",
    version="1.0.0",
    description="AI Powered Debt Relief & Financial Planning Platform"
)

# ==========================================
# CORS
# ==========================================

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",

    # Replace with your Vercel frontend URL after deployment
    "https://your-vercel-app.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# ROUTES
# ==========================================

app.include_router(router)

# ==========================================
# HOME
# ==========================================

@app.get("/")
def home():
    return {
        "status": "Running",
        "project": "AI Powered Debt Relief",
        "version": "1.0.0",
        "message": "Backend API is running successfully."
    }

# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/health")
def health():
    return {
        "status": "Healthy"
    }