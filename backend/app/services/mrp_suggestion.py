"""MRP 采购建议服务：将缺料建议合并并转为采购单"""
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.crud.mrp import get_mrp_demands, get_mrp_run_by_id
from app.crud.purchase_order import create_purchase_order
from app.crud.supplier import get_supplier_by_id
from app.models.material import Material


def convert_shortage_to_purchase_order(
    db: Session,
    tenant_id: int,
    run_id: int,
    supplier_id: int,
    user_id: int | None = None,
) -> dict:
    """将 MRP 缺料建议转为采购单。

    Returns:
        {"purchase_order_id": int, "code": str}

    Raises:
        ValueError: 当无法转换时（运行不存在 / 无缺料 / 无物料等）
    """
    run = get_mrp_run_by_id(db, tenant_id, run_id)
    if not run:
        raise ValueError("MRP 运算记录不存在")

    supplier = get_supplier_by_id(db, tenant_id, supplier_id)
    if not supplier:
        raise ValueError("供应商不存在")

    demands = get_mrp_demands(db, tenant_id, run_id)
    shortage_demands = [d for d in demands if d.shortage_qty > 0]
    if not shortage_demands:
        raise ValueError("没有缺料项可转为采购单")

    items = []
    for d in shortage_demands:
        mat = db.scalar(
            select(Material).where(Material.tenant_id == tenant_id, Material.sku_id == d.sku_id)
        )
        if mat:
            items.append((mat.id, d.shortage_qty, None, None))

    if not items:
        raise ValueError("未找到可采购的物料")

    po = create_purchase_order(
        db,
        tenant_id=tenant_id,
        supplier_id=supplier_id,
        code=None,
        remark=f"MRP#{run.code} 自动生成",
        created_by=user_id,
        items=items,
    )
    db.flush()
    return {"purchase_order_id": po.id, "code": po.code}
