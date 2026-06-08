from pydantic import BaseModel, Field


class TenantRegisterIn(BaseModel):
    tenant_code: str = Field(min_length=1, max_length=32)
    tenant_name: str = Field(min_length=1, max_length=128)
    admin_username: str = Field(min_length=1, max_length=64)
    admin_password: str = Field(min_length=6, max_length=128)
    admin_full_name: str | None = Field(default=None, max_length=128)
    package_id: int | None = None
    contact_phone: str | None = None
    captcha_id: str | None = Field(default=None, max_length=64)
    captcha_code: str | None = Field(default=None, max_length=16)


class TenantOut(BaseModel):
    id: int
    code: str
    name: str


class TenantRegisterOut(BaseModel):
    tenant: TenantOut
    admin_username: str

