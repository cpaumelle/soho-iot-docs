from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, JSON, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.schema import MetaData

# Set default schema globally
metadata = MetaData(schema="devices")
Base = declarative_base(metadata=metadata)

# Location models
class Site(Base):
    __tablename__ = "sites"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    address = Column(String(512), nullable=True)
    latitude = Column(Numeric(10, 7), nullable=True)
    longitude = Column(Numeric(10, 7), nullable=True)
    icon_name = Column(String(50), nullable=True)

    floors = relationship("Floor", back_populates="site", cascade="all, delete-orphan")

class Floor(Base):
    __tablename__ = "floors"
    id = Column(Integer, primary_key=True, autoincrement=True)
    site_id = Column(Integer, ForeignKey("sites.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)

    site = relationship("Site", back_populates="floors")
    rooms = relationship("Room", back_populates="floor", cascade="all, delete-orphan")

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, autoincrement=True)
    floor_id = Column(Integer, ForeignKey("floors.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)

    floor = relationship("Floor", back_populates="rooms")
    zones = relationship("Zone", back_populates="room", cascade="all, delete-orphan")

class Zone(Base):
    __tablename__ = "zones"
    id = Column(Integer, primary_key=True, autoincrement=True)
    room_id = Column(Integer, ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)

    room = relationship("Room", back_populates="zones")
    devices = relationship("Device", back_populates="zone")

# Device models
class DeviceType(Base):
    __tablename__ = "device_types"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    device_family = Column(String(100), nullable=True)
    icon_name = Column(String(50), nullable=True)
    unpacker_module_name = Column(String(100), nullable=True)
    unpacker_function_name = Column(String(100), nullable=True)

class Device(Base):
    __tablename__ = "devices"
    deveui = Column(String(16), primary_key=True, index=True)
    name = Column(String(255), nullable=True)
    device_type_id = Column(Integer, ForeignKey("device_types.id", ondelete="SET NULL"), nullable=True)
    zone_id = Column(Integer, ForeignKey("zones.id", ondelete="SET NULL"), nullable=True)

    device_type = relationship("DeviceType")
    zone = relationship("Zone", back_populates="devices")

class Uplink(Base):
    __tablename__ = "uplinks"
    id = Column(Integer, primary_key=True, autoincrement=True)
    deveui = Column(String(16), ForeignKey("devices.deveui", ondelete="CASCADE"), nullable=False)
    received_at = Column(DateTime(timezone=True))
    payload = Column(JSON)

    device = relationship("Device")
