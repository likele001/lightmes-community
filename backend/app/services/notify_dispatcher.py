"""统一消息分发器

根据事件类型 + 用户绑定情况，智能路由到飞书、企业微信、钉钉、群通知等。
"""

from __future__ import annotations

import json
import logging
from datetime import datetime
from typing import Any

from sqlalchemy.orm import Session

from app.models.dingtalk_push_log import DingtalkPushLog
from app.models.feishu_push_log import FeishuPushLog
from app.models.user import User
from app.models.wecom_push_log import WecomPushLog
from app.services.dingtalk.settings import get_dingtalk_settings_raw, is_dingtalk_enabled
from app.services.feishu.settings import get_feishu_settings_raw, is_feishu_enabled
from app.services.notify_channels import (
    EVENT_GROUP_CODES,
    PushTarget,
    is_group_only_event,
    is_mixed_event,
    is_personal_event,
    is_rule_based_event,
)
from app.services.wecom.settings import get_wecom_settings_raw, is_wecom_enabled

logger = logging.getLogger(__name__)


def _resolve_rule_cfg(db: Session, tenant_id: int, event_code: str) -> dict:
    """合并读取首个可用通道的 rules 配置"""
    for getter, enabled in (
        (get_feishu_settings_raw, is_feishu_enabled),
        (get_dingtalk_settings_raw, is_dingtalk_enabled),
        (get_wecom_settings_raw, is_wecom_enabled),
    ):
        if not enabled(db, tenant_id):
            continue
        cfg = getter(db, tenant_id)
        rule = (cfg.get("rules") or {}).get(event_code)
        if rule:
            return rule
    return {}


def _get_user_personal_targets(db: Session, user: User, tenant_id: int) -> list[PushTarget]:
    targets: list[PushTarget] = []
    if (user.feishu_open_id or "").strip() and is_feishu_enabled(db, tenant_id):
        targets.append(PushTarget.user("feishu", user.feishu_open_id.strip(), user_id=user.id))
    if (user.wecom_userid or "").strip() and is_wecom_enabled(db, tenant_id):
        targets.append(PushTarget.user("wecom", user.wecom_userid.strip(), user_id=user.id))
    if (user.dingtalk_userid or "").strip() and is_dingtalk_enabled(db, tenant_id):
        targets.append(PushTarget.user("dingtalk", user.dingtalk_userid.strip(), user_id=user.id))
    return targets


def _append_dingtalk_webhook(targets: list[PushTarget], *, webhook: str, secret: str, gcode: str) -> None:
    webhook = webhook.strip()
    if not webhook:
        return
    if any(t.get("channel") == "dingtalk" and t.get("ref") == webhook for t in targets):
        return
    targets.append(PushTarget.webhook("dingtalk", webhook, group_code=gcode, webhook_secret=secret))


