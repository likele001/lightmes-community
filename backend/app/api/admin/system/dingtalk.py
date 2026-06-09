"""钉钉推送 Admin API"""

from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.admin.system.common import write_op_log
from app.core.deps import get_current_user, get_db, require_permissions
from app.core.response import ok
from app.models.dingtalk_push_log import DingtalkPushLog
from app.models.user import User
from app.services.dingtalk.client import (
    DingtalkApiError,
    batch_get_userid_by_mobiles,
    get_access_token,
    send_webhook_text,
    send_work_notification,
)
from app.services.dingtalk.cards import build_work_msg_markdown
from app.services.dingtalk.notify import enqueue_dingtalk_push
from app.services.dingtalk.settings import (
    get_dingtalk_credentials,
    get_dingtalk_settings_admin,
    save_dingtalk_settings,
)
from app.services.dingtalk.targets import resolve_targets

router = APIRouter(dependencies=[Depends(require_permissions(["setting.manage"]))])


class DingtalkSettingsIn(BaseModel):
    enabled: bool | None = None
    corp_id: str | None = Field(default=None, max_length=64)
    app_key: str | None = Field(default=None, max_length=64)
    app_secret: str | None = Field(default=None, max_length=128)
    agent_id: str | None = Field(default=None, max_length=32)
    message_format: str | None = Field(default=None, max_length=16)
    card_actions_enabled: bool | None = None
    h5_public_base_url: str | None = Field(default=None, max_length=255)
    admin_public_base_url: str | None = Field(default=None, max_length=255)
    api_public_base_url: str | None = Field(default=None, max_length=255)
    groups: list[dict] | None = None
    rules: dict | None = None
    quiet_hours: dict | None = None


class DingtalkTestSendIn(BaseModel):
    receive_id: str = Field(min_length=1, max_length=128)
    receive_id_type: str = Field(default="userid", max_length=16)
    text: str = Field(default="LightMes 钉钉推送测试", max_length=500)


class DingtalkSimulateIn(BaseModel):
    event_code: str = Field(min_length=1, max_length=64)
    user_id: int | None = Field(default=None, ge=1)
    department_id: int | None = Field(default=None, ge=1)
    workshop: str | None = Field(default=None, max_length=64)


class DingtalkUserBindIn(BaseModel):
    dingtalk_userid: str | None = Field(default=None, max_length=64)


class DingtalkDeptBindIn(BaseModel):
    dingtalk_dept_id: str | None = Field(default=None, max_length=64)
    dingtalk_chat_group_code: str | None = Field(default=None, max_length=32)


