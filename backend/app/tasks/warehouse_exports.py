"""库存明细 Excel 导出 Celery 任务"""
import logging
from datetime import date

from celery import shared_task
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.db import SessionLocal
from app.models.warehouse import Stock, StockLog, Warehouse
from app.tasks._excel_utils import fail_job, load_job, save_excel_and_finish, start_job

logger = logging.getLogger(__name__)


@shared_task(name="warehouse.stock_excel")
def export_stock_excel(job_id: int) -> dict:
    """库存明细 + 出入库流水 Excel 导出"""
    db = SessionLocal()
    try:
        job = load_job(db, job_id)
        if not job:
            return {"ok": False, "msg": "skip"}

        params = start_job(db, job) or {}
        warehouse_id = params.get("warehouse_id")

        from openpyxl import Workbook
        wb = Workbook()

        # ── Sheet1: 库存明细 ──
        ws1 = wb.active
        ws1.title = "库存明细"
        ws1.append(["仓库编码", "仓库名称", "型号编码", "型号名称", "库存数量", "最后更新时间"])

        stmt = (
            select(Stock)
            .where(Stock.tenant_id == job.tenant_id)
            .options(
                selectinload(Stock.warehouse),
                selectinload(Stock.sku),
            )
            .order_by(Stock.warehouse_id, Stock.sku_id)
        )
        if warehouse_id:
            stmt = stmt.where(Stock.warehouse_id == int(warehouse_id))
        stocks = db.scalars(stmt).all()

        for s in stocks:
            wh_name = s.warehouse.name if s.warehouse else ""
            wh_code = s.warehouse.code if s.warehouse else ""
            sku_code = s.sku.code if s.sku else ""
            sku_name = s.sku.name if s.sku else ""
            ws1.append([wh_code, wh_name, sku_code, sku_name, int(s.qty),
                        s.updated_at.strftime("%Y-%m-%d %H:%M") if s.updated_at else ""])

        # ── Sheet2: 出入库流水 ──
        ws2 = wb.create_sheet("出入库流水")
        ws2.append(["仓库编码", "仓库名称", "型号编码", "型号名称", "变动数量", "结余数量", "业务类型", "备注", "时间"])

        log_stmt = (
            select(StockLog)
            .where(StockLog.tenant_id == job.tenant_id)
            .options(
                selectinload(StockLog.warehouse),
                selectinload(StockLog.sku),
            )
            .order_by(StockLog.id.desc())
            .limit(10000)
        )
        if warehouse_id:
            log_stmt = log_stmt.where(StockLog.warehouse_id == int(warehouse_id))
        logs = db.scalars(log_stmt).all()

        for l in logs:
            wh_name = l.warehouse.name if l.warehouse else ""
            wh_code = l.warehouse.code if l.warehouse else ""
            sku_code = l.sku.code if l.sku else ""
            sku_name = l.sku.name if l.sku else ""
            ws2.append([wh_code, wh_name, sku_code, sku_name, int(l.change_qty), int(l.balance_qty),
                        l.biz_type, l.remark or "",
                        l.created_at.strftime("%Y-%m-%d %H:%M") if l.created_at else ""])

        filename = f"stock_report_{warehouse_id or 'all'}.xlsx"
        return save_excel_and_finish(db, job, wb, filename)

    except Exception as e:
        logger.exception("export_stock_excel failed: %s", e)
        return fail_job(db, job_id, e)
    finally:
        db.close()
