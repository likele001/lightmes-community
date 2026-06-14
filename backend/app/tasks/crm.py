"""CRM 相关 Celery 任务"""
from datetime import datetime, timezone

from celery import shared_task
from sqlalchemy import select

from app.crud.attachment import create_attachment  # noqa: F401 (保留向后兼容)
from app.crud.crm import list_due_followups, recycle_stale_opportunities
from app.crud.notification import create_notification
from app.crud.tenant_setting import get_setting
from app.models.tenant import Tenant
from app.tasks.decorators import db_task


RECYCLE_DAYS_KEY = "crm.public_pool.recycle_days"
FOLLOWUP_REMIND_ENABLED_KEY = "crm.followup.remind_enabled"


def _parse_int(value: str | None, default: int) -> int:
    if value is None:
        return default
    try:
        return int(str(value).strip())
    except Exception:
        return default


@shared_task(name="crm.public_pool.auto_recycle")
@db_task
def crm_public_pool_auto_recycle(db, days_default: int = 30) -> dict:
    tenant_ids = [r[0] for r in db.execute(select(Tenant.id).order_by(Tenant.id.asc())).all()]
    now = datetime.now(timezone.utc)

    total = 0
    details: list[dict] = []
    for tenant_id in tenant_ids:
        try:
            s = get_setting(db, tenant_id=tenant_id, key=RECYCLE_DAYS_KEY)
            days = _parse_int(s.value if s else None, days_default)
            if days <= 0:
                days = days_default
            recycled = recycle_stale_opportunities(db, tenant_id=tenant_id, days=days, now=now)
            for opp_id, prev_owner in recycled:
                if prev_owner:
                    create_notification(
                        db,
                        tenant_id=tenant_id,
                        user_id=prev_owner,
                        title="销售机会已回收至公海",
                        content=f"销售机会 #{opp_id} 因长期未跟进已回收至公海池",
                        level="warning",
                        biz_type="crm_opportunity",
                        biz_id=opp_id,
                        feishu_event="crm.opportunity.recycled",
                    )
            db.commit()
            if recycled:
                total += len(recycled)
                details.append({"tenant_id": int(tenant_id), "recycled": len(recycled), "days": int(days)})
        except Exception:
            db.rollback()
            continue

    return {"total": int(total), "details": details}


@shared_task(name="crm.followup.remind")
@db_task
def crm_followup_remind(db) -> dict:
    tenant_ids = [r[0] for r in db.execute(select(Tenant.id).order_by(Tenant.id.asc())).all()]
    now = datetime.now(timezone.utc)
    total = 0
    for tenant_id in tenant_ids:
        try:
            enabled = get_setting(db, tenant_id=tenant_id, key=FOLLOWUP_REMIND_ENABLED_KEY)
            if enabled and str(enabled.value).lower() in ("0", "false", "no"):
                continue
            due_items = list_due_followups(db, tenant_id=tenant_id, now=now)
            for act in due_items:
                opp = act.opportunity
                uid = opp.owner_user_id if opp else None
                if not uid:
                    continue
                create_notification(
                    db,
                    tenant_id=tenant_id,
                    user_id=uid,
                    title="销售跟进提醒",
                    content=f"销售机会 {opp.code} 已到跟进时间：{act.content[:80]}",
                    level="warning",
                    biz_type="crm_opportunity",
                    biz_id=opp.id,
                    feishu_event="crm.followup.due",
                )
                total += 1
            db.commit()
        except Exception:
            db.rollback()
            continue
    return {"total": total}
