import asyncio
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db
from app.models import ContactModel
from app.schemas import ContactIn, ContactOut
from app.config import settings

router = APIRouter()


async def _try_send_email(payload: ContactIn) -> None:
    """Silently attempt to send an email via SMTP. Fails gracefully if not configured."""
    if not settings.smtp_enabled:
        return
    try:
        import aiosmtplib
        from email.mime.text import MIMEText

        msg = MIMEText(
            f"From: {payload.name} <{payload.email}>\n\n{payload.message}",
            "plain",
        )
        msg["Subject"] = f"[Portfolio] {payload.subject}"
        msg["From"] = settings.smtp_from
        msg["To"] = settings.smtp_to

        await aiosmtplib.send(
            msg,
            hostname=settings.smtp_host,
            port=settings.smtp_port,
            username=settings.smtp_user,
            password=settings.smtp_password,
            start_tls=True,
        )
    except Exception:
        pass  # never let email failure break the user-facing response


@router.post("/contact", response_model=ContactOut)
async def submit_contact(payload: ContactIn, db: AsyncSession = Depends(get_db)):
    entry = ContactModel(
        name=payload.name,
        email=payload.email,
        subject=payload.subject,
        message=payload.message,
    )
    db.add(entry)
    await db.commit()

    # Fire-and-forget email — don't await so the HTTP response is immediate
    asyncio.create_task(_try_send_email(payload))

    return ContactOut(ok=True)
