"""Admin CRUD for projects."""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.admin.auth import get_admin
from app.db import get_db
from app.models import ProjectModel
from app.schemas import ProjectOut

router = APIRouter()


class ProjectIn(BaseModel):
    slug: str
    title: str
    year: int
    type: str
    role: str
    summary: str
    cover: str = ""
    gallery: list[str] = []
    content: list[dict] = []
    tags: list[str] = []
    link_live: Optional[str] = None
    link_repo: Optional[str] = None
    video_url: Optional[str] = None


@router.get("/projects", response_model=list[ProjectOut])
async def list_projects(db: AsyncSession = Depends(get_db), _: bool = Depends(get_admin)):
    result = await db.execute(select(ProjectModel).order_by(ProjectModel.year.desc()))
    return result.scalars().all()


@router.post("/projects", response_model=ProjectOut, status_code=201)
async def create_project(
    body: ProjectIn,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(get_admin),
):
    existing = await db.execute(select(ProjectModel).where(ProjectModel.slug == body.slug))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Slug already exists")
    project = ProjectModel(**body.model_dump())
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project


@router.put("/projects/{project_id}", response_model=ProjectOut)
async def update_project(
    project_id: int,
    body: ProjectIn,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(get_admin),
):
    result = await db.execute(select(ProjectModel).where(ProjectModel.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, value in body.model_dump().items():
        setattr(project, key, value)
    await db.commit()
    await db.refresh(project)
    return project


@router.delete("/projects/{project_id}", status_code=204)
async def delete_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(get_admin),
):
    result = await db.execute(select(ProjectModel).where(ProjectModel.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    await db.delete(project)
    await db.commit()
