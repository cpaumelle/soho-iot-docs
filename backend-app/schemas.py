from pydantic import BaseModel
from typing import List, Optional

class Zone(BaseModel):
    id: int
    room_id: int
    name: str

    class Config:
        orm_mode = True

class Room(BaseModel):
    id: int
    floor_id: int
    name: str
    zones: List[Zone] = []

    class Config:
        orm_mode = True

class Floor(BaseModel):
    id: int
    site_id: int
    name: str
    rooms: List[Room] = []

    class Config:
        orm_mode = True

class SiteBase(BaseModel):
    name: str
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    icon_name: Optional[str] = None

class SiteCreate(SiteBase):
    pass

class SiteUpdate(SiteBase):
    pass

class Site(SiteBase):
    id: int
    floors: List[Floor] = []

    class Config:
        orm_mode = True
