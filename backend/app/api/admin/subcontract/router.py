from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db, require_permissions
from app.core.response import ok
from app.crud.subcontract import (
    create_receive_log,
    create_send_logs,
    create_subcontract,
    get_subcontract_by_id,
    list_receive_logs,
    list_send_logs,
    list_subcontracts,
    receive_subcontract_item,
    update_subcontract_status,
)
from app.models.subcontract import SubcontractOrder
from app.models.user import User
from app.schemas.subcontract import (
    SubcontractCreateIn,
    SubcontractItemIn,
    SubcontractItemOut,
    SubcontractOut,
    SubcontractReceiveIn,
    SubcontractReceiveLogOut,
    SubcontractSendIn,
    SubcontractSendLogOut,
)
from app.services.code_generator import BizType, resolve_code

router = APIRouter(dependencies=[Depends(require_permissions(["subcontract.manage"]))])


def _item_out(it) -> dict:
    sku = getattr(it, "sku", None)
    process = getattr(it, "process", None)
    return SubcontractItemOut(
        id=it.id,
        sku_id=it.sku_id,
        sku_code=sku.code if sku else None,
        sku_name=sku.name if sku else None,
        process_id=it.process_id,
        process_name=process.name if process else None,
        qty=it.qty,
        unit_price=it.unit_price,
        sent_qty=it.sent_qty,
        received_qty=it.received_qty,
        remark=it.remark,
    ).model_dump()


def _out(sc) -> dict:
    sup = getattr(sc, "supplier", None)
    return SubcontractOut(
        id=sc.id,
        tenant_id=sc.tenant_id,
        supplier_id=sc.supplier_id,
        supplier_name=sup.name if sup else None,
        code=sc.code,
        status=sc.status,
        remark=sc.remark,
        created_by=sc.created_by,
        created_at=sc.created_at,
        updated_at=sc.updated_at,
        items=[SubcontractItemOut(**_item_out(it)) for it in (sc.items or [])],
    ).model_dump()


@router.get("")
def list_api(
    supplier_id: int | None = Query(default=None),
    status: str | None = Query(default=None),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    items = list_subcontracts(db, current_user.tenant_id, supplier_id, status, offset, limit)
    return ok([_out(it) for it in items])


@router.get("/{oid}")
def get_api(oid: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    sc = get_subcontract_by_id(db, current_user.tenant_id, oid)
    if not sc:
        raise HTTPException(status_code=404, detail="委外单不存在")
    return ok(_out(sc))


@router.post("")
def create_api(
    body: SubcontractCreateIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tenant_id = current_user.tenant_id
    code = resolve_code(
        db,
        tenant_id=tenant_id,
        biz_type=BizType.SUBCONTRACT,
        code=None,
        exists=lambda c: db.scalar(
            select(SubcontractOrder).where(SubcontractOrder.tenant_id == tenant_id, SubcontractOrder.code == c)
        ) is not None,
        duplicate_msg="委外单号已存在",
    )
    sc = create_subcontract(db, tenant_id, body.supplier_id, code, body.remark, current_user.id, items=[])
    db.flush()
    return ok(_out(sc))


@router.post("/{oid}/items")
def add_items_api(
    oid: int,
    items: list[SubcontractItemIn],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sc = get_subcontract_by_id(db, current_user.tenant_id, oid)
    if not sc:
        raise HTTPException(status_code=404, detail="委外单不存在")
    if sc.status not in ("draft", "sent", "partial_received"):
        raise HTTPException(status_code=400, detail="当前状态不可编辑明细")
    from app.models.subcontract import SubcontractOrderItem
    for it in items:
        sc.items.append(
            SubcontractOrderItem(
                tenant_id=current_user.tenant_id,
                sku_id=it.sku_id,
                process_id=it.process_id,
                qty=it.qty,
                unit_price=it.unit_price,
                remark=it.remark,
            )
        )
    db.flush()
    return ok(_out(sc))


@router.post("/{oid}/send")
def send_api(
    oid: int,
    body: SubcontractSendIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """发料：记录发料日志并累加 sent_qty"""
    sc = get_subcontract_by_id(db, current_user.tenant_id, oid)
    if not sc:
        raise HTTPException(status_code=404, detail="委外单不存在")
    if sc.status not in ("draft", "sent"):
        raise HTTPException(status_code=400, detail="当前状态不可发料")

    create_send_logs(
        db, current_user.tenant_id, oid, body.sends, sent_by=current_user.id,
    )
    # 首次发料自动改为 sent 状态
    if sc.status == "draft":
        update_subcontract_status(db, sc, "sent")
    db.flush()
    return ok(_out(sc))


@router.post("/{oid}/receive")
def receive_api(
    oid: int,
    body: SubcontractReceiveIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sc = get_subcontract_by_id(db, current_user.tenant_id, oid)
    if not sc:
        raise HTTPException(status_code=404, detail="委外单不存在")
    if sc.status not in ("sent", "partial_received"):
        raise HTTPException(status_code=400, detail="当前状态不可收货")
    item = next((it for it in (sc.items or []) if it.id == body.item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="明细项不存在")
    if item.received_qty + body.qty > item.qty:
        raise HTTPException(status_code=400, detail="收货数量超过委外数量")

    # 记录收货日志
    create_receive_log(
        db, current_user.tenant_id, oid, body.item_id, body.qty,
        remark=body.remark, received_by=current_user.id,
    )
    receive_subcontract_item(db, item, body.qty)
    # 更新主单状态
    all_received = all(it.received_qty >= it.qty for it in (sc.items or []))
    partial = any(it.received_qty > 0 for it in (sc.items or []))
    if all_received:
        update_subcontract_status(db, sc, "received")
    elif partial:
        update_subcontract_status(db, sc, "partial_received")
    db.flush()
    return ok(_out(sc))


@router.post("/{oid}/settle")
def settle_api(oid: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    sc = get_subcontract_by_id(db, current_user.tenant_id, oid)
    if not sc:
        raise HTTPException(status_code=404, detail="委外单不存在")
    if sc.status != "received":
        raise HTTPException(status_code=400, detail="仅已收货可结算")
    update_subcontract_status(db, sc, "settled")
    return ok(_out(sc))


@router.get("/{oid}/send-logs")
def list_send_logs_api(oid: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """查询委外单的发料日志"""
    logs = list_send_logs(db, current_user.tenant_id, oid)
    return ok([SubcontractSendLogOut(
        id=l.id, item_id=l.item_id, qty=l.qty,
        remark=l.remark, sent_by=l.sent_by, sent_at=l.sent_at,
    ).model_dump() for l in logs])


@router.get("/{oid}/receive-logs")
def list_receive_logs_api(oid: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """查询委外单的收货日志"""
    logs = list_receive_logs(db, current_user.tenant_id, oid)
    return ok([SubcontractReceiveLogOut(
        id=l.id, item_id=l.item_id, qty=l.qty,
        remark=l.remark, received_by=l.received_by, received_at=l.received_at,
    ).model_dump() for l in logs])
