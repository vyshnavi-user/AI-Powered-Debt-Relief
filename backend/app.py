from fastapi import FastAPI
from database import Base, engine
from routes import router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
   app = FastAPI(
    title="AI Powered Debt Relief API"
)
)

# Include all API routes
app.include_router(router)


@app.get("/")
def home():
    return {
        "message": "AI Powered Debt Relief API is Running Successfully!"
    }