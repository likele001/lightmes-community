from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db, require_permissions
from app.core.response import ok
from app.crud.mrp import create_mrp_run, get_mrp_run_by_id, get_mrp_demands, list_mrp_runs, run_mrp_calculation
from app.models.mrp import MrpRun
from app.models.user import User
from app.schemas.mrp import MrpConvertIn, MrpDemandOut, MrpRunDetailOut, MrpRunIn, MrpRunOut
from app.services.code_generator import BizType, resolve_code
from app.services.mrp_suggestion import convert_shortage_to_purchase_order

router = APIRouter(dependencies=[Depends(require_permissions(["mrp.run"]))])


def _demand_out(d) -> dict:
    sku = getattr(d, "sku", None)
    return MrpDemandOut(
        id=d.id,
        run_id=d.run_id,
        sku_id=d.sku_id,
        sku_code=sku.code if sku else None,
        sku_name=sku.name if sku else None,
        required_qty=d.required_qty,
        in_stock_qty=d.in_stock_qty,
        on_order_qty=d.on_order_qty,
        shortage_qty=d.shortage_qty,
        suggestion=d.suggestion,
        remark=d.remark,
    ).model_dump()


def _run_out(r) -> dict:
    return MrpRunOut(
        id=r.id,
        code=r.code,
        status=r.status,
        scope=r.scope,
        run_at=r.run_at,
        result_summary=r.result_summary,
        error_message=r.error_message,
        created_by=r.created_by,
        created_at=r.created_at,
    ).model_dump()


@router.post("/run")
def run_mrp(
    body: MrpRunIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tenant_id = current_user.tenant_id
    code = resolve_code(
        db,
        tenant_id=tenant_id,
        biz_type=BizType.MRP_RUN,
        code=None,
        exists=lambda c: db.scalar(
            select(MrpRun).where(MrpRun.tenant_id == tenant_id, MrpRun.code == c)
        ) is not None,
        duplicate_msg="MRP 编号已存在",
    )
    run = create_mrp_run(db, tenant_id, code, body.scope, current_user.id)

    try:
        parsed_order_ids = None
        if body.order_ids:
            parsed_order_ids = [int(x.strip()) for x in body.order_ids.split(",") if x.strip()]
        demands = run_mrp_calculation(db, tenant_id, run, parsed_order_ids)
        total_shortage = sum(d.shortage_qty for d in demands)
        shortage_count = sum(1 for d in demands if d.shortage_qty > 0)
        run.status = "done"
        run.result_summary = f'{{"total_shortage_items":{shortage_count},"total_shortage_qty":{total_shortage},"affected_sku_count":{len(demands)}}}'
    except Exception as e:
        run.status = "failed"
        run.error_message = str(e)
    db.flush()
    return ok(_run_out(run))


@router.get("/runs")
def list_runs(
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    runs = list_mrp_runs(db, current_user.tenant_id, offset, limit)
    return ok([_run_out(r) for r in runs])


@router.get("/runs/{run_id}")
def get_run_detail(
    run_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    run = get_mrp_run_by_id(db, current_user.tenant_id, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="MRP 运算记录不存在")
    demands = get_mrp_demands(db, current_user.tenant_id, run_id)
    result = MrpRunDetailOut(
        run=MrpRunOut(
            id=run.id, code=run.code, status=run.status, scope=run.scope,
            run_at=run.run_at, result_summary=run.result_summary,
            error_message=run.error_message, created_by=run.created_by,
            created_at=run.created_at,
        ),
        demands=[MrpDemandOut(**_demand_out(d)) for d in demands],
    )
    return ok(result.model_dump())


@router.post("/runs/{run_id}/convert")
def convert_to_purchase_orders(
    run_id: int,
    body: MrpConvertIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """将 MRP 建议转为采购单"""
    try:
        result = convert_shortage_to_purchase_order(
            db,
            tenant_id=current_user.tenant_id,
            run_id=run_id,
            supplier_id=body.supplier_id,
            user_id=current_user.id,
        )
        return ok(result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
