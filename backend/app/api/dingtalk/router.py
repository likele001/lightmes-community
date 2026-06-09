"""钉钉回调（公开接口，无需登录）"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session

from app.core.deps import get_db
from app.services.dingtalk.audit_actions import DingtalkAuditError, handle_card_action_token
from app.services.dingtalk.oauth import bind_user_with_code, parse_bind_state
from app.services.dingtalk.settings import get_dingtalk_settings_raw

router = APIRouter(tags=["dingtalk-open"])


@router.get("/oauth/callback")
def dingtalk_oauth_callback_api(
    code: str | None = Query(default=None),
    state: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    if not code or not state:
        raise HTTPException(status_code=400, detail="缺少 code 或 state")
    try:
        tenant_id, user_id = parse_bind_state(state)
        user = bind_user_with_code(db, tenant_id=tenant_id, user_id=user_id, code=code)
        db.commit()
        name = user.full_name or user.username
        cfg = get_dingtalk_settings_raw(db, tenant_id)
        h5_base = (cfg.get("h5_public_base_url") or "").strip().rstrip("/")
        if h5_base:
            redirect_url = f"{h5_base}/profile?dingtalk_bound=1"
            html = f"""<!DOCTYPE html><html><head><meta charset="utf-8"><title>绑定成功</title>
<meta http-equiv="refresh" content="5;url={redirect_url}"></head>
<body style="font-family:sans-serif;text-align:center;padding:40px;max-width:520px;margin:0 auto;">
<h2>钉钉绑定成功</h2><p>{name} 已与钉钉账号关联。</p>
<p><a href="{redirect_url}">5 秒后返回个人中心</a></p>
</body></html>"""
        else:
            html = f"""<!DOCTYPE html><html><head><meta charset="utf-8"><title>绑定成功</title></head>
<body style="font-family:sans-serif;text-align:center;padding:40px;max-width:520px;margin:0 auto;">
<h2>钉钉绑定成功</h2><p>{name} 已与钉钉账号关联。</p>
</body></html>"""
        return HTMLResponse(html)
    except Exception as e:
        db.rollback()
        html = f"""<!DOCTYPE html><html><head><meta charset="utf-8"><title>绑定失败</title></head>
<body style="font-family:sans-serif;text-align:center;padding:40px;">
<h2>绑定失败</h2><p>{str(e)[:200]}</p>
</body></html>"""
        return HTMLResponse(html, status_code=400)


@router.get("/card-action")
def dingtalk_card_action_api(
    token: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    if not token:
        raise HTTPException(status_code=400, detail="缺少 token")
    try:
        msg = handle_card_action_token(db, token=token)
        db.commit()
        html = f"""<!DOCTYPE html><html><head><meta charset="utf-8"><title>操作成功</title></head>
<body style="font-family:sans-serif;text-align:center;padding:40px;max-width:520px;margin:0 auto;">
<h2>操作成功</h2><p>{msg}</p>
</body></html>"""
        return HTMLResponse(html)
    except DingtalkAuditError as e:
        db.rollback()
        html = f"""<!DOCTYPE html><html><head><meta charset="utf-8"><title>操作失败</title></head>
<body style="font-family:sans-serif;text-align:center;padding:40px;">
<h2>操作失败</h2><p>{str(e)[:200]}</p>
</body></html>"""
        return HTMLResponse(html, status_code=400)
    except Exception as e:
        db.rollback()
        html = f"""<!DOCTYPE html><html><head><meta charset="utf-8"><title>操作失败</title></head>
<body style="font-family:sans-serif;text-align:center;padding:40px;">
<h2>操作失败</h2><p>{str(e)[:200]}</p>
</body></html>"""
        return HTMLResponse(html, status_code=400)
