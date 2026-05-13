"""Admin image upload endpoint — saves files to the frontend public directory."""
import os
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.api.admin.auth import get_admin

router = APIRouter()

# _HERE  = .../cinematic-portfolio/backend/app/api/admin
# 4× ..  = .../cinematic-portfolio
_HERE = os.path.dirname(os.path.abspath(__file__))
_PROJECT_ROOT = os.path.normpath(os.path.join(_HERE, "..", "..", "..", ".."))
UPLOAD_DIR = os.path.join(_PROJECT_ROOT, "frontend", "public", "images", "projects")

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_SIZE = 10 * 1024 * 1024  # 10 MB


@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    _: bool = Depends(get_admin),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, WebP, and GIF are allowed")

    contents = await file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 10 MB)")

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    ext = os.path.splitext(file.filename or "")[1] or ".jpg"
    filename = f"{uuid.uuid4().hex}{ext}"
    dest = os.path.join(UPLOAD_DIR, filename)

    with open(dest, "wb") as f:
        f.write(contents)

    return {"url": f"/images/projects/{filename}"}
