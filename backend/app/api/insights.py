from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models import SocialInsightModel
from app.schemas import SocialInsightOut

router = APIRouter()


@router.get("/insights", response_model=list[SocialInsightOut])
async def get_insights(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(SocialInsightModel).order_by(SocialInsightModel.sort_order)
    )
    return result.scalars().all()
