from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import devices, locations

app = FastAPI()

# Allow frontend to access the backend API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(devices.router, prefix="/v1")
app.include_router(locations.router, prefix="/v1")

@app.get("/")
def root():
    return {"status": "Device Manager API is running"}
