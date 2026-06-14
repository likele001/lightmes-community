from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db, require_permissions
from app.core.response import ok
from app.crud.quotation import create_quotation, get_quotation_by_id, list_quotations, update_quotation_status
from app.models.order import Order
from app.models.quotation import Quotation
from app.models.user import User
from app.schemas.quotation import (
    QuotationCreateIn,
    QuotationItemIn,
    QuotationItemOut,
    QuotationOut,
    QuotationUpdateIn,
)
from app.services.code_generator import BizType, resolve_code

router = APIRouter(dependencies=[Depends(require_permissions(["quotation.manage"]))])


def _item_out(it) -> dict:
    sku = getattr(it, "sku", None)
    return QuotationItemOut(
        id=it.id,
        line_no=it.line_no,
        sku_id=it.sku_id,
        sku_code=sku.code if sku else None,
        sku_name=sku.name if sku else None,
        qty=it.qty,
        unit_price=it.unit_price,
        amount=it.amount,
        remark=it.remark,
    ).model_dump()


def _out(qt) -> dict:
    c = getattr(qt, "customer", None)
    return QuotationOut(
        id=qt.id,
        tenant_id=qt.tenant_id,
        customer_id=qt.customer_id,
        customer_name=c.name if c else None,
        code=qt.code,
        status=qt.status,
        valid_until=qt.valid_until,
        total_amount=qt.total_amount,
        remark=qt.remark,
        created_by=qt.created_by,
        created_at=qt.created_at,
        updated_at=qt.updated_at,
        items=[QuotationItemOut(**_item_out(it)) for it in (qt.items or [])],
    ).model_dump()


@router.get("")
def list_api(
    customer_id: int | None = Query(default=None),
    status: str | None = Query(default=None),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    items = list_quotations(db, current_user.tenant_id, customer_id, status, offset, limit)
    return ok([_out(it) for it in items])


@router.get("/{qid}")
def get_api(qid: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    qt = get_quotation_by_id(db, current_user.tenant_id, qid)
    if not qt:
        raise HTTPException(status_code=404, detail="报价单不存在")
    return ok(_out(qt))


@router.post("")
def create_api(
    body: QuotationCreateIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tenant_id = current_user.tenant_id
    code = resolve_code(
        db,
        tenant_id=tenant_id,
        biz_type=BizType.QUOTATION,
        code=None,
        exists=lambda c: db.scalar(
            select(Quotation).where(Quotation.tenant_id == tenant_id, Quotation.code == c)
        ) is not None,
        duplicate_msg="报价单号已存在",
    )
    valid_until_str = str(body.valid_until) if body.valid_until else None
    qt = create_quotation(db, tenant_id, body.customer_id, code, valid_until_str, body.remark, current_user.id, items=[])
    db.flush()
    return ok(_out(qt))


@router.put("/{qid}")
def update_api(
    qid: int,
    body: QuotationUpdateIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    qt = get_quotation_by_id(db, current_user.tenant_id, qid)
    if not qt:
        raise HTTPException(status_code=404, detail="报价单不存在")
    if qt.status != "draft":
        raise HTTPException(status_code=400, detail="仅草稿状态可编辑")
    if body.valid_until is not None:
        qt.valid_until = body.valid_until
    if body.remark is not None:
        qt.remark = body.remark
    db.flush()
    return ok(_out(qt))


@router.post("/{qid}/items")
def add_items_api(
    qid: int,
    items: list[QuotationItemIn],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    qt = get_quotation_by_id(db, current_user.tenant_id, qid)
    if not qt:
        raise HTTPException(status_code=404, detail="报价单不存在")
    if qt.status != "draft":
        raise HTTPException(status_code=400, detail="仅草稿状态可编辑明细")
    from app.models.quotation import QuotationItem
    start_line = max((it.line_no for it in (qt.items or [])), default=0)
    for i, it in enumerate(items):
        qt.items.append(
            QuotationItem(
                tenant_id=current_user.tenant_id,
                line_no=start_line + i + 1,
                sku_id=it.sku_id,
                qty=it.qty,
                unit_price=it.unit_price,
                amount=it.amount,
                remark=it.remark,
            )
        )
    # 重新计算总金额
    total = sum((float(it.amount or 0) for it in qt.items), 0.0)
    qt.total_amount = total
    db.flush()
    return ok(_out(qt))


@router.post("/{qid}/submit")
def submit_api(qid: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    qt = get_quotation_by_id(db, current_user.tenant_id, qid)
    if not qt:
        raise HTTPException(status_code=404, detail="报价单不存在")
    if qt.status != "draft":
        raise HTTPException(status_code=400, detail="仅草稿可提交")
    update_quotation_status(db, qt, "submitted")
    return ok(_out(qt))


@router.post("/{qid}/approve")
def approve_api(qid: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    qt = get_quotation_by_id(db, current_user.tenant_id, qid)
    if not qt:
        raise HTTPException(status_code=404, detail="报价单不存在")
    if qt.status != "submitted":
        raise HTTPException(status_code=400, detail="仅已提交可审批")
    update_quotation_status(db, qt, "approved")
    return ok(_out(qt))


@router.post("/{qid}/reject")
def reject_api(qid: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    qt = get_quotation_by_id(db, current_user.tenant_id, qid)
    if not qt:
        raise HTTPException(status_code=404, detail="报价单不存在")
    if qt.status != "submitted":
        raise HTTPException(status_code=400, detail="仅已提交可驳回")
    update_quotation_status(db, qt, "rejected")
    return ok(_out(qt))


@router.post("/{qid}/convert")
def convert_api(qid: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """报价单转为正式订单"""
    qt = get_quotation_by_id(db, current_user.tenant_id, qid)
    if not qt:
        raise HTTPException(status_code=404, detail="报价单不存在")
    if qt.status != "approved":
        raise HTTPException(status_code=400, detail="仅已审批可转订单")

    from app.crud.order import create_order
    order_code = resolve_code(
        db,
        tenant_id=current_user.tenant_id,
        biz_type=BizType.ORDER,
        code=None,
        exists=lambda c: db.scalar(
            select(Order).where(Order.tenant_id == current_user.tenant_id, Order.code == c)
        ) is not None,
        duplicate_msg="订单号已存在",
    )
    order = create_order(
        db,
        tenant_id=current_user.tenant_id,
        customer_id=qt.customer_id,
        code=order_code,
        due_date=None,
        remark=f"来自报价单 {qt.code}",
        items=[(it.line_no, it.sku_id, it.qty, it.remark) for it in (qt.items or [])],
    )
    update_quotation_status(db, qt, "converted")
    return ok({"order_id": order.id, "order_code": order.code})
