"""Celery 任务模块 — 按业务域拆分

子模块：
- crm             : CRM 公海回收 / 跟进提醒
- ai              : AI 告警扫描 / 日报推送 / 审核预审
- production      : 生产排程自动化
- notify          : 飞书 / 企微 / 钉钉消息推送
- salary          : 工资导出 / 计时日算 / 月结汇总
- report_exports  : 产量/良率报表 Excel 导出
- warehouse_exports: 库存明细 Excel 导出
- finance_exports : 客户对账单 Excel 导出
- mold_alerts     : 模具寿命预警扫描
- decorators      : 公共装饰器（db_task）
"""

# 确保 autodiscover_tasks 能找到所有 @shared_task
from app.tasks import ai, crm, notify, production, salary  # noqa: F401
from app.tasks import report_exports, warehouse_exports, finance_exports  # noqa: F401
from app.tasks import mold_alerts  # noqa: F401
