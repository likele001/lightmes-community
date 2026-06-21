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




@shared_task(name="ai.rag.reindex")
@db_task
def ai_rag_reindex(db) -> dict:
    """RAG 文档向量索引定时检查重建。"""
    from app.services.ai.rag_indexer import scheduled_reindex

    return scheduled_reindex(db)


@shared_task(name="ai.predict.train_all")
@db_task
def ai_predict_train_all(db) -> dict:
    """Train prediction models for all tenants (weekly scheduled task)."""
    from app.models.tenant import Tenant
    from app.services.ai.predict.equipment_predictor import train_all_equipment
    from sqlalchemy import select

    tenant_ids = [r[0] for r in db.execute(select(Tenant.id)).all()]
    results = []
    for tid in tenant_ids:
        try:
            r = train_all_equipment(db, tid)
            results.append({"tenant_id": tid, **r})
        except Exception as e:
            results.append({"tenant_id": tid, "ok": False, "error": str(e)[:100]})
    return {"total_tenants": len(tenant_ids), "results": results}


@shared_task(name="ai.predict.train_equipment")
@db_task
def ai_predict_train_equipment(db, tenant_id: int, equipment_id: int) -> dict:
    """Train prediction model for a single equipment."""
    from app.services.ai.predict.equipment_predictor import train_equipment_model
    return train_equipment_model(db, tenant_id, equipment_id)
