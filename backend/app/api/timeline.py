from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db import get_db
from app.models import TimelineModel
from app.schemas import TimelineOut

router = APIRouter()


@router.get("/timeline", response_model=list[TimelineOut])
async def get_timeline(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TimelineModel).order_by(TimelineModel.year.desc()))
    return result.scalars().all()
