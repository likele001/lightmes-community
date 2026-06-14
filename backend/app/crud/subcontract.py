from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.subcontract import (
    SubcontractOrder,
    SubcontractOrderItem,
    SubcontractReceiveLog,
    SubcontractSendLog,
)


def get_subcontract_by_id(db: Session, tenant_id: int, oid: int) -> SubcontractOrder | None:
    return db.scalar(
        select(SubcontractOrder)
        .where(SubcontractOrder.tenant_id == tenant_id, SubcontractOrder.id == oid)
        .options(
            selectinload(SubcontractOrder.supplier),
            selectinload(SubcontractOrder.items)
                .selectinload(SubcontractOrderItem.sku),
            selectinload(SubcontractOrder.items)
                .selectinload(SubcontractOrderItem.process),
        )
    )


def list_subcontracts(
    db: Session,
    tenant_id: int,
    supplier_id: int | None = None,
    status: str | None = None,
    offset: int = 0,
    limit: int = 50,
) -> list[SubcontractOrder]:
    stmt = (
        select(SubcontractOrder)
        .where(SubcontractOrder.tenant_id == tenant_id)
        .options(selectinload(SubcontractOrder.supplier))
        .order_by(SubcontractOrder.id.desc())
        .offset(offset)
        .limit(limit)
    )
    if supplier_id is not None:
        stmt = stmt.where(SubcontractOrder.supplier_id == supplier_id)
    if status:
        stmt = stmt.where(SubcontractOrder.status == status)
    return db.scalars(stmt).all()


def create_subcontract(
    db: Session,
    tenant_id: int,
    supplier_id: int,
    code: str,
    remark: str | None,
    created_by: int | None,
    items: list[dict],
) -> SubcontractOrder:
    sc = SubcontractOrder(
        tenant_id=tenant_id,
        supplier_id=supplier_id,
        code=code,
        remark=remark,
        created_by=created_by,
    )
    sc.items = [
        SubcontractOrderItem(
            tenant_id=tenant_id,
            sku_id=it["sku_id"],
            process_id=it.get("process_id"),
            qty=it["qty"],
            unit_price=it.get("unit_price"),
            remark=it.get("remark"),
        )
        for it in items
    ]
    db.add(sc)
    db.flush()
    return sc


def update_subcontract_status(db: Session, sc: SubcontractOrder, status: str) -> None:
    sc.status = status
    db.flush()


def receive_subcontract_item(db: Session, item: SubcontractOrderItem, qty: int) -> None:
    item.received_qty += qty
    db.flush()


def create_send_logs(
    db: Session,
    tenant_id: int,
    order_id: int,
    sends: list[dict],
    sent_by: int | None = None,
) -> list[SubcontractSendLog]:
    """批量创建发料日志并累加 sent_qty"""
    logs: list[SubcontractSendLog] = []
    for s in sends:
        log = SubcontractSendLog(
            tenant_id=tenant_id,
            order_id=order_id,
            item_id=s["item_id"],
            qty=s["qty"],
            remark=s.get("remark"),
            sent_by=sent_by,
        )
        logs.append(log)
    db.add_all(logs)
    # 累加 sent_qty
    item_map = {s["item_id"]: s["qty"] for s in sends}
    items = db.scalars(
        select(SubcontractOrderItem).where(
            SubcontractOrderItem.id.in_(list(item_map.keys()))
        )
    ).all()
    for it in items:
        it.sent_qty += item_map.get(it.id, 0)
    db.flush()
    return logs


def create_receive_log(
    db: Session,
    tenant_id: int,
    order_id: int,
    item_id: int,
    qty: int,
    remark: str | None = None,
    received_by: int | None = None,
) -> SubcontractReceiveLog:
    """创建收货日志"""
    log = SubcontractReceiveLog(
        tenant_id=tenant_id,
        order_id=order_id,
        item_id=item_id,
        qty=qty,
        remark=remark,
        received_by=received_by,
    )
    db.add(log)
    db.flush()
    return log


def list_send_logs(db: Session, tenant_id: int, order_id: int) -> list[SubcontractSendLog]:
    return db.scalars(
        select(SubcontractSendLog)
        .where(SubcontractSendLog.tenant_id == tenant_id, SubcontractSendLog.order_id == order_id)
        .order_by(SubcontractSendLog.id)
    ).all()


def list_receive_logs(db: Session, tenant_id: int, order_id: int) -> list[SubcontractReceiveLog]:
    return db.scalars(
        select(SubcontractReceiveLog)
        .where(SubcontractReceiveLog.tenant_id == tenant_id, SubcontractReceiveLog.order_id == order_id)
        .order_by(SubcontractReceiveLog.id)
    ).all()
