"""统一消息分发器

根据事件类型 + 用户绑定情况，智能路由到飞书、企业微信、群通知等。
"""

from __future__ import annotations

import json
import logging
from datetime import datetime
from typing import Any

from sqlalchemy.orm import Session

from app.models.feishu_push_log import FeishuPushLog
from app.models.user import User
from app.models.wecom_push_log import WecomPushLog
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


def _get_user_personal_targets(db: Session, user: User, tenant_id: int) -> list[PushTarget]:
    """根据用户绑定情况返回 personal 事件目标列表"""
    targets: list[PushTarget] = []
    if (user.feishu_open_id or "").strip() and is_feishu_enabled(db, tenant_id):
        targets.append(PushTarget.user("feishu", user.feishu_open_id.strip(), user_id=user.id))
    if (user.wecom_userid or "").strip() and is_wecom_enabled(db, tenant_id):
        targets.append(PushTarget.user("wecom", user.wecom_userid.strip(), user_id=user.id))
    return targets


def _get_group_targets_for_event(
    db: Session,
    tenant_id: int,
    event_code: str,
    group_codes: list[str] | None = None,
) -> list[PushTarget]:
    """从群组配置中拉取对应群组的多通道目标"""
    if group_codes is None:
        group_codes = EVENT_GROUP_CODES.get(event_code, [])

    feishu_cfg = get_feishu_settings_raw(db, tenant_id) if is_feishu_enabled(db, tenant_id) else {}
    wecom_cfg = get_wecom_settings_raw(db, tenant_id) if is_wecom_enabled(db, tenant_id) else {}

    targets: list[PushTarget] = []

    for gcode in group_codes:
        # 飞书群
        f_group = next((g for g in (feishu_cfg.get("groups") or []) if g.get("code") == gcode and g.get("enabled", True)), None)
        if f_group:
            channels = f_group.get("channels") or {}
            feishu_ch = channels.get("feishu") or {}
            if feishu_ch.get("enabled", True) and (feishu_ch.get("chat_id") or "").strip():
                targets.append(PushTarget.chat("feishu", feishu_ch["chat_id"].strip(), group_code=gcode))
            wecom_ch = channels.get("wecom") or {}
            if wecom_ch.get("enabled", False) and (wecom_ch.get("webhook_url") or "").strip():
                targets.append(PushTarget.webhook("wecom", wecom_ch["webhook_url"].strip(), group_code=gcode))
        # 企微独立配置兜底
        w_group = next((g for g in (wecom_cfg.get("groups") or []) if g.get("code") == gcode and g.get("enabled", True)), None)
        if w_group:
            channels = w_group.get("channels") or {}
            wecom_ch = channels.get("wecom") or {}
            if wecom_ch.get("enabled", False) and (wecom_ch.get("webhook_url") or "").strip():
                webhook = wecom_ch["webhook_url"].strip()
                if not any(t.get("channel") == "wecom" and t.get("ref") == webhook for t in targets):
                    targets.append(PushTarget.webhook("wecom", webhook, group_code=gcode))

    return targets


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
) -> FeishuPushLog | WecomPushLog | None:
    """创建对应通道的推送日志（pending 或 deferred）"""
    if target["channel"] == "feishu":
        row = FeishuPushLog(
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
            status="deferred" if scheduled_at and scheduled_at > datetime.now() else "pending",
        )
        db.add(row)
        db.flush()
        return row
    if target["channel"] == "wecom":
        row = WecomPushLog(
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
            status="deferred" if scheduled_at and scheduled_at > datetime.now() else "pending",
        )
        db.add(row)
        db.flush()
        return row
    return None


def _enqueue(channel: str, log_id: int) -> None:
    try:
        from app.celery_app import celery

        task_name = "feishu.send_message" if channel == "feishu" else "wecom.send_message"
        celery.send_task(task_name, args=[int(log_id)])
    except Exception as e:
        logger.warning("enqueue %s push failed log_id=%s: %s", channel, log_id, e)


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
    """统一消息分发入口

    返回创建的推送日志数（含 deferred）
    """
    payload = payload or {}
    created = 0

    if is_personal_event(event_code):
        if user_id:
            user = db.get(User, user_id)
            if user and user.tenant_id == tenant_id and user.is_active:
                for target in _get_user_personal_targets(db, user, tenant_id):
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
                    )
                    if log and log.status == "pending":
                        _enqueue(target["channel"], log.id)
                    created += 1
        return created

    if is_rule_based_event(event_code):
        # 规则事件（report.submitted 等）：按 rule.targets 解析出 user_id 列表，
        # 然后每个用户按绑定情况分流
        from app.services.wecom.settings import get_wecom_settings_raw as _wecom_cfg

        # 默认按飞书 rules 解析（兼容旧逻辑）
        feishu_cfg = get_feishu_settings_raw(db, tenant_id) if is_feishu_enabled(db, tenant_id) else {}
        wecom_cfg = _wecom_cfg(db, tenant_id) if is_wecom_enabled(db, tenant_id) else {}

        # 优先从飞书配置里取 rules（因为飞书是默认）
        rule_cfg = feishu_cfg if feishu_cfg else wecom_cfg
        rule = (rule_cfg.get("rules") or {}).get(event_code) or {}
        target_codes = rule.get("targets") or ["dept_leaders", "workshop_leaders"]

        from app.services.wecom.targets import resolve_targets as _resolve_wecom_targets

        user_targets = _resolve_wecom_targets(
            db,
            tenant_id,
            target_codes,
            user_id=user_id,
            department_id=department_id,
            workshop=workshop,
        )

        # 同时获取系统内通知用户列表
        from app.services.wecom.targets import notify_in_app_for_targets
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

        # 按 user_id 去重合并到 personal 通道
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
            for target in _get_user_personal_targets(db, user, tenant_id):
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
                )
                if log and log.status == "pending":
                    _enqueue(target["channel"], log.id)
                created += 1
        return created

    if is_group_only_event(event_code):
        for target in _get_group_targets_for_event(db, tenant_id, event_code):
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
            )
            if log and log.status == "pending":
                _enqueue(target["channel"], log.id)
            created += 1
        return created

    if is_mixed_event(event_code):
        # 老板 + 管理群
        if user_id:
            user = db.get(User, user_id)
            if user:
                for target in _get_user_personal_targets(db, user, tenant_id):
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
                    )
                    if log and log.status == "pending":
                        _enqueue(target["channel"], log.id)
                    created += 1
        for target in _get_group_targets_for_event(db, tenant_id, event_code):
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
            )
            if log and log.status == "pending":
                _enqueue(target["channel"], log.id)
            created += 1
        return created

    return 0
