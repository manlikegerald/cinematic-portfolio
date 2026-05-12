"""SQLAlchemy 2.0 mapped models."""
from typing import Optional
from sqlalchemy import Integer, String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.db import Base


class ProfileModel(Base):
    __tablename__ = "profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    tagline: Mapped[str] = mapped_column(String(300))
    bio_short: Mapped[str] = mapped_column(Text)
    bio_long: Mapped[str] = mapped_column(Text)
    location: Mapped[str] = mapped_column(String(200))
    # JSON list of {label, href}
    socials: Mapped[list] = mapped_column(JSON, default=list)
    currently: Mapped[str] = mapped_column(String(300), default="")
    next: Mapped[str] = mapped_column(String(300), default="")


class ProjectModel(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(300))
    year: Mapped[int] = mapped_column(Integer)
    type: Mapped[str] = mapped_column(String(100))
    role: Mapped[str] = mapped_column(String(200))
    summary: Mapped[str] = mapped_column(Text)
    cover: Mapped[str] = mapped_column(String(500), default="")
    gallery: Mapped[list] = mapped_column(JSON, default=list)
    content: Mapped[list] = mapped_column(JSON, default=list)
    tags: Mapped[list] = mapped_column(JSON, default=list)
    link_live: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    link_repo: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)


class TimelineModel(Base):
    __tablename__ = "timeline"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    year: Mapped[int] = mapped_column(Integer)
    title: Mapped[str] = mapped_column(String(300))
    description: Mapped[str] = mapped_column(Text)
    category: Mapped[str] = mapped_column(String(50), default="work")


class ContactModel(Base):
    __tablename__ = "contacts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    email: Mapped[str] = mapped_column(String(300))
    subject: Mapped[str] = mapped_column(String(400))
    message: Mapped[str] = mapped_column(Text)
