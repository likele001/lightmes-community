from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.crud.material_bom import get_effective_bom_map_by_sku_ids
from app.crud.warehouse import sum_stock_qty_by_sku_ids
from app.models.mrp import MrpDemand, MrpRun
from app.models.order import Order
from app.models.purchase import PurchaseOrder
from app.models.sku import Sku


def create_mrp_run(
    db: Session,
    tenant_id: int,
    code: str,
    scope: str,
    created_by: int | None,
) -> MrpRun:
    run = MrpRun(tenant_id=tenant_id, code=code, scope=scope, created_by=created_by)
    db.add(run)
    db.flush()
    return run


def get_mrp_run_by_id(db: Session, tenant_id: int, run_id: int) -> MrpRun | None:
    return db.scalar(
        select(MrpRun).where(MrpRun.tenant_id == tenant_id, MrpRun.id == run_id)
    )


def list_mrp_runs(
    db: Session,
    tenant_id: int,
    offset: int = 0,
    limit: int = 50,
) -> list[MrpRun]:
    return db.scalars(
        select(MrpRun)
        .where(MrpRun.tenant_id == tenant_id)
        .order_by(MrpRun.id.desc())
        .offset(offset)
        .limit(limit)
    ).all()


def get_mrp_demands(db: Session, tenant_id: int, run_id: int) -> list[MrpDemand]:
    return db.scalars(
        select(MrpDemand)
        .where(MrpDemand.tenant_id == tenant_id, MrpDemand.run_id == run_id)
        .options(selectinload(MrpDemand.sku))
        .order_by(MrpDemand.id)
    ).all()


def run_mrp_calculation(
    db: Session,
    tenant_id: int,
    run: MrpRun,
    order_ids: list[int] | None = None,
) -> list[MrpDemand]:
    """核心 MRP 计算：遍历已确认订单 -> BOM -> 需求量 -> 扣库存 -> 扣在途采购 -> 得缺口"""
    stmt = select(Order).where(
        Order.tenant_id == tenant_id,
        Order.status.in_(["confirmed", "producing"]),
    )
    if order_ids:
        stmt = stmt.where(Order.id.in_(order_ids))
    orders = db.scalars(
        stmt.options(selectinload(Order.items)).order_by(Order.id)
    ).all()

    # 汇总每个 SKU 的总需求
    sku_demand: dict[int, int] = {}
    for o in orders:
        for item in o.items:
            sku_demand[item.sku_id] = sku_demand.get(item.sku_id, 0) + item.qty

    if not sku_demand:
        return []

    sku_ids = list(sku_demand.keys())

    # 通过 BOM 展开为物料需求
    bom_by_sku = get_effective_bom_map_by_sku_ids(db, tenant_id=tenant_id, sku_ids=sku_ids)

    # 物料 -> 总需求
    material_demand: dict[int, int] = {}
    material_sku_map: dict[int, int] = {}  # material_id -> sku_id
    for sku_id, qty in sku_demand.items():
        bom = bom_by_sku.get(sku_id)
        if not bom:
            continue
        for bi in bom.items:
            m = bi.material
            if not m or not m.is_active:
                continue
            material_demand[m.id] = material_demand.get(m.id, 0) + bi.qty_per * qty
            material_sku_map[m.id] = m.sku_id

    if not material_demand:
        return []

    # 当前库存
    stock_map = sum_stock_qty_by_sku_ids(
        db,
        tenant_id=tenant_id,
        sku_ids=list(material_sku_map.values()),
    )

    # 在途采购（已确认但未入库）
    from app.models.purchase import PurchaseOrderItem
    on_order: dict[int, int] = {}
    po_items = db.scalars(
        select(PurchaseOrderItem)
        .join(PurchaseOrder, PurchaseOrder.id == PurchaseOrderItem.order_id)
        .where(
            PurchaseOrder.tenant_id == tenant_id,
            PurchaseOrder.status == "confirmed",
            PurchaseOrderItem.material_id.in_(list(material_demand.keys())),
        )
    ).all()
    for pi in po_items:
        remain = pi.qty - pi.received_qty - pi.returned_qty
        if remain > 0:
            on_order[pi.material_id] = on_order.get(pi.material_id, 0) + remain

    # 生成需求明细
    demands: list[MrpDemand] = []
    for mid, demand_qty in material_demand.items():
        sku_id = material_sku_map[mid]
        stock_qty = stock_map.get(sku_id, 0)
        on_order_qty = on_order.get(mid, 0)
        shortage = max(0, demand_qty - stock_qty - on_order_qty)
        suggestion = "purchase" if shortage > 0 else "none"
        d = MrpDemand(
            tenant_id=tenant_id,
            run_id=run.id,
            sku_id=sku_id,
            required_qty=demand_qty,
            in_stock_qty=stock_qty,
            on_order_qty=on_order_qty,
            shortage_qty=shortage,
            suggestion=suggestion,
        )
        demands.append(d)

    db.add_all(demands)
    db.flush()
    return demands
