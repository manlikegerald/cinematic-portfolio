"""Pydantic v2 schemas — mirror of SQLAlchemy models."""
from typing import Optional, Literal
from pydantic import BaseModel, EmailStr


class Social(BaseModel):
    label: str
    href: str


class ProfileOut(BaseModel):
    id: int
    name: str
    tagline: str
    bio_short: str
    bio_long: str
    location: str
    socials: list[Social]
    currently: str
    next: str

    model_config = {"from_attributes": True}


class ContentBlock(BaseModel):
    type: str
    value: Optional[str] = None
    src: Optional[str] = None
    caption: Optional[str] = None


class ProjectOut(BaseModel):
    id: int
    slug: str
    title: str
    year: int
    type: str
    role: str
    summary: str
    cover: str
    gallery: list[str]
    content: list[ContentBlock]
    tags: list[str]
    link_live: Optional[str]
    link_repo: Optional[str]

    model_config = {"from_attributes": True}


class TimelineOut(BaseModel):
    id: int
    year: int
    title: str
    description: str
    category: Literal["work", "life", "award"]

    model_config = {"from_attributes": True}


class ContactIn(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


class ContactOut(BaseModel):
    ok: bool
