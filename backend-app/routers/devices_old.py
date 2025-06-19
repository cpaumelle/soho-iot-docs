from fastapi import APIRouter

router = APIRouter(prefix="/devices")

@router.get("/")
def list_devices():
    return {"devices": []}
