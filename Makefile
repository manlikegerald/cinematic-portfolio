.PHONY: dev seed build test lint

# ── Dev ───────────────────────────────────────────────────────
dev:
	@echo "Starting backend on :8000 and frontend on :5173..."
	@(cd backend && uv run uvicorn app.main:app --reload --port 8000) &
	@(cd frontend && npm run dev)

# ── Seed database ─────────────────────────────────────────────
seed:
	cd backend && uv run python scripts/seed_db.py

# ── Build frontend for production ─────────────────────────────
build:
	cd frontend && npm run build

# ── Lint ──────────────────────────────────────────────────────
lint:
	cd frontend && npx eslint src --ext .ts,.tsx
	cd backend && uv run ruff check app/

# ── Test ──────────────────────────────────────────────────────
test:
	@echo "No tests yet — add pytest to backend, vitest to frontend."
