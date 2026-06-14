from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.quotation import Quotation, QuotationItem


def get_quotation_by_id(db: Session, tenant_id: int, qid: int) -> Quotation | None:
    return db.scalar(
        select(Quotation)
        .where(Quotation.tenant_id == tenant_id, Quotation.id == qid)
        .options(selectinload(Quotation.customer), selectinload(Quotation.items).selectinload(QuotationItem.sku))
    )


def list_quotations(
    db: Session,
    tenant_id: int,
    customer_id: int | None = None,
    status: str | None = None,
    offset: int = 0,
    limit: int = 50,
) -> list[Quotation]:
    stmt = (
        select(Quotation)
        .where(Quotation.tenant_id == tenant_id)
        .options(selectinload(Quotation.customer))
        .order_by(Quotation.id.desc())
        .offset(offset)
        .limit(limit)
    )
    if customer_id is not None:
        stmt = stmt.where(Quotation.customer_id == customer_id)
    if status:
        stmt = stmt.where(Quotation.status == status)
    return db.scalars(stmt).all()


def create_quotation(
    db: Session,
    tenant_id: int,
    customer_id: int,
    code: str,
    valid_until: str | None,
    remark: str | None,
    created_by: int | None,
    items: list[dict],
) -> Quotation:
    qt = Quotation(
        tenant_id=tenant_id,
        customer_id=customer_id,
        code=code,
        valid_until=valid_until,
        remark=remark,
        created_by=created_by,
    )
    qt.items = [
        QuotationItem(
            tenant_id=tenant_id,
            line_no=i + 1,
            sku_id=it["sku_id"],
            qty=it["qty"],
            unit_price=it.get("unit_price"),
            amount=it.get("amount"),
            remark=it.get("remark"),
        )
        for i, it in enumerate(items)
    ]
    db.add(qt)
    db.flush()
    return qt


def update_quotation_status(db: Session, qt: Quotation, status: str) -> None:
    qt.status = status
    db.flush()