@router.get("/dingtalk")
def get_settings_api(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return ok(get_dingtalk_settings_admin(db, user.tenant_id))


@router.put("/dingtalk")
def put_settings_api(
    payload: DingtalkSettingsIn,
    request: Request,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    data = payload.model_dump(exclude_unset=True)
    result = save_dingtalk_settings(db, tenant_id=user.tenant_id, payload=data)
    write_op_log(
        db,
        request,
        user,
        module="system.setting",
        action="upsert",
        object_type="dingtalk_notify",
        object_id=user.tenant_id,
        detail="dingtalk_notify",
    )
    db.commit()
    return ok(result)


@router.post("/dingtalk/test-connection")
def test_connection_api(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _, app_key, app_secret, _ = get_dingtalk_credentials(db, user.tenant_id)
    if not app_key or not app_secret:
        raise HTTPException(status_code=400, detail="请先配置 AppKey 与 AppSecret")
    try:
        token = get_access_token(app_key, app_secret)
        return ok({"ok": True, "token_preview": token[:12] + "..."})
    except DingtalkApiError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.post("/dingtalk/test-send")
def test_send_api(
    payload: DingtalkTestSendIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _, app_key, app_secret, agent_id = get_dingtalk_credentials(db, user.tenant_id)
    if not app_key or not app_secret:
        raise HTTPException(status_code=400, detail="请先配置 AppKey 与 AppSecret")
    try:
        if payload.receive_id_type == "webhook":
            send_webhook_text(payload.receive_id, payload.text)
            return ok({"ok": True, "via": "webhook"})
        if not agent_id:
            raise HTTPException(status_code=400, detail="请先配置 AgentId")
        token = get_access_token(app_key, app_secret)
        msg = build_work_msg_markdown("LightMes 测试", payload.text)
        task_id = send_work_notification(token, agent_id=agent_id, userid=payload.receive_id, msg=msg)
        return ok({"ok": True, "task_id": task_id})
    except DingtalkApiError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.get("/dingtalk/setup-checklist")
def setup_checklist_api(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from app.services.dingtalk.setup_check import build_setup_check

    cfg = get_dingtalk_settings_admin(db, user.tenant_id)
    _, app_key, app_secret, agent_id = get_dingtalk_credentials(db, user.tenant_id)
    if not app_key or not app_secret:
        raise HTTPException(status_code=400, detail="请先配置 AppKey 与 AppSecret")
    return ok(
        build_setup_check(
            app_key=app_key,
            app_secret=app_secret,
            agent_id=agent_id,
            oauth_redirect_url=str(cfg.get("oauth_redirect_url") or ""),
        )
    )


@router.get("/dingtalk/push-logs")
def list_push_logs_api(
    event_code: str | None = Query(default=None),
    status: str | None = Query(default=None),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    stmt = select(DingtalkPushLog).where(DingtalkPushLog.tenant_id == user.tenant_id)
    if event_code:
        stmt = stmt.where(DingtalkPushLog.event_code == event_code)
    if status:
        stmt = stmt.where(DingtalkPushLog.status == status)
    stmt = stmt.order_by(DingtalkPushLog.id.desc()).offset(offset).limit(limit)
    rows = db.scalars(stmt).all()
    return ok({
        "items": [
            {
                "id": r.id,
                "event_code": r.event_code,
                "target_kind": r.target_kind,
                "target_ref": r.target_ref,
                "title": r.title,
                "content": r.content,
                "level": r.level,
                "status": r.status,
                "error_msg": r.error_msg,
                "dingtalk_task_id": r.dingtalk_task_id,
                "created_at": str(r.created_at) if r.created_at else None,
                "sent_at": str(r.sent_at) if r.sent_at else None,
            }
            for r in rows
        ]
    })


@router.post("/dingtalk/push-logs/{log_id}/retry")
def retry_push_log_api(
    log_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    row = db.get(DingtalkPushLog, log_id)
    if not row or row.tenant_id != user.tenant_id:
        raise HTTPException(status_code=404, detail="记录不存在")
    if row.status not in ("failed", "pending"):
        raise HTTPException(status_code=400, detail="当前状态不可重试")
    row.status = "pending"
    row.error_msg = None
    row.retry_count = (row.retry_count or 0) + 1
    db.flush()
    enqueue_dingtalk_push(db, row.id)
    db.commit()
    return ok({"ok": True, "retry_count": row.retry_count})


@router.get("/dingtalk/user-bindings")
def list_user_bindings_api(
    keyword: str | None = Query(default=None),
    unbound_only: bool = Query(default=False),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    stmt = select(User).where(User.tenant_id == user.tenant_id, User.is_active.is_(True))
    if keyword:
        stmt = stmt.where(
            (User.username.contains(keyword))
            | (User.full_name.contains(keyword))
            | (User.phone.contains(keyword))
        )
    if unbound_only:
        stmt = stmt.where((User.dingtalk_userid.is_(None)) | (User.dingtalk_userid == ""))
    stmt = stmt.order_by(User.id.asc()).limit(200)
    rows = db.scalars(stmt).all()
    return ok({
        "items": [
            {
                "id": u.id,
                "username": u.username,
                "full_name": u.full_name,
                "phone": u.phone,
                "email": u.email,
                "department_id": u.department_id,
                "dingtalk_userid": u.dingtalk_userid,
                "dingtalk_bound_at": str(u.dingtalk_bound_at) if u.dingtalk_bound_at else None,
                "bound": bool((u.dingtalk_userid or "").strip()),
            }
            for u in rows
        ]
    })


@router.put("/dingtalk/user-bindings/{user_id}")
def update_user_binding_api(
    user_id: int,
    payload: DingtalkUserBindIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    target = db.scalar(select(User).where(User.tenant_id == user.tenant_id, User.id == user_id))
    if not target:
        raise HTTPException(status_code=404, detail="用户不存在")
    if payload.dingtalk_userid is not None:
        target.dingtalk_userid = payload.dingtalk_userid.strip() or None
    if (target.dingtalk_userid or "").strip():
        target.dingtalk_bound_at = datetime.utcnow()
    else:
        target.dingtalk_bound_at = None
    db.commit()
    return ok({"id": target.id, "dingtalk_userid": target.dingtalk_userid})


@router.post("/dingtalk/user-bindings/batch-match-mobile")
def batch_match_mobile_api(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _, app_key, app_secret, _ = get_dingtalk_credentials(db, user.tenant_id)
    if not app_key or not app_secret:
        raise HTTPException(status_code=400, detail="请先配置 AppKey 与 AppSecret")
    users = db.scalars(
        select(User).where(
            User.tenant_id == user.tenant_id,
            User.is_active.is_(True),
            User.phone.isnot(None),
            User.phone != "",
            (User.dingtalk_userid.is_(None)) | (User.dingtalk_userid == ""),
        )
    ).all()
    mobile_map = {u.phone.strip(): u for u in users if u.phone and u.phone.strip()}
    if not mobile_map:
        return ok({"matched": 0, "total": 0})
    try:
        token = get_access_token(app_key, app_secret)
        dt_users = batch_get_userid_by_mobiles(token, list(mobile_map.keys()))
        matched = 0
        for row in dt_users:
            mobile = (row.get("mobile") or "").strip()
            uid = (row.get("userid") or "").strip()
            if mobile and uid and mobile in mobile_map:
                u = mobile_map[mobile]
                u.dingtalk_userid = uid
                u.dingtalk_bound_at = datetime.utcnow()
                matched += 1
        db.commit()
        return ok({"matched": matched, "total": len(mobile_map)})
    except DingtalkApiError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.get("/dingtalk/department-bindings")
def list_department_bindings_api(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from app.models.department import Department

    rows = db.scalars(select(Department).where(Department.tenant_id == user.tenant_id).order_by(Department.id.asc())).all()
    return ok({
        "items": [
            {
                "id": d.id,
                "code": d.code,
                "name": d.name,
                "parent_id": d.parent_id,
                "dingtalk_dept_id": d.dingtalk_dept_id,
                "dingtalk_chat_group_code": d.dingtalk_chat_group_code,
            }
            for d in rows
        ]
    })


@router.put("/dingtalk/department-bindings/{department_id}")
def update_department_binding_api(
    department_id: int,
    payload: DingtalkDeptBindIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    from app.models.department import Department

    dept = db.scalar(select(Department).where(Department.tenant_id == user.tenant_id, Department.id == department_id))
    if not dept:
        raise HTTPException(status_code=404, detail="部门不存在")
    if payload.dingtalk_dept_id is not None:
        dept.dingtalk_dept_id = payload.dingtalk_dept_id.strip() or None
    if payload.dingtalk_chat_group_code is not None:
        dept.dingtalk_chat_group_code = payload.dingtalk_chat_group_code.strip() or None
    db.commit()
    return ok({
        "id": dept.id,
        "dingtalk_dept_id": dept.dingtalk_dept_id,
        "dingtalk_chat_group_code": dept.dingtalk_chat_group_code,
    })


@router.get("/dingtalk/dingtalk-departments")
def list_dingtalk_departments_api(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from app.services.dingtalk.client import list_departments

    _, app_key, app_secret, _ = get_dingtalk_credentials(db, user.tenant_id)
    if not app_key or not app_secret:
        raise HTTPException(status_code=400, detail="请先配置 AppKey 与 AppSecret")
    try:
        token = get_access_token(app_key, app_secret)
        items = list_departments(token)
        return ok({"items": items})
    except DingtalkApiError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.get("/dingtalk/delivery-diagnostics")
def delivery_diagnostics_api(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from app.services.dingtalk.delivery import build_delivery_diagnostics

    return ok(build_delivery_diagnostics(db, user.tenant_id))


@router.post("/dingtalk/bind-url")
def bind_url_api(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from app.services.dingtalk.oauth import get_bind_authorize_url

    try:
        url = get_bind_authorize_url(db, user.tenant_id, user.id)
        return ok({"authorize_url": url})
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.post("/dingtalk/simulate")
def simulate_api(
    payload: DingtalkSimulateIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    cfg = get_dingtalk_settings_admin(db, user.tenant_id)
    rules = cfg.get("rules") or {}
    rule = rules.get(payload.event_code) or {}
    targets = resolve_targets(
        db,
        user.tenant_id,
        rule.get("targets") or [],
        user_id=payload.user_id,
        department_id=payload.department_id,
        workshop=payload.workshop,
    )
    return ok({"targets": targets, "rule": rule})
