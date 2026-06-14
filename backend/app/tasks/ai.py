"""AI 相关 Celery 任务"""
from celery import shared_task

from app.tasks.decorators import db_task


@shared_task(name="ai.alerts.scan")
@db_task
def ai_alerts_scan(db) -> dict:
    from app.services.ai.alerts import scan_all_tenants

    return scan_all_tenants(db)


@shared_task(name="ai.daily_brief.send")
@db_task
def ai_daily_brief_send(db) -> dict:
    from datetime import datetime

    from app.services.daily_brief import send_daily_briefs_for_all_tenants

    hour = datetime.now().hour
    return send_daily_briefs_for_all_tenants(db, current_hour=hour)


@shared_task(name="audit.prescreen")
def audit_prescreen_task(tenant_id: int, unit_id: int) -> dict:
    """审核预审 — 需要精细控制 commit/rollback，不使用 @db_task"""
    from app.services.audit_prescreen import run_prescreen

    from app.core.db import SessionLocal

    db = SessionLocal()
    try:
        result = run_prescreen(db, tenant_id, unit_id)
        db.commit()
        return {"ok": True, "result": result}
    except Exception as e:
        db.rollback()
        return {"ok": False, "error": str(e)[:500]}
    finally:
        db.close()
