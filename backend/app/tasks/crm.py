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


@shared_task(name="crm.lead.score.recalculate")
@db_task
def crm_lead_score_recalculate(db) -> dict:
    """遍历所有租户的所有线索，重新计算 score / grade。"""
    tenant_ids = [r[0] for r in db.execute(select(Tenant.id).order_by(Tenant.id.asc())).all()]
    import app.crud.crm as _crm
    fn = getattr(_crm, "recalculate_lead_score_grade", None)
    total = 0
    details: list[dict] = []
    for tenant_id in tenant_ids:
        try:
            if callable(fn):
                cnt = fn(db, tenant_id=tenant_id)
            else:
                # 兜底：如果 crud 尚未实现，则仅返回空结果，不抛异常
                cnt = 0
            db.commit()
            if cnt:
                total += int(cnt)
                details.append({"tenant_id": int(tenant_id), "updated": int(cnt)})
        except Exception:
            db.rollback()
            continue
    return {"total": total, "details": details}


@shared_task(name="crm.lead.public_pool.auto_recycle")
@db_task
def crm_lead_public_pool_auto_recycle(db, days_default: int = 30) -> dict:
    """自动回收长期未跟进的线索（读 CRM 设置 recycle_days，否则用默认 30 天），并通知负责人。"""
    tenant_ids = [r[0] for r in db.execute(select(Tenant.id).order_by(Tenant.id.asc())).all()]
    now = datetime.now(timezone.utc)

    total = 0
    details: list[dict] = []
    import app.crud.crm as _crm
    recycle_fn = getattr(_crm, "recycle_stale_leads", None)

    for tenant_id in tenant_ids:
        try:
            s = get_setting(db, tenant_id=tenant_id, key=RECYCLE_DAYS_KEY)
            days = _parse_int(s.value if s else None, days_default)
            if days <= 0:
                days = days_default
            if callable(recycle_fn):
                recycled = recycle_fn(db, tenant_id=tenant_id, days=days, now=now)
            else:
                recycled = []
            recycled_count = len(recycled) if isinstance(recycled, list) else int(recycled or 0)
            if isinstance(recycled, list):
                for lead_id, prev_owner in recycled:
                    if prev_owner:
                        create_notification(
                            db,
                            tenant_id=tenant_id,
                            user_id=prev_owner,
                            title="线索已回收至公海",
                            content=f"线索 #{lead_id} 因长期未跟进已回收至公海池",
                            level="warning",
                            biz_type="crm_lead",
                            biz_id=lead_id,
                            feishu_event="crm.lead.recycled",
                        )
            db.commit()
            if recycled_count:
                total += recycled_count
                details.append({"tenant_id": int(tenant_id), "recycled": recycled_count, "days": int(days)})
        except Exception:
            db.rollback()
            continue

    return {"total": int(total), "details": details}


@shared_task(name="crm.quotation.auto-expire")
@db_task
def crm_quotation_auto_expire(db) -> dict:
    """把 status=sent 且 valid_until < today 的报价单置为 expired。"""
    tenant_ids = [r[0] for r in db.execute(select(Tenant.id).order_by(Tenant.id.asc())).all()]
    today = datetime.now(timezone.utc).date()

    import app.crud.crm as _crm
    expire_fn = getattr(_crm, "expire_quotations", None)

    total = 0
    details: list[dict] = []
    for tenant_id in tenant_ids:
        try:
            if callable(expire_fn):
                cnt = expire_fn(db, tenant_id=tenant_id, today=today)
            else:
                cnt = 0
            db.commit()
            if cnt:
                total += int(cnt)
                details.append({"tenant_id": int(tenant_id), "expired": int(cnt)})
        except Exception:
            db.rollback()
            continue
    return {"total": int(total), "details": details, "today": str(today)}


@shared_task(name="crm.contract.renewal-notice")
@db_task
def crm_contract_renewal_notice(db, default_days: int = 30) -> dict:
    """检查 end_date - today <= renewal_notice_days 的合同，通知负责人。"""
    tenant_ids = [r[0] for r in db.execute(select(Tenant.id).order_by(Tenant.id.asc())).all()]
    today = datetime.now(timezone.utc).date()

    import app.crud.crm as _crm
    list_fn = getattr(_crm, "list_contracts_needing_renewal_notice", None)

    total = 0
    details: list[dict] = []
    for tenant_id in tenant_ids:
        try:
            s = get_setting(db, tenant_id=tenant_id, key="crm.contract.renewal_notice_days")
            days = _parse_int(s.value if s else None, default_days)
            if days <= 0:
                days = default_days
            if callable(list_fn):
                items = list_fn(db, tenant_id=tenant_id, days=days, today=today)
            else:
                items = []
            for contract in items or []:
                cid = getattr(contract, "id", None)
                owner = getattr(contract, "owner_user_id", None)
                end_date = getattr(contract, "end_date", None)
                if owner:
                    create_notification(
                        db,
                        tenant_id=tenant_id,
                        user_id=owner,
                        title="合同到期提醒",
                        content=f"合同 {getattr(contract, 'code', cid)} 将于 {end_date} 到期，请注意续签。",
                        level="info",
                        biz_type="crm_contract",
                        biz_id=cid,
                        feishu_event="crm.contract.renewal_notice",
                    )
                    total += 1
            db.commit()
            if items:
                details.append({"tenant_id": int(tenant_id), "notified": len(items), "days": int(days)})
        except Exception:
            db.rollback()
            continue
    return {"total": int(total), "details": details, "today": str(today)}


