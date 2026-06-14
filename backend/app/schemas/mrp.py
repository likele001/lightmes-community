from datetime import datetime

from pydantic import BaseModel, Field


class MrpRunIn(BaseModel):
    scope: str = Field(default="all", max_length=255, description="运算范围：all 或逗号分隔的订单ID")
    order_ids: str | None = Field(default=None, description="逗号分隔的订单ID列表")


class MrpConvertIn(BaseModel):
    supplier_id: int = Field(ge=1)


class MrpDemandOut(BaseModel):
    id: int
    run_id: int
    sku_id: int
    sku_code: str | None = None
    sku_name: str | None = None
    required_qty: int
    in_stock_qty: int
    on_order_qty: int
    shortage_qty: int
    suggestion: str | None = None
    remark: str | None = None


class MrpRunOut(BaseModel):
    id: int
    code: str
    status: str
    scope: str
    run_at: datetime
    result_summary: str | None = None
    error_message: str | None = None
    created_by: int | None = None
    created_at: datetime


class MrpRunDetailOut(BaseModel):
    run: MrpRunOut
    demands: list[MrpDemandOut]
