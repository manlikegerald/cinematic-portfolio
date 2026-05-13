"""Admin endpoint to update the portfolio profile."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.admin.auth import get_admin
from app.db import get_db
from app.models import ProfileModel
from app.schemas import ProfileOut

router = APIRouter()


class SocialIn(BaseModel):
    label: str
    href: str


class ProfileIn(BaseModel):
    name: str
    tagline: str
    bio_short: str
    bio_long: str
    location: str
    socials: list[SocialIn] = []
    currently: str = ""
    next: str = ""


@router.get("/profile", response_model=ProfileOut)
async def get_profile(db: AsyncSession = Depends(get_db), _: bool = Depends(get_admin)):
    result = await db.execute(select(ProfileModel))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.put("/profile", response_model=ProfileOut)
async def update_profile(
    body: ProfileIn,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(get_admin),
):
    result = await db.execute(select(ProfileModel))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found — run seed first")
    data = body.model_dump()
    data["socials"] = [s.model_dump() for s in body.socials]
    for key, value in data.items():
        setattr(profile, key, value)
    await db.commit()
    await db.refresh(profile)
    return profile
