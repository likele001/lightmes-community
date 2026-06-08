# Tasks

- [x] Task 1: 服务器环境检查与安装（Debian）
  - [x] SubTask 1.1: 输出版本与缺失项清单（python3、pip、venv、node、npm/pnpm、mysql client、redis）
  - [x] SubTask 1.2: 安装 Python 3.10+ 与基础构建依赖（build-essential、python3-venv 等）并验证
  - [x] SubTask 1.3: 安装 Node.js LTS + pnpm（或 npm）并验证
  - [x] SubTask 1.4: 验证 MySQL 连接（用户名/库名由用户提供；密码仅放 .env，不写入仓库）
  - [x] SubTask 1.5: 安装并验证 Redis（为后续 Celery/缓存预留）

- [x] Task 2: 初始化后端工程骨架（FastAPI）
  - [x] SubTask 2.1: 创建 backend 目录结构（app/core、app/db、app/modules、app/api/routers、alembic）
  - [x] SubTask 2.2: 建立 Settings（.env）、DB session、Base、Alembic 配置与首个迁移 0001_core（tenant/user/role/permission）
  - [x] SubTask 2.3: 建立统一响应封装与全局异常处理（严格 `{code,msg,data}`）
  - [x] SubTask 2.4: 建立认证与权限底座（JWT、登录、权限点加载、数据范围依赖）
  - [x] SubTask 2.5: 建立种子数据（默认租户、默认角色与权限点、演示账号）

- [x] Task 3: 初始化文件上传与存储适配层
  - [x] SubTask 3.1: 设计并实现 Storage 接口（save/open/delete）
  - [x] SubTask 3.2: 本地存储实现（按 tenant_id 分目录，防目录穿越，限制大小与 MIME）
  - [x] SubTask 3.3: attachments 表与上传/下载 API（返回 attachment_id、url）
  - [x] SubTask 3.4: 预留阿里云/腾讯云/七牛配置项与驱动入口（不实现 SDK 也要可扩展）

- [x] Task 4: 初始化主数据模块（产品/型号/工序/路线/工价）
  - [x] SubTask 4.1: 数据模型与迁移（MySQL 5.7 兼容）
  - [x] SubTask 4.2: Admin API（CRUD + 路线/工价配置）
  - [x] SubTask 4.3: 权限点与默认授权补齐（tenant/register 与 seed）

- [x] Task 5: 初始化前端 admin-pro（唯一后台）
  - [x] SubTask 5.1: 初始化 Vue3+TS+Pinia+Element Plus 工程（或保留现成脚手架但以新 API 为准）
  - [x] SubTask 5.2: HTTP 封装适配 `{code,msg,data}`，统一错误提示与登录态
  - [x] SubTask 5.3: 系统模块页面（登录、用户/角色/权限、租户设置、附件、日志）
  - [x] SubTask 5.4: 主数据页面（产品/型号/工序/路线/工价）

- [x] Task 6: 初始化前端 H5（员工/客户）
  - [x] SubTask 6.1: 初始化 Vue3+Vant 工程与登录
  - [x] SubTask 6.2: 文件上传组件（图片/视频）与预览
  - [x] SubTask 6.3: 预留路由（我的任务/扫码报工/我的工资/客户下单）

- [x] Task 7: 一键启动脚本与开发运行说明
  - [x] SubTask 7.1: start.sh（启动后端、可选启动前端 dev 或构建静态）
  - [x] SubTask 7.2: run.bat（Windows 一键启动）
  - [x] SubTask 7.3: docs/部署与运维说明（端口、.env、数据库初始化、迁移）

- [x] Task 8: 冒烟验证（阶段 A + B 完成后）
  - [x] SubTask 8.1: 完整跑通：租户注册→登录→权限→上传→主数据 CRUD
  - [x] SubTask 8.2: 回归约束：MySQL 5.7 兼容检查、无 Docker、统一响应格式

- [x] Task 9: 采购闭环增强（齐套→采购→入库→退货→对账→统计）
  - [x] SubTask 9.1: 供应商/物料/BOM/采购单/采购对账单模型与迁移
  - [x] SubTask 9.2: 生产计划齐套检查 + 一键生成采购单
  - [x] SubTask 9.6: 生产计划齐套到采购收货闭环（计划关联采购单 + 入库进度回显）
  - [x] SubTask 9.7: 生产计划排产优化（基础）：按订单交期回推 + 甘特图负荷预警
  - [x] SubTask 9.8: 生产计划排产优化（增强）：产能配置（租户默认）+ 负荷原因定位（按天查看计划明细）
  - [x] SubTask 9.9: 生产计划排产优化（增强）：工时负荷权重（按订单数量/工期计算）+ 明细贡献值展示
  - [x] SubTask 9.10: 生产计划排产优化（增强）：按工序标准工时（std_minutes）估算分钟负荷 + 明细展示
  - [x] SubTask 9.11: 生产计划排产优化（增强）：生产日历（工作日/非工作日）+ 日产能按日期覆盖 + 自动排期按工作日计算
  - [x] SubTask 9.12: 生产计划排产优化（增强）：车间（workshop）维度负荷明细 + 车间日产能配置
  - [x] SubTask 9.13: 生产计划排产优化（增强）：人员（派工用户）维度负荷明细 + 人员日产能配置
  - [x] SubTask 9.14: 生产计划排产优化（增强）：任务绑定设备（equipment_id）+ 设备维度负荷明细 + 设备日产能配置
  - [x] SubTask 9.15: 生产计划排产优化（增强）：自动派工第一版（按人员产能均衡分配未派工任务）+ 超负荷提示
  - [x] SubTask 9.3: 采购单部分/多次入库 + 作废 + 退货冲销
  - [x] SubTask 9.4: 采购对账单（确认/已付）+ 采购统计报表
  - [x] SubTask 9.5: admin-pro 页面与权限接入

