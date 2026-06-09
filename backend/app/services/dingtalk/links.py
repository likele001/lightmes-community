"""钉钉推送链接构建"""

from __future__ import annotations

from app.core.config import settings as app_settings


def build_message_urls(cfg: dict, *, event_code: str, biz_type: str | None, biz_id: int | None) -> tuple[str | None, str | None]:
    h5_base = (cfg.get("h5_public_base_url") or app_settings.H5_PUBLIC_BASE_URL or "").strip().rstrip("/")
    admin_base = (cfg.get("admin_public_base_url") or "").strip().rstrip("/")
    h5_url = None
    admin_url = None

    if event_code == "dispatch.assigned" and h5_base:
        h5_url = f"{h5_base}/tasks"
    elif event_code.startswith("report") and biz_type in ("report", "report_unit"):
        if h5_base:
            h5_url = f"{h5_base}/report-units" if biz_type == "report_unit" else f"{h5_base}/tasks"
        if admin_base:
            admin_url = f"{admin_base}/production/report-units" if biz_type == "report_unit" else f"{admin_base}/production/reports"
        if event_code == "report.submitted" and admin_base:
            admin_url = f"{admin_base}/production/reports"
    elif event_code.startswith("salary") and h5_base:
        h5_url = f"{h5_base}/salary-slips"
    elif event_code.startswith("order") and admin_base:
        admin_url = f"{admin_base}/production/orders"
    elif event_code == "brief.daily" and admin_base:
        admin_url = f"{admin_base}/home"
    elif admin_base and biz_type:
        admin_url = admin_base

    return h5_url, admin_url
