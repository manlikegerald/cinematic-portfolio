from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db import create_tables
from app.api import profile, projects, timeline, contact


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup (idempotent — won't drop existing data)
    await create_tables()
    yield


app = FastAPI(title="Portfolio API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all routers under /api prefix
app.include_router(profile.router,  prefix="/api", tags=["profile"])
app.include_router(projects.router, prefix="/api", tags=["projects"])
app.include_router(timeline.router, prefix="/api", tags=["timeline"])
app.include_router(contact.router,  prefix="/api", tags=["contact"])


@app.get("/api/health", tags=["health"])
async def health():
    return {"status": "ok"}
