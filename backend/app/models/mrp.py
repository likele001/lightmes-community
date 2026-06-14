from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class MrpRun(Base):
    """MRP 运算记录"""
    __tablename__ = "mrp_runs"
    __table_args__ = (UniqueConstraint("tenant_id", "code", name="uq_mrp_runs_tenant_code"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tenant_id: Mapped[int] = mapped_column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)

    code: Mapped[str] = mapped_column(String(64), nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False, server_default="running")  # running / done / failed
    run_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())

    # 运算范围：all=全部已确认订单，或逗号分隔的订单ID列表
    scope: Mapped[str] = mapped_column(String(255), nullable=False, server_default="all")

    # 结果摘要 JSON：{total_shortage_items, total_shortage_qty, affected_sku_count}
    result_summary: Mapped[str | None] = mapped_column(Text, nullable=True)

    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_by: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())


class MrpDemand(Base):
    """MRP 需求明细"""
    __tablename__ = "mrp_demands"
    __table_args__ = (UniqueConstraint("tenant_id", "run_id", "sku_id", name="uq_mrp_demands_tenant_run_sku"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tenant_id: Mapped[int] = mapped_column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    run_id: Mapped[int] = mapped_column(Integer, ForeignKey("mrp_runs.id", ondelete="CASCADE"), nullable=False, index=True)

    sku_id: Mapped[int] = mapped_column(Integer, ForeignKey("skus.id", ondelete="RESTRICT"), nullable=False, index=True)
    required_qty: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    in_stock_qty: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    on_order_qty: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    shortage_qty: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")

    suggestion: Mapped[str | None] = mapped_column(String(32), nullable=True)  # purchase / transfer / none
    remark: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())

    sku = relationship("Sku")