- [x] Task 10: 财务收支流水与成本毛利（延伸自对账单）
  - [x] SubTask 10.1: 收支流水 finance_ledgers（模型+迁移+CRUD）
  - [x] SubTask 10.2: 客户对账单标记已收款 + 供应商对账单标记已付款写入流水
  - [x] SubTask 10.3: 成本毛利接口（按月份汇总 revenue/cost/gross_profit）
  - [x] SubTask 10.4: admin-pro 财务页面（客户对账单/收支流水/成本毛利）

- [x] Task 11: CRM（联系人/销售机会/跟进记录/公海池/标签/统计）
  - [x] SubTask 11.1: customer_contacts/crm_opportunities/crm_opportunity_activities（模型+迁移）
  - [x] SubTask 11.2: Admin API（客户下的联系人/机会/跟进记录）
  - [x] SubTask 11.3: admin-pro 客户详情页（联系人/机会/跟进）
  - [x] SubTask 11.4: 客户标签（tags+绑定）+ 公海池 + 机会阶段统计 + 负责人下拉选择
  - [x] SubTask 11.5: 公海池回收规则（按 tenant_setting 配置 N 天无跟进自动回收）+ 仅管理员可释放 + 统计钻取（负责人/客户维度）

- [x] Task 12: Celery + Redis（异步任务与定时任务）
  - [x] SubTask 12.1: 引入 Celery + Redis 依赖与配置项（broker/backend/timezone）
  - [x] SubTask 12.2: Celery worker/beat 启动入口（celery_app）与自动发现任务
  - [x] SubTask 12.3: 定时任务：CRM 公海池自动回收（按租户读取 recycle_days 配置）
  - [x] SubTask 12.4: 一键启动脚本联动（start.sh / backend/run.bat 启动 worker + beat）
  - [x] SubTask 12.5: 工资明细 Excel 导出异步化（ExportJob + Celery 任务 + admin-pro 轮询下载）

- [x] Task 13: 工资条确认链路完善（拒签/重置/重新确认）
  - [x] SubTask 13.1: 后端扩展 salary_slips（confirm_status/reject_reason/rejected_at）与迁移
  - [x] SubTask 13.2: H5 端支持拒签（填写原因）+ 状态展示
  - [x] SubTask 13.3: admin-pro 支持拒签原因查看 + 重置确认状态（要求重新签名）

- [x] Task 14: 打印模板（模板管理 + 预览渲染）
  - [x] SubTask 14.1: print_templates（模型+迁移）与权限点 print_template.manage
  - [x] SubTask 14.2: Admin API（CRUD + render）+ 操作日志
  - [x] SubTask 14.3: admin-pro 页面（模板管理 + 示例数据渲染预览）
  - [x] SubTask 14.4: 打印场景落地：任务码标签（二维码 + 任务信息渲染打印）
  - [x] SubTask 14.5: 打印场景落地：客户对账单（明细表格渲染打印）
  - [x] SubTask 14.6: 打印场景落地：采购对账单（明细表格渲染打印）
  - [x] SubTask 14.7: 模板变量规范：内置模板（task_label/customer_statement/supplier_statement）占位符与示例数据提示
  - [x] SubTask 14.8: 导出 PDF（后端生成）：模板预览/任务标签/客户对账单/采购对账单
  - [x] SubTask 14.9: 直接打印适配（前端打印窗口统一样式/分页策略）
  - [x] SubTask 14.10: 多页明细分页页码（PDF 导出页脚页码/打印时间）
  - [x] SubTask 14.11: 批量打印任务标签（一次打印多张任务码标签）

- [x] Task 15: 消息通知（站内通知）
  - [x] SubTask 15.1: notifications（模型+迁移）与权限点 notification.view
  - [x] SubTask 15.2: 通知 API（我的消息/未读数/标记已读，admin-pro/H5）
  - [x] SubTask 15.3: 关键业务触发点（报工审核、工资条拒签/重置）写入通知
  - [x] SubTask 15.4: admin-pro 页面（消息通知列表 + 全部已读）
  - [x] SubTask 15.5: H5 消息中心 UI（通知列表 + 未读筛选 + 标记已读/全部已读）

- [x] Task 16: 考勤记录（打卡 + 管理端补录）
  - [x] SubTask 16.1: attendance_records（模型+迁移）与权限点 attendance.manage
  - [x] SubTask 16.2: H5 打卡接口（上班/下班）+ 个人考勤记录列表
  - [x] SubTask 16.3: admin-pro 考勤记录列表 + 补录/编辑
  - [x] SubTask 16.4: H5 增加“考勤打卡”页面入口

- [x] Task 17: 技能标签（员工技能矩阵）
  - [x] SubTask 17.1: skills / user_skill_links（模型+迁移）与权限点 skill.manage
  - [x] SubTask 17.2: Admin API（技能字典 CRUD + 员工技能绑定查询/保存）
  - [x] SubTask 17.3: admin-pro 页面（技能字典 + 员工技能矩阵）
  - [x] SubTask 17.4: 任务派工按技能筛选可派员工（dispatch-skills/dispatch-users + 派工弹窗技能多选）

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 2
- Task 4 depends on Task 2
- Task 5 depends on Task 2
- Task 6 depends on Task 2 and Task 3
- Task 7 depends on Task 2 and Task 5 and Task 6
- Task 8 depends on Task 2 and Task 3 and Task 4 and Task 5
- Task 9 depends on Task 4 and Task 5 and Task 8
- Task 10 depends on Task 9
- Task 11 depends on Task 8
