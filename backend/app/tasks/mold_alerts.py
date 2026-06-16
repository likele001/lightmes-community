"""模具寿命预警 Celery 定时任务"""
import logging

from celery import shared_task
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.celery_app import celery
from app.core.db import SessionLocal
from app.models.mold import Mold
from app.crud.notification import create_notification

logger = logging.getLogger(__name__)


@shared_task(name="mold.overdue_scan", bind=True, max_retries=2)
def mold_overdue_scan(self):
    """扫描所有租户的模具寿命预警（每天执行一次）"""
    db: Session = SessionLocal()
    try:
        # 查询所有 active 且有预期寿命的模具
        molds = db.scalars(
            select(Mold).where(Mold.status == "active", Mold.expected_lifespan.isnot(None))
        ).all()

        alerted = 0
        for m in molds:
            if not m.expected_lifespan or m.expected_lifespan <= 0:
                continue
            pct = (m.current_shots or 0) / m.expected_lifespan
            if pct >= 0.8:
                level = "critical" if pct >= 1.0 else ("warning" if pct >= 0.9 else "info")
                title = "模具寿命预警"
                content = (
                    f"模具 {m.code}({m.name}) 已使用 {m.current_shots}/{m.expected_lifespan} 次"
                    f"（{pct * 100:.0f}%）"
                )
                # 查找拥有 equipment.manage 权限的用户通知
                create_notification(
                    db,
                    tenant_id=m.tenant_id,
                    user_id=None,
                    title=title,
                    content=content,
                    level=level,
                    biz_type="mold",
                    biz_id=m.id,
                )
                alerted += 1

        db.commit()
        logger.info("Mold overdue scan completed: %d alerts generated", alerted)
        return {"alerted": alerted}
    except Exception as exc:
        db.rollback()
        logger.exception("Mold overdue scan failed")
        raise self.retry(exc=exc, countdown=300)
    finally:
        db.close()
