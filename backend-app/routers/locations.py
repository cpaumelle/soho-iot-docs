from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import schemas, models, database

router = APIRouter()

@router.get("/sites", response_model=List[schemas.Site])
def get_sites(db: Session = Depends(database.get_db)):
    sites = db.query(models.Site).all()
    return sites

@router.get("/sites/{site_id}/floors", response_model=List[schemas.Floor])
def get_floors(site_id: int, db: Session = Depends(database.get_db)):
    floors = db.query(models.Floor).filter(models.Floor.site_id == site_id).all()
    return floors

@router.get("/floors/{floor_id}/rooms", response_model=List[schemas.Room])
def get_rooms(floor_id: int, db: Session = Depends(database.get_db)):
    rooms = db.query(models.Room).filter(models.Room.floor_id == floor_id).all()
    return rooms

@router.get("/rooms/{room_id}/zones", response_model=List[schemas.Zone])
def get_zones(room_id: int, db: Session = Depends(database.get_db)):
    zones = db.query(models.Zone).filter(models.Zone.room_id == room_id).all()
    return zones

@router.post("/sites", response_model=schemas.Site, status_code=status.HTTP_201_CREATED)
def create_site(site: schemas.SiteCreate, db: Session = Depends(database.get_db)):
    db_site = models.Site(**site.dict())
    db.add(db_site)
    db.commit()
    db.refresh(db_site)
    return db_site

@router.put("/sites/{site_id}", response_model=schemas.Site)
def update_site(site_id: int, site: schemas.SiteUpdate, db: Session = Depends(database.get_db)):
    db_site = db.query(models.Site).filter(models.Site.id == site_id).first()
    if not db_site:
        raise HTTPException(status_code=404, detail="Site not found")
    for key, value in site.dict(exclude_unset=True).items():
        setattr(db_site, key, value)
    db.commit()
    db.refresh(db_site)
    return db_site

@router.delete("/sites/{site_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_site(site_id: int, db: Session = Depends(database.get_db)):
    db_site = db.query(models.Site).filter(models.Site.id == site_id).first()
    if not db_site:
        raise HTTPException(status_code=404, detail="Site not found")
    db.delete(db_site)
    db.commit()
    return None

# Similarly implement POST/PUT/DELETE for floors, rooms, and zones as needed
