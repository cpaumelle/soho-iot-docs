from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Uplink

router = APIRouter()

@router.get("/uplinks")
def get_all_uplinks(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1),
    db: Session = Depends(get_db)
):
    total = db.query(func.count(Uplink.id)).scalar()
    uplinks = db.query(Uplink).offset(skip).limit(limit).all()

    # Base URL
    base_url = str(request.url).split("?")[0]

    # Construct URLs
    next_skip = skip + limit
    prev_skip = max(skip - limit, 0)

    next_url = f"{base_url}?skip={next_skip}&limit={limit}" if next_skip < total else None
    prev_url = f"{base_url}?skip={prev_skip}&limit={limit}" if skip > 0 else None

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "count": len(uplinks),
        "next_url": next_url,
        "prev_url": prev_url,
        "results": uplinks
    }

