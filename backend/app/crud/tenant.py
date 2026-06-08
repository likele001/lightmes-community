from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.tenant import Tenant


def get_tenant_by_id(db: Session, tenant_id: int) -> Tenant | None:
    return db.get(Tenant, tenant_id)


def get_tenant_by_code(db: Session, code: str) -> Tenant | None:
    return db.scalar(select(Tenant).where(Tenant.code == code))


def list_tenants(db: Session, keyword: str | None = None, offset: int = 0, limit: int = 50) -> list[Tenant]:
    stmt = select(Tenant).order_by(Tenant.id.desc())
    if keyword:
        kw = f"%{keyword}%"
        stmt = stmt.where((Tenant.code.like(kw)) | (Tenant.name.like(kw)))
    return list(db.scalars(stmt.offset(offset).limit(limit)).all())


def create_tenant(
    db: Session,
    code: str,
    name: str,
    status: str = "active",
    subscription_expires_at: datetime | None = None,
    current_package_id: int | None = None,
) -> Tenant:
    tenant = Tenant(
        code=code,
        name=name,
        status=status,
        subscription_expires_at=subscription_expires_at,
        current_package_id=current_package_id,
    )
    db.add(tenant)
    db.flush()
    return tenant


def update_tenant(
    db: Session,
    tenant: Tenant,
    name: str | None = None,
    status: str | None = None,
    subscription_expires_at: datetime | None = None,
    current_package_id: int | None = None,
    logo_url: str | None = None,
) -> Tenant:
    if name is not None:
        tenant.name = name
    if status is not None:
        tenant.status = status
    if subscription_expires_at is not None:
        tenant.subscription_expires_at = subscription_expires_at
    if current_package_id is not None:
        tenant.current_package_id = current_package_id
    if logo_url is not None:
        tenant.logo_url = logo_url
    db.flush()
    return tenant


def grant_tenant_trial(db: Session, tenant: Tenant, trial_days: int) -> None:
    tenant.status = "trial"
    tenant.subscription_expires_at = datetime.now() + timedelta(days=trial_days)
    db.flush()


def is_tenant_operational(tenant: Tenant) -> bool:
    if tenant.status in ("suspended", "expired"):
        return False
    if tenant.subscription_expires_at and tenant.subscription_expires_at < datetime.now():
        return False
    return True

