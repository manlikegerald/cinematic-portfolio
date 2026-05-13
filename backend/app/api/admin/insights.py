"""Admin CRUD for social media insights."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.admin.auth import get_admin
from app.db import get_db
from app.models import SocialInsightModel
from app.schemas import SocialInsightOut

router = APIRouter()


class InsightStatIn(BaseModel):
    label: str
    value: str


class SocialInsightIn(BaseModel):
    platform: str
    handle: str = ""
    stats: list[InsightStatIn] = []
    sort_order: int = 0


@router.get("/insights", response_model=list[SocialInsightOut])
async def list_insights(db: AsyncSession = Depends(get_db), _: bool = Depends(get_admin)):
    result = await db.execute(
        select(SocialInsightModel).order_by(SocialInsightModel.sort_order)
    )
    return result.scalars().all()


@router.post("/insights", response_model=SocialInsightOut, status_code=201)
async def create_insight(
    body: SocialInsightIn,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(get_admin),
):
    entry = SocialInsightModel(**body.model_dump())
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.put("/insights/{insight_id}", response_model=SocialInsightOut)
async def update_insight(
    insight_id: int,
    body: SocialInsightIn,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(get_admin),
):
    result = await db.execute(select(SocialInsightModel).where(SocialInsightModel.id == insight_id))
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=404, detail="Insight not found")
    for key, value in body.model_dump().items():
        setattr(entry, key, value)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.delete("/insights/{insight_id}", status_code=204)
async def delete_insight(
    insight_id: int,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(get_admin),
):
    result = await db.execute(select(SocialInsightModel).where(SocialInsightModel.id == insight_id))
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=404, detail="Insight not found")
    await db.delete(entry)
    await db.commit()
