"""客户对账单 Excel 导出 Celery 任务"""
import logging
from datetime import date

from celery import shared_task
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.db import SessionLocal
from app.models.finance import Statement, StatementItem
from app.models.customer import Customer
from app.models.order import Order
from app.tasks._excel_utils import fail_job, load_job, save_excel_and_finish, start_job

logger = logging.getLogger(__name__)


@shared_task(name="finance.statement_excel")
def export_statement_excel(job_id: int) -> dict:
    """客户对账单 Excel 导出：支持单个客户或全部客户"""
    db = SessionLocal()
    try:
        job = load_job(db, job_id)
        if not job:
            return {"ok": False, "msg": "skip"}

        params = start_job(db, job) or {}
        customer_id = params.get("customer_id")
        status = params.get("status")

        from openpyxl import Workbook
        wb = Workbook()
        ws = wb.active
        ws.title = "客户对账单"
        ws.append([
            "对账单号", "客户编码", "客户名称", "期间起", "期间止",
            "合计金额", "状态", "订单号", "订单金额", "备注",
        ])

        stmt = (
            select(Statement)
            .where(Statement.tenant_id == job.tenant_id)
            .options(
                selectinload(Statement.customer),
                selectinload(Statement.items).selectinload(StatementItem.order),
            )
            .order_by(Statement.id.desc())
        )
        if customer_id:
            stmt = stmt.where(Statement.customer_id == int(customer_id))
        if status:
            stmt = stmt.where(Statement.status == status)
        statements = db.scalars(stmt).all()

        for st in statements:
            cust_code = st.customer.code if st.customer else ""
            cust_name = st.customer.name if st.customer else ""
            ps = str(st.period_start) if st.period_start else ""
            pe = str(st.period_end) if st.period_end else ""
            total = float(st.total_amount)

            if not st.items:
                ws.append([st.code, cust_code, cust_name, ps, pe, total, st.status, "", "", st.remark or ""])
            else:
                for si in st.items:
                    order_code = si.order.code if si.order else ""
                    ws.append([st.code, cust_code, cust_name, ps, pe, total, st.status,
                               order_code, float(si.amount), st.remark or ""])

        suffix = f"customer_{customer_id}" if customer_id else "all"
        filename = f"customer_statements_{suffix}.xlsx"
        return save_excel_and_finish(db, job, wb, filename)

    except Exception as e:
        logger.exception("export_statement_excel failed: %s", e)
        return fail_job(db, job_id, e)
    finally:
        db.close()
