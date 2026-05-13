"""Admin authentication — HMAC-signed tokens, no external JWT library needed."""
import base64
import hashlib
import hmac
import json
import time

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from app.config import settings

router = APIRouter()
_bearer = HTTPBearer()


def _create_token() -> str:
    payload = json.dumps({"sub": "admin", "exp": int(time.time()) + 7 * 24 * 3600})
    b64 = base64.urlsafe_b64encode(payload.encode()).decode().rstrip("=")
    sig = hmac.new(settings.secret_key.encode(), b64.encode(), hashlib.sha256).hexdigest()
    return f"{b64}.{sig}"


def _verify_token(token: str) -> bool:
    try:
        b64, sig = token.rsplit(".", 1)
        expected = hmac.new(settings.secret_key.encode(), b64.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected):
            return False
        padding = "=" * (-len(b64) % 4)
        payload = json.loads(base64.urlsafe_b64decode(b64 + padding))
        return payload.get("exp", 0) > time.time()
    except Exception:
        return False


def get_admin(credentials: HTTPAuthorizationCredentials = Depends(_bearer)) -> bool:
    if not _verify_token(credentials.credentials):
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return True


class LoginRequest(BaseModel):
    password: str


@router.post("/login")
async def login(body: LoginRequest):
    if body.password != settings.admin_password:
        raise HTTPException(status_code=401, detail="Invalid password")
    return {"token": _create_token()}
