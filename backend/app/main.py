from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db import create_tables
from app.api import profile, projects, timeline, contact
from app.api.admin import auth as admin_auth
from app.api.admin import projects as admin_projects
from app.api.admin import timeline as admin_timeline
from app.api.admin import profile as admin_profile
from app.api.admin import upload as admin_upload


@asynccontextmanager
async def lifespan(app: FastAPI):
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


@app.middleware("http")
async def no_cache(request: Request, call_next) -> Response:
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-store"
    return response

# Public API routes
app.include_router(profile.router,  prefix="/api", tags=["profile"])
app.include_router(projects.router, prefix="/api", tags=["projects"])
app.include_router(timeline.router, prefix="/api", tags=["timeline"])
app.include_router(contact.router,  prefix="/api", tags=["contact"])

# Admin API routes (all require Bearer token except /login)
app.include_router(admin_auth.router,     prefix="/api/admin", tags=["admin"])
app.include_router(admin_projects.router, prefix="/api/admin", tags=["admin"])
app.include_router(admin_timeline.router, prefix="/api/admin", tags=["admin"])
app.include_router(admin_profile.router,  prefix="/api/admin", tags=["admin"])
app.include_router(admin_upload.router,   prefix="/api/admin", tags=["admin"])


@app.get("/api/health", tags=["health"])
async def health():
    return {"status": "ok"}
