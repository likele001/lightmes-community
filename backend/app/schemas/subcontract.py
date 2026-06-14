from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class SubcontractItemIn(BaseModel):
    sku_id: int = Field(ge=1)
    process_id: int | None = Field(default=None, ge=1)
    qty: int = Field(ge=1)
    unit_price: Decimal | None = None
    remark: str | None = None


class SubcontractCreateIn(BaseModel):
    supplier_id: int = Field(ge=1)
    remark: str | None = None


class SubcontractItemOut(BaseModel):
    id: int
    sku_id: int
    sku_code: str | None = None
    sku_name: str | None = None
    process_id: int | None = None
    process_name: str | None = None
    qty: int
    unit_price: Decimal | None = None
    sent_qty: int
    received_qty: int
    remark: str | None = None


class SubcontractOut(BaseModel):
    id: int
    tenant_id: int
    supplier_id: int
    supplier_name: str | None = None
    code: str
    status: str
    remark: str | None = None
    created_by: int | None = None
    created_at: datetime
    updated_at: datetime
    items: list[SubcontractItemOut] = []


class SubcontractSendIn(BaseModel):
    """发料请求：批量发料"""
    sends: list[dict] = Field(description="[{item_id, qty}, ...]")


class SubcontractSendLogOut(BaseModel):
    id: int
    item_id: int
    qty: int
    remark: str | None = None
    sent_by: int | None = None
    sent_at: datetime


class SubcontractReceiveIn(BaseModel):
    """收货请求"""
    item_id: int = Field(ge=1)
    qty: int = Field(ge=1)
    remark: str | None = None


class SubcontractReceiveLogOut(BaseModel):
    id: int
    item_id: int
    qty: int
    remark: str | None = None
    received_by: int | None = None
    received_at: datetime
