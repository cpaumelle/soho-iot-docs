from pydantic import BaseModel
from typing import List, Optional

class SiteBase(BaseModel):
    name: str
    address: Optional[str] = None
    latitude: Optional[str] = None
    longitude: Optional[str] = None
    icon_name: Optional[str] = None

class SiteCreate(SiteBase):
    pass

class SiteCreate(BaseModel):
    name: str
    address: Optional[str] = None
    latitude: Optional[str] = None
    longitude: Optional[str] = None
    icon_name: Optional[str] = None

class SiteUpdate(SiteBase):
    pass

class Site(SiteBase):
    id: int
    floors: List['Floor'] = []

    class Config:
        orm_mode = True
