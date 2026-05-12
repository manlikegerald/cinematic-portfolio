"""
Seed the SQLite database from JSON files in backend/seed/.

Usage (from the backend/ directory):
    uv run python scripts/seed_db.py

Re-running is safe — it clears existing rows before inserting,
so you can edit the JSON and re-seed freely.
"""

import asyncio
import json
import sys
from pathlib import Path

# Allow imports from parent package
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import delete
from app.db import create_tables, SessionLocal
from app.models import ProfileModel, ProjectModel, TimelineModel

SEED_DIR = Path(__file__).parent.parent / "seed"


async def seed() -> None:
    await create_tables()

    async with SessionLocal() as db:
        # ── Profile ──────────────────────────────────────────────────
        profile_data = json.loads((SEED_DIR / "profile.json").read_text())
        await db.execute(delete(ProfileModel))
        db.add(ProfileModel(**profile_data))

        # ── Projects ─────────────────────────────────────────────────
        projects_data = json.loads((SEED_DIR / "projects.json").read_text())
        await db.execute(delete(ProjectModel))
        for p in projects_data:
            db.add(ProjectModel(**p))

        # ── Timeline ─────────────────────────────────────────────────
        timeline_data = json.loads((SEED_DIR / "timeline.json").read_text())
        await db.execute(delete(TimelineModel))
        for t in timeline_data:
            db.add(TimelineModel(**t))

        await db.commit()

    print("✓ Database seeded successfully.")
    print("  Profile:  1 record")
    print(f"  Projects: {len(projects_data)} records")
    print(f"  Timeline: {len(timeline_data)} records")


if __name__ == "__main__":
    asyncio.run(seed())
