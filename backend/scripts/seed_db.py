"""
Seed the SQLite database from JSON files in backend/seed/.

Usage (from the backend/ directory):
    uv run python scripts/seed_db.py           # safe upsert — preserves admin edits
    uv run python scripts/seed_db.py --force   # wipe and re-insert (destructive)

Default mode (no flag): inserts missing records only. Existing rows are updated
for text fields (title, content, tags, etc.) but admin-entered fields like
video_url, link_live, link_repo, and cover are preserved.
"""

import asyncio
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import select, delete
from app.db import create_tables, SessionLocal
from app.models import ProfileModel, ProjectModel, TimelineModel

SEED_DIR = Path(__file__).parent.parent / "seed"

# Fields that admins can edit — never overwritten by seed unless --force is used.
ADMIN_FIELDS = {"video_url", "link_live", "link_repo", "cover"}


async def seed(force: bool = False) -> None:
    await create_tables()

    async with SessionLocal() as db:
        # ── Profile ──────────────────────────────────────────────────────────
        profile_data = json.loads((SEED_DIR / "profile.json").read_text())
        result = await db.execute(select(ProfileModel))
        existing_profile = result.scalar_one_or_none()
        if existing_profile is None or force:
            await db.execute(delete(ProfileModel))
            db.add(ProfileModel(**profile_data))
        else:
            for k, v in profile_data.items():
                setattr(existing_profile, k, v)

        # ── Projects ─────────────────────────────────────────────────────────
        projects_data = json.loads((SEED_DIR / "projects.json").read_text())
        if force:
            await db.execute(delete(ProjectModel))
            for p in projects_data:
                db.add(ProjectModel(**p))
        else:
            for p in projects_data:
                result = await db.execute(
                    select(ProjectModel).where(ProjectModel.slug == p["slug"])
                )
                existing = result.scalar_one_or_none()
                if existing is None:
                    db.add(ProjectModel(**p))
                else:
                    # Update non-admin fields only
                    for k, v in p.items():
                        if k not in ADMIN_FIELDS:
                            setattr(existing, k, v)

        # ── Timeline ─────────────────────────────────────────────────────────
        timeline_data = json.loads((SEED_DIR / "timeline.json").read_text())
        if force:
            await db.execute(delete(TimelineModel))
            for t in timeline_data:
                db.add(TimelineModel(**t))
        else:
            result = await db.execute(select(TimelineModel))
            existing_years = {row.year for row in result.scalars().all()}
            for t in timeline_data:
                if t["year"] not in existing_years:
                    db.add(TimelineModel(**t))

        await db.commit()

    mode = "force re-seed" if force else "safe upsert"
    print(f"✓ Database seeded successfully ({mode}).")
    print("  Profile:  1 record")
    print(f"  Projects: {len(projects_data)} records")
    print(f"  Timeline: {len(timeline_data)} records")


if __name__ == "__main__":
    force = "--force" in sys.argv
    asyncio.run(seed(force=force))