def _get_group_targets_for_event(
    db: Session,
    tenant_id: int,
    event_code: str,
    group_codes: list[str] | None = None,
) -> list[PushTarget]:
    if group_codes is None:
        group_codes = EVENT_GROUP_CODES.get(event_code, [])

    feishu_cfg = get_feishu_settings_raw(db, tenant_id) if is_feishu_enabled(db, tenant_id) else {}
    wecom_cfg = get_wecom_settings_raw(db, tenant_id) if is_wecom_enabled(db, tenant_id) else {}
    dingtalk_cfg = get_dingtalk_settings_raw(db, tenant_id) if is_dingtalk_enabled(db, tenant_id) else {}

    targets: list[PushTarget] = []

    for gcode in group_codes:
        f_group = next((g for g in (feishu_cfg.get("groups") or []) if g.get("code") == gcode and g.get("enabled", True)), None)
        if f_group:
            channels = f_group.get("channels") or {}
            feishu_ch = channels.get("feishu") or {}
            if feishu_ch.get("enabled", True) and (feishu_ch.get("chat_id") or "").strip():
                targets.append(PushTarget.chat("feishu", feishu_ch["chat_id"].strip(), group_code=gcode))
            wecom_ch = channels.get("wecom") or {}
            if wecom_ch.get("enabled", False) and (wecom_ch.get("webhook_url") or "").strip():
                targets.append(PushTarget.webhook("wecom", wecom_ch["webhook_url"].strip(), group_code=gcode))
            dingtalk_ch = channels.get("dingtalk") or {}
            if dingtalk_ch.get("enabled", False) and (dingtalk_ch.get("webhook_url") or "").strip():
                _append_dingtalk_webhook(
                    targets,
                    webhook=dingtalk_ch["webhook_url"],
                    secret=(dingtalk_ch.get("webhook_secret") or ""),
                    gcode=gcode,
                )

        w_group = next((g for g in (wecom_cfg.get("groups") or []) if g.get("code") == gcode and g.get("enabled", True)), None)
        if w_group:
            channels = w_group.get("channels") or {}
            wecom_ch = channels.get("wecom") or {}
            if wecom_ch.get("enabled", False) and (wecom_ch.get("webhook_url") or "").strip():
                webhook = wecom_ch["webhook_url"].strip()
                if not any(t.get("channel") == "wecom" and t.get("ref") == webhook for t in targets):
                    targets.append(PushTarget.webhook("wecom", webhook, group_code=gcode))
            dingtalk_ch = channels.get("dingtalk") or {}
            if dingtalk_ch.get("enabled", False) and (dingtalk_ch.get("webhook_url") or "").strip():
                _append_dingtalk_webhook(
                    targets,
                    webhook=dingtalk_ch["webhook_url"],
                    secret=(dingtalk_ch.get("webhook_secret") or ""),
                    gcode=gcode,
                )

        d_group = next((g for g in (dingtalk_cfg.get("groups") or []) if g.get("code") == gcode and g.get("enabled", True)), None)
        if d_group:
            channels = d_group.get("channels") or {}
            dingtalk_ch = channels.get("dingtalk") if isinstance(d_group.get("channels"), dict) else {}
            webhook = (dingtalk_ch.get("webhook_url") if dingtalk_ch else "") or d_group.get("webhook_url") or ""
            secret = (dingtalk_ch.get("webhook_secret") if dingtalk_ch else "") or d_group.get("webhook_secret") or ""
            _append_dingtalk_webhook(targets, webhook=webhook, secret=secret, gcode=gcode)

    return targets


def _enrich_payload(payload: dict, target: PushTarget, *, user: User | None = None) -> dict:
    out = dict(payload)
    if target.get("webhook_secret"):
        out["webhook_secret"] = target["webhook_secret"]
    if target["channel"] == "dingtalk" and user and (user.dingtalk_userid or "").strip():
        out["dingtalk_userid"] = user.dingtalk_userid.strip()
    return out


def _create_log(
    db: Session,
    *,
    tenant_id: int,
    event_code: str,
    target: PushTarget,
    title: str,
    content: str,
    level: str,
    biz_type: str | None,
    biz_id: int | None,
    payload: dict,
    scheduled_at: datetime | None,
    user: User | None = None,
) -> FeishuPushLog | WecomPushLog | DingtalkPushLog | None:
    payload = _enrich_payload(payload, target, user=user)
    status = "deferred" if scheduled_at and scheduled_at > datetime.now() else "pending"
    common = dict(
        tenant_id=tenant_id,
        event_code=event_code,
        target_kind=target["kind"],
        target_ref=target["ref"],
        title=title[:128],
        content=content,
        level=level,
        biz_type=biz_type,
        biz_id=biz_id,
        payload_json=json.dumps(payload, ensure_ascii=False) if payload else None,
        scheduled_at=scheduled_at,
        status=status,
    )
    if target["channel"] == "feishu":
        row = FeishuPushLog(**common)
        db.add(row)
        db.flush()
        return row
    if target["channel"] == "wecom":
        row = WecomPushLog(**common)
        db.add(row)
        db.flush()
        return row
    if target["channel"] == "dingtalk":
        row = DingtalkPushLog(**common)
        db.add(row)
        db.flush()
        return row
    return None


def _enqueue(channel: str, log_id: int) -> None:
    task_map = {
        "feishu": "feishu.send_message",
        "wecom": "wecom.send_message",
        "dingtalk": "dingtalk.send_message",
    }
    task_name = task_map.get(channel)
    if not task_name:
        return
    try:
        from app.celery_app import celery

        celery.send_task(task_name, args=[int(log_id)])
    except Exception as e:
        logger.warning("enqueue %s push failed log_id=%s: %s", channel, log_id, e)


