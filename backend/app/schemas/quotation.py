from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class QuotationItemIn(BaseModel):
    sku_id: int = Field(ge=1)
    qty: int = Field(ge=1)
    unit_price: Decimal | None = None
    amount: Decimal | None = None
    remark: str | None = None


class QuotationCreateIn(BaseModel):
    customer_id: int = Field(ge=1)
    valid_until: date | None = None
    remark: str | None = None


class QuotationUpdateIn(BaseModel):
    valid_until: date | None = None
    remark: str | None = None


class QuotationItemOut(BaseModel):
    id: int
    line_no: int
    sku_id: int
    sku_code: str | None = None
    sku_name: str | None = None
    qty: int
    unit_price: Decimal | None = None
    amount: Decimal | None = None
    remark: str | None = None


class QuotationOut(BaseModel):
    id: int
    tenant_id: int
    customer_id: int
    customer_name: str | None = None
    code: str
    status: str
    valid_until: date | None = None
    total_amount: Decimal | None = None
    remark: str | None = None
    created_by: int | None = None
    created_at: datetime
    updated_at: datetime
    items: list[QuotationItemOut] = []
