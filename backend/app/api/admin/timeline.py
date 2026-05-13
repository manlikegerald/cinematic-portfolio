"""Admin CRUD for timeline entries."""
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.admin.auth import get_admin
from app.db import get_db
from app.models import TimelineModel
from app.schemas import TimelineOut

router = APIRouter()


class TimelineIn(BaseModel):
    year: int
    title: str
    description: str
    category: Literal["work", "life", "award"] = "work"


@router.get("/timeline", response_model=list[TimelineOut])
async def list_timeline(db: AsyncSession = Depends(get_db), _: bool = Depends(get_admin)):
    result = await db.execute(select(TimelineModel).order_by(TimelineModel.year.desc()))
    return result.scalars().all()


@router.post("/timeline", response_model=TimelineOut, status_code=201)
async def create_entry(
    body: TimelineIn,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(get_admin),
):
    entry = TimelineModel(**body.model_dump())
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.put("/timeline/{entry_id}", response_model=TimelineOut)
async def update_entry(
    entry_id: int,
    body: TimelineIn,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(get_admin),
):
    result = await db.execute(select(TimelineModel).where(TimelineModel.id == entry_id))
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    for key, value in body.model_dump().items():
        setattr(entry, key, value)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.delete("/timeline/{entry_id}", status_code=204)
async def delete_entry(
    entry_id: int,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(get_admin),
):
    result = await db.execute(select(TimelineModel).where(TimelineModel.id == entry_id))
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    await db.delete(entry)
    await db.commit()
