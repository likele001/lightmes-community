from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, Field

from app.schemas.order import OrderItemCreateIn


class CustomerContactCreateIn(BaseModel):
    name: str = Field(min_length=1, max_length=64)
    phone: str | None = Field(default=None, max_length=32)
    email: str | None = Field(default=None, max_length=128)
    title: str | None = Field(default=None, max_length=64)
    is_primary: bool = False
    remark: str | None = None
    is_active: bool = True


class CustomerContactUpdateIn(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=64)
    phone: str | None = Field(default=None, max_length=32)
    email: str | None = Field(default=None, max_length=128)
    title: str | None = Field(default=None, max_length=64)
    is_primary: bool | None = None
    remark: str | None = None
    is_active: bool | None = None


class CrmOpportunityCreateIn(BaseModel):
    code: str | None = Field(default=None, max_length=64)
    title: str = Field(min_length=1, max_length=128)
    stage: str = Field(default="prospecting", max_length=32)
    status: str = Field(default="open", max_length=16)
    amount: Decimal | None = None
    probability: int | None = Field(default=None, ge=0, le=100)
    expected_close_date: date | None = None
    owner_user_id: int | None = Field(default=None, ge=1)
    remark: str | None = None
    is_active: bool = True


class CrmOpportunityUpdateIn(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=128)
    stage: str | None = Field(default=None, max_length=32)
    status: str | None = Field(default=None, max_length=16)
    amount: Decimal | None = None
    probability: int | None = Field(default=None, ge=0, le=100)
    expected_close_date: date | None = None
    owner_user_id: int | None = Field(default=None, ge=1)
    remark: str | None = None
    is_active: bool | None = None


class CrmOpportunityActivityCreateIn(BaseModel):
    action_type: str = Field(default="note", max_length=16)
    content: str = Field(min_length=1)
    next_follow_up_at: datetime | None = None


class OpportunityConvertToOrderIn(BaseModel):
    due_date: date | None = None
    remark: str | None = None
    items: list[OrderItemCreateIn] = Field(min_length=1)


class CustomerContactOut(BaseModel):
    id: int
    tenant_id: int
    customer_id: int
    name: str
    phone: str | None
    email: str | None
    title: str | None
    is_primary: bool
    remark: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime


class CrmOpportunityOut(BaseModel):
    id: int
    tenant_id: int
    customer_id: int
    code: str
    title: str
    stage: str
    status: str
    amount: Decimal | None
    probability: int | None
    expected_close_date: date | None
    owner_user_id: int | None
    owner_name: str | None
    remark: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime


class CrmOpportunityActivityOut(BaseModel):
    id: int
    tenant_id: int
    opportunity_id: int
    action_type: str
    content: str
    created_by: int | None
    created_by_name: str | None
    next_follow_up_at: datetime | None = None
    created_at: datetime


class CustomerTagCreateIn(BaseModel):
    name: str = Field(min_length=1, max_length=64)
    color: str | None = Field(default=None, max_length=16)
    is_active: bool = True


class CustomerTagUpdateIn(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=64)
    color: str | None = Field(default=None, max_length=16)
    is_active: bool | None = None


class CustomerTagOut(BaseModel):
    id: int
    tenant_id: int
    name: str
    color: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime


class CustomerTagsSetIn(BaseModel):
    tag_ids: list[int] = Field(default_factory=list)
