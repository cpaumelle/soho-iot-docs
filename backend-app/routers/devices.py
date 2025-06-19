from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from app.database import get_db
from app.models import Device, Uplink

router = APIRouter(prefix="/devices/api")

@router.get("/devices")
def get_all_devices(db: Session = Depends(get_db)):
    print("📡 [API] /devices called")
    devices = db.query(Device).all()
    print(f"📦 [API] returned {len(devices)} devices")
    return devices

@router.get("/orphans")
def get_orphan_devices(db: Session = Depends(get_db)):
    print("📡 [API] /orphans called")
    devices = db.query(Device).filter(Device.zone_id == None).all()
    print(f"📦 [API] returned {len(devices)} orphan devices")
    return devices

@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    print("📡 [API] /summary called")

    total_devices = db.query(func.count(Device.deveui)).scalar()
    orphan_devices = db.query(func.count(Device.deveui)).filter(Device.zone_id == None).scalar()
    uplinks_today = db.query(func.count(Uplink.id)).filter(func.date(Uplink.received_at) == date.today()).scalar()
    last_uplink = db.query(Uplink).order_by(Uplink.received_at.desc()).first()

    summary = {
        "devices_online": total_devices,
        "orphan_devices": orphan_devices,
        "uplinks_today": uplinks_today,
        "last_seen_device": {
            "deveui": last_uplink.deveui if last_uplink else None,
            "timestamp": last_uplink.received_at.isoformat() if last_uplink else None
        }
    }

    print(f"📊 [API] Summary: {summary}")
    return summary