@shared_task(name="crm.contract.payment-overdue-scan")
@db_task
def crm_contract_payment_overdue_scan(db) -> dict:
    """扫描 payment_plans.due_date < today 且 status in (pending, partial) 且 actual_amount < amount 的，置为 overdue 并通知。"""
    tenant_ids = [r[0] for r in db.execute(select(Tenant.id).order_by(Tenant.id.asc())).all()]
    today = datetime.now(timezone.utc).date()

    import app.crud.crm as _crm
    scan_fn = getattr(_crm, "scan_overdue_payment_plans", None)

    total = 0
    details: list[dict] = []
    for tenant_id in tenant_ids:
        try:
            if callable(scan_fn):
                items = scan_fn(db, tenant_id=tenant_id, today=today)
            else:
                items = []
            for plan in items or []:
                pid = getattr(plan, "id", None)
                contract_id = getattr(plan, "contract_id", None)
                owner = getattr(plan, "owner_user_id", None)
                if owner:
                    create_notification(
                        db,
                        tenant_id=tenant_id,
                        user_id=owner,
                        title="付款计划已逾期",
                        content=f"合同付款计划 #{pid} 已逾期，请及时跟进。",
                        level="warning",
                        biz_type="crm_contract",
                        biz_id=contract_id,
                        feishu_event="crm.contract.payment_overdue",
                    )
                total += 1
            db.commit()
            if items:
                details.append({"tenant_id": int(tenant_id), "overdue": len(items)})
        except Exception:
            db.rollback()
            continue
    return {"total": int(total), "details": details, "today": str(today)}


@shared_task(name="crm.campaign.auto-status")
@db_task
def crm_campaign_auto_status(db) -> dict:
    """根据 start_date / end_date，自动将 planned -> active -> completed，并重算每个 active 的 ROI。"""
    tenant_ids = [r[0] for r in db.execute(select(Tenant.id).order_by(Tenant.id.asc())).all()]
    today = datetime.now(timezone.utc).date()

    import app.crud.crm as _crm
    auto_fn = getattr(_crm, "auto_campaign_status_update", None)
    roi_fn = getattr(_crm, "recalculate_campaign_roi", None)
    get_fn = getattr(_crm, "get_active_campaigns", None)

    total = 0
    details: list[dict] = []
    for tenant_id in tenant_ids:
        try:
            if callable(auto_fn):
                cnt = auto_fn(db, tenant_id=tenant_id, today=today)
            else:
                cnt = 0
            if callable(roi_fn) and callable(get_fn):
                active_list = get_fn(db, tenant_id=tenant_id)
                for c in active_list or []:
                    try:
                        roi_fn(db, c)
                    except Exception:
                        continue
            db.commit()
            if cnt:
                total += int(cnt)
                details.append({"tenant_id": int(tenant_id), "updated": int(cnt)})
        except Exception:
            db.rollback()
            continue
    return {"total": int(total), "details": details, "today": str(today)}


@shared_task(name="crm.customer.profile.recalculate")
@db_task
def crm_customer_profile_recalculate(db) -> dict:
    """遍历每个 tenant 的每个 customer_id，调用 crud.recalculate_customer_profile 重算画像字段。"""
    tenant_ids = [r[0] for r in db.execute(select(Tenant.id).order_by(Tenant.id.asc())).all()]

    import app.crud.crm as _crm
    list_fn = getattr(_crm, "list_customer_ids", None)
    recalc_fn = getattr(_crm, "recalculate_customer_profile", None)

    total = 0
    details: list[dict] = []
    for tenant_id in tenant_ids:
        try:
            if callable(list_fn):
                ids = list_fn(db, tenant_id=tenant_id)
            else:
                ids = []
            updated = 0
            if callable(recalc_fn):
                for cid in ids:
                    try:
                        recalc_fn(db, tenant_id=tenant_id, customer_id=cid)
                        updated += 1
                    except Exception:
                        continue
            db.commit()
            if updated:
                total += updated
                details.append({"tenant_id": int(tenant_id), "updated": int(updated)})
        except Exception:
            db.rollback()
            continue
    return {"total": int(total), "details": details}