def _dispatch_targets(
    db: Session,
    *,
    tenant_id: int,
    event_code: str,
    targets: list[PushTarget],
    title: str,
    content: str,
    level: str,
    biz_type: str | None,
    biz_id: int | None,
    payload: dict,
    scheduled_at: datetime | None,
    user: User | None = None,
) -> int:
    created = 0
    for target in targets:
        log = _create_log(
            db,
            tenant_id=tenant_id,
            event_code=event_code,
            target=target,
            title=title,
            content=content,
            level=level,
            biz_type=biz_type,
            biz_id=biz_id,
            payload=payload,
            scheduled_at=scheduled_at,
            user=user,
        )
        if log and log.status == "pending":
            _enqueue(target["channel"], log.id)
        created += 1
    return created


def dispatch(
    db: Session,
    tenant_id: int,
    event_code: str,
    *,
    title: str,
    content: str,
    level: str = "info",
    biz_type: str | None = None,
    biz_id: int | None = None,
    user_id: int | None = None,
    department_id: int | None = None,
    workshop: str | None = None,
    payload: dict | None = None,
    scheduled_at: datetime | None = None,
) -> int:
    payload = payload or {}
    created = 0

    if is_personal_event(event_code):
        if user_id:
            user = db.get(User, user_id)
            if user and user.tenant_id == tenant_id and user.is_active:
                created += _dispatch_targets(
                    db,
                    tenant_id=tenant_id,
                    event_code=event_code,
                    targets=_get_user_personal_targets(db, user, tenant_id),
                    title=title,
                    content=content,
                    level=level,
                    biz_type=biz_type,
                    biz_id=biz_id,
                    payload=payload,
                    scheduled_at=scheduled_at,
                    user=user,
                )
        return created

    if is_rule_based_event(event_code):
        rule = _resolve_rule_cfg(db, tenant_id, event_code)
        target_codes = rule.get("targets") or ["dept_leaders", "workshop_leaders"]

        from app.services.wecom.targets import notify_in_app_for_targets, resolve_targets as _resolve_targets

        user_targets = _resolve_targets(
            db,
            tenant_id,
            target_codes,
            user_id=user_id,
            department_id=department_id,
            workshop=workshop,
        )
        notify_in_app_for_targets(
            db,
            tenant_id,
            target_codes,
            title=title,
            content=content,
            level=level,
            biz_type=biz_type,
            biz_id=biz_id,
            user_id=user_id,
            department_id=department_id,
            workshop=workshop,
        )

        seen_user_ids: set[int] = set()
        for t in user_targets:
            if t.get("kind") != "user":
                continue
            uid = t.get("user_id")
            if not uid or uid in seen_user_ids:
                continue
            seen_user_ids.add(uid)
            user = db.get(User, uid)
            if not user or user.tenant_id != tenant_id or not user.is_active:
                continue
            created += _dispatch_targets(
                db,
                tenant_id=tenant_id,
                event_code=event_code,
                targets=_get_user_personal_targets(db, user, tenant_id),
                title=title,
                content=content,
                level=level,
                biz_type=biz_type,
                biz_id=biz_id,
                payload=payload,
                scheduled_at=scheduled_at,
                user=user,
            )
        return created

    if is_group_only_event(event_code):
        return _dispatch_targets(
            db,
            tenant_id=tenant_id,
            event_code=event_code,
            targets=_get_group_targets_for_event(db, tenant_id, event_code),
            title=title,
            content=content,
            level=level,
            biz_type=biz_type,
            biz_id=biz_id,
            payload=payload,
            scheduled_at=scheduled_at,
        )

    if is_mixed_event(event_code):
        if user_id:
            user = db.get(User, user_id)
            if user:
                created += _dispatch_targets(
                    db,
                    tenant_id=tenant_id,
                    event_code=event_code,
                    targets=_get_user_personal_targets(db, user, tenant_id),
                    title=title,
                    content=content,
                    level=level,
                    biz_type=biz_type,
                    biz_id=biz_id,
                    payload=payload,
                    scheduled_at=scheduled_at,
                    user=user,
                )
        created += _dispatch_targets(
            db,
            tenant_id=tenant_id,
            event_code=event_code,
            targets=_get_group_targets_for_event(db, tenant_id, event_code),
            title=title,
            content=content,
            level=level,
            biz_type=biz_type,
            biz_id=biz_id,
            payload=payload,
            scheduled_at=scheduled_at,
        )
        return created

    return 0
