"""采购对账单 Excel 导出 Celery 任务"""
import logging

from celery import shared_task
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.db import SessionLocal
from app.models.supplier_statement import SupplierStatement, SupplierStatementItem
from app.tasks._excel_utils import fail_job, load_job, save_excel_and_finish, start_job

logger = logging.getLogger(__name__)


@shared_task(name="purchase.statement_excel")
def export_purchase_statement_excel(job_id: int) -> dict:
    """采购对账单 Excel 导出"""
    db = SessionLocal()
    try:
        job = load_job(db, job_id)
        if not job:
            return {"ok": False, "msg": "skip"}

        params = start_job(db, job) or {}
        supplier_id = params.get("supplier_id")
        status = params.get("status")

        from openpyxl import Workbook
        wb = Workbook()
        ws = wb.active
        ws.title = "采购对账单"
        ws.append([
            "对账单号", "供应商编码", "供应商名称", "期间起", "期间止",
            "合计金额", "状态", "采购单号", "入库数量", "金额",
        ])

        stmt = (
            select(SupplierStatement)
            .where(SupplierStatement.tenant_id == job.tenant_id)
            .options(
                selectinload(SupplierStatement.supplier),
                selectinload(SupplierStatement.items).selectinload(SupplierStatementItem.purchase_order),
            )
            .order_by(SupplierStatement.id.desc())
        )
        if supplier_id:
            stmt = stmt.where(SupplierStatement.supplier_id == int(supplier_id))
        if status:
            stmt = stmt.where(SupplierStatement.status == status)
        statements = db.scalars(stmt).all()

        for st in statements:
            sup_code = st.supplier.code if st.supplier else ""
            sup_name = st.supplier.name if st.supplier else ""
            ps = str(st.period_from) if st.period_from else ""
            pe = str(st.period_to) if st.period_to else ""
            total = float(st.amount)

            if not st.items:
                ws.append([st.code, sup_code, sup_name, ps, pe, total, st.status, "", "", ""])
            else:
                for si in st.items:
                    po_code = si.purchase_order.code if si.purchase_order else ""
                    ws.append([st.code, sup_code, sup_name, ps, pe, total, st.status,
                               po_code, si.received_qty, float(si.amount)])

        suffix = f"supplier_{supplier_id}" if supplier_id else "all"
        filename = f"supplier_statements_{suffix}.xlsx"
        return save_excel_and_finish(db, job, wb, filename)

    except Exception as e:
        logger.exception("export_purchase_statement_excel failed: %s", e)
        return fail_job(db, job_id, e)
    finally:
        db.close()
