"""钉钉 H5 端 API"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.core.response import ok
from app.models.user import User
from app.services.dingtalk.settings import is_dingtalk_enabled

router = APIRouter(tags=["h5-dingtalk"])


@router.get("/dingtalk/bind-url")
def get_bind_url_api(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from app.services.dingtalk.oauth import get_bind_authorize_url

    try:
        url = get_bind_authorize_url(db, user.tenant_id, user.id)
        return ok({"authorize_url": url, "user_id": user.id})
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.get("/dingtalk/bind-status")
def get_bind_status_api(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    bound = bool((user.dingtalk_userid or "").strip())
    return ok({
        "enabled": is_dingtalk_enabled(db, user.tenant_id),
        "bound": bound,
        "dingtalk_userid": user.dingtalk_userid or "",
        "dingtalk_bound_at": str(user.dingtalk_bound_at) if user.dingtalk_bound_at else None,
    })
