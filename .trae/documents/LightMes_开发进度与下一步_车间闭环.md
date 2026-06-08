# LightMes 开发进度与下一步计划（车间闭环优先）

## 1. 摘要

当前工程已完成「系统底座 + MES 主数据」：多租户、登录鉴权、权限点、系统管理（用户/角色/权限/设置/日志/附件列表）、以及 MES 主数据（产品、产品型号、工序、工艺路线、工序工价）。下一阶段按你的选择，优先把 **车间闭环** 跑通，并以 **frontend-admin-pro** 作为主要后台前端，同时实现“本地存储 + 可切换阿里云/腾讯云/七牛云”的上传架构。

车间闭环一期目标（不含客户自助下单）：
管理员建订单 → 生成工单/任务 → 派工（生成任务码）→ 员工 H5 扫码报工（含图片/视频证据）→ 班组长/质检审核 → 按「审核通过报工 × 工价」生成计件工资 → 员工查询工资明细。

## 2. 当前状态盘点（基于仓库现状）

### 2.1 已完成（可运行）

**后端（FastAPI + SQLAlchemy + MySQL5.7 兼容）**
- 统一返回格式与全局异常封装：返回 `{code,msg,data}`。
  - [main.py](file:///www/wwwroot/lightmes/backend/app/main.py)
  - [response.py](file:///www/wwwroot/lightmes/backend/app/core/response.py)
- 多租户：租户注册、租户设置、租户隔离字段 tenant_id。
  - [tenant.py](file:///www/wwwroot/lightmes/backend/app/api/routers/tenant.py)
  - [models/core.py](file:///www/wwwroot/lightmes/backend/app/models/core.py)
- 认证：验证码、登录、JWT、当前用户。
  - [auth.py](file:///www/wwwroot/lightmes/backend/app/api/routers/auth.py)
- 权限体系：权限点、角色、用户、角色权限、用户角色（接口已具备）。
  - [admin.py](file:///www/wwwroot/lightmes/backend/app/api/routers/admin.py)
  - [deps.py](file:///www/wwwroot/lightmes/backend/app/deps.py)
- MES 主数据（已闭环）：产品、型号、工序、工艺路线、工价（型号×工序）。
  - [mes_master_admin.py](file:///www/wwwroot/lightmes/backend/app/api/routers/mes_master_admin.py)
  - [mes_master.py](file:///www/wwwroot/lightmes/backend/app/models/mes_master.py)
- Alembic 迁移（核心表 + 主数据表）。
  - [alembic/versions](file:///www/wwwroot/lightmes/backend/alembic/versions)

**前端**
- `frontend-admin-pro` 已有登录/权限/菜单体系，已挂载 MES 菜单页面骨架（Products/Models/Processes/Routes/Prices）。
  - [router/index.ts](file:///www/wwwroot/lightmes/frontend-admin-pro/src/router/index.ts)
- `frontend-admin`（简版）已能联通 MES 主数据接口（但后续你选择以 Pro 为主）。

**启动脚本**
- [start.sh](file:///www/wwwroot/lightmes/start.sh)
- [run.bat](file:///www/wwwroot/lightmes/run.bat)

### 2.2 未完成（关键缺口）

对照你的业务闭环要求，以下缺口会阻断核心价值交付：
- 订单/工单/任务：订单管理、订单分解工单、工艺路线驱动生成任务、进度汇总。
- 派工：任务分配到员工，生成任务码（二维码内容）。
- 报工：H5 扫码报工、合格/不良、上传图片/视频证据、报工后即时工资预估。
- 审核：至少两级（班组长初审、质检终审），支持驳回原因与重报。
- 工资：按「审核通过报工 × 工序工价」生成明细与月汇总；员工侧查询。
- 上传：目前只有附件表/列表接口，缺“上传/存储/下载鉴权/与业务绑定”。
- 数据权限深化：目前更多是“权限点”层面，缺“数据范围”层面（员工仅看自己报工与工资）。

## 3. 一期闭环范围定义（本计划的 In/Out）

### 3.1 In（一期必须交付）
- 后台（admin-pro）：订单建单、订单行、生成工单/任务、派工、任务列表与进度、报工记录列表、审核处理、工资统计（按月/按人）。
- 员工 H5：登录、我的任务、扫码/输入任务码报工（含图片/视频）、查看我的报工与工资。
- 后端：订单/工单/任务/报工/审核/工资全套 API、表结构、权限点与默认角色、上传与下载接口（可切换存储架构先落地本地）。

### 3.2 Out（一期明确不做或只留接口）
- 客户自助下单、客户查进度、对账单下载、溯源“一物一码”。
- 生产计划（排产/甘特/齐套）。
- Celery/Redis 异步任务（一期可同步计算工资；后续再引入自动算薪与导出任务）。

## 4. 设计决策（已锁定）

基于你的选择与仓库现状，本期固定如下决策，执行时不再发散：
- **优先业务**：车间闭环（从管理员建单开始）。
- **后台前端**：以 `frontend-admin-pro` 为主完善 UI/组件与交互。
- **上传存储**：实现“存储适配层”，默认本地存储；云存储（阿里/腾讯/七牛）先把接口与配置位设计好，代码上提供可扩展结构与清晰切换点。
- **二维码生成策略**：后端只生成 `task_code`（或短码），前端用已有二维码组件渲染（更省依赖、更易打印）。
- **接口规范**：继续全量使用 `{code,msg,data}`，并延续现有鉴权/权限依赖写法。
- **MySQL 5.7**：迁移与 SQL 均避免 8.0 专属语法。

## 5. 拟新增核心数据模型（一期）

新增文件建议（与当前结构一致）：
- `backend/app/models/mes_production.py`
- `backend/app/schemas/mes_production.py`
- `backend/app/api/routers/mes_production_admin.py`
- `backend/app/api/routers/mes_production_h5.py`
- `backend/alembic/versions/0003_mes_production.py`

### 5.1 订单/工单/任务

建议表（最小可跑通版本）：
- `mes_orders`
  - tenant_id、order_no（租户内唯一）、customer_name（一期可文本）、due_date、status（draft/confirmed/producing/done/canceled）、created_by
- `mes_order_items`
  - order_id、product_id、model_id、qty
- `mes_work_orders`
  - tenant_id、work_no（租户内唯一）、order_id、model_id、qty、status
- `mes_work_tasks`
  - tenant_id、task_code（租户内唯一、用于扫码）、work_order_id、process_id、seq、assigned_user_id、status（pending/working/done）
  - 进度字段：reported_good_qty、reported_bad_qty（聚合，便于列表页展示）

生成逻辑：
- 订单确认后：按订单行创建工单；按型号的 `process_routes` 生成任务（seq 对齐 route.seq）。

### 5.2 报工/审核

- `mes_reports`（报工记录）
  - tenant_id、task_id、report_user_id、good_qty、bad_qty、remark、media_attachment_ids（JSON 字符串或逗号字符串，遵循当前项目不引入新依赖原则）、status（submitted/leader_approved/qc_approved/rejected）、created_at
- `mes_report_audits`（审核流水）
  - report_id、auditor_user_id、audit_level（leader/qc）、action（approve/reject）、reason、created_at

### 5.3 工资

一期按“报工记录”直接落工资明细，便于追溯与重算：
- `mes_salary_items`
  - tenant_id、report_id（唯一）、user_id、model_id、process_id、unit_price、good_qty、bad_qty、amount、month（YYYY-MM）、created_at

计算逻辑：
- 仅对 `qc_approved` 的报工生成/更新工资项
- 单价取 `process_prices`（model_id + process_id + price_type='piece'）
- amount = good_qty * unit_price（不良默认不计薪；若后续要计/罚，留扩展字段）

## 6. API 与权限点规划（一期）

### 6.1 Admin API（/api/admin/mes）

新增路由文件建议：`mes_production_admin.py`，统一挂载到 `/api/admin/mes` 下，与现有主数据风格一致。

接口清单（建议）：
- 订单
  - GET `/orders`
  - POST `/orders`
  - PUT `/orders/{id}`（编辑草稿/取消）
  - POST `/orders/{id}/confirm`（确认并生成工单/任务）
- 工单/任务
  - GET `/work_orders`
  - GET `/work_tasks`（支持按订单/工单/员工/状态筛选）
  - PUT `/work_tasks/{id}/assign`（派工：assigned_user_id）
- 报工/审核
  - GET `/reports`
  - POST `/reports/{id}/leader_approve`
  - POST `/reports/{id}/qc_approve`
  - POST `/reports/{id}/reject`
- 工资
  - GET `/salary/items`（按月/按人/按工序筛选）
  - GET `/salary/summary`（按月汇总）

权限点（seed.py 增补）：
- `mes.order.read|write`
- `mes.work.read|write`
- `mes.dispatch.write`
- `mes.report.read|audit`
- `mes.salary.read`

### 6.2 H5 API（/api/h5）

新增路由文件建议：`mes_production_h5.py`，挂载到 `/api/h5` 下。

接口清单（建议）：
- GET `/tasks`（我的任务）
- GET `/tasks/{task_code}`（扫码后查任务详情）
- POST `/reports`（提交报工：task_code + 数量 + 附件）
- GET `/reports`（我的报工）
- GET `/salary`（我的工资：按月/明细）

数据权限规则（一期必须实现）：
- H5 侧接口按 `ctx.user_id` 强制过滤，只能看自己的任务/报工/工资

## 7. 上传/存储设计（一期）

目标：实现“上传图片/视频证据”且未来可切换云存储。

### 7.1 后端结构建议
- 新增 `backend/app/core/storage/`（目录）
  - `base.py`：Storage 接口（put/get_url/delete）
  - `local.py`：本地存储实现
  - `factory.py`：按 settings 选择实现
- 新增路由：`backend/app/api/routers/files.py`
  - POST `/api/files/upload`（multipart）
  - GET `/api/files/{attachment_id}`（鉴权下载/预览）

### 7.2 Attachment 绑定策略
- 上传成功创建 `attachments` 记录（tenant_id、sha256、size、type、url）
- 业务侧（报工）仅保存 attachment_id 列表；回显时再查 Attachment.url

### 7.3 配置项（core/config.py 增补）
- `storage_driver`：local|aliyun|tencent|qiniu（一期默认 local）
- local：
  - `local_storage_dir`：如 `./data/uploads`
- 云存储（二期实现 SDK 适配）：
  - `aliyun_*` / `tencent_*` / `qiniu_*`（先把字段占位与校验策略定义好）

## 8. 前端实现计划（frontend-admin-pro）

### 8.1 API 对接与权限
- 统一将后端 `{code,msg,data}` 适配到现有 axios 封装（必要时扩展 response 拦截）
- 使用现有 permission 指令/路由 meta 控制菜单与按钮显示

### 8.2 新增页面（一期）
- 订单管理：建单、订单行维护、确认生成工单/任务
- 工单/任务：任务列表、派工弹窗（选择员工）、任务码展示（二维码）
- 报工审核：列表、详情、图片/视频预览、通过/驳回
- 工资：按月汇总、人员明细、导出（一期可先做前端导出 CSV；后续接后端导出任务）

### 8.3 H5（Vue3 + Vant）
- 任务列表 / 扫码报工 / 证据上传 / 我的工资

## 9. 实施步骤（执行阶段的具体落地顺序）

1) 后端：建 `mes_production` 模型 + Alembic 迁移 + seed 权限点
2) 后端：订单→工单→任务生成逻辑（订单确认接口）
3) 后端：派工接口与任务查询（admin + h5）
4) 后端：上传/下载接口（本地存储 + 存储适配层）
5) 后端：报工提交 + 审核流转 + 审核日志
6) 后端：工资明细生成/更新（在 qc_approve 时触发），并提供查询接口
7) 前端 admin-pro：订单/任务/审核/工资页面联调
8) H5：扫码报工（任务码输入兜底）+ 上传证据 + 我的工资

## 10. 验证与验收（一期）

后端验收（建议用 Postman/前端联调双验证）：
- 租户注册 → 登录 → 拥有一期权限的角色可看到对应菜单/接口
- 创建产品/型号/工序/路线/工价（已具备）
- 建订单 → 确认生成工单/任务 → 派工 → H5 查到“我的任务”
- H5 扫码/输入 task_code 报工（含至少1张图片或1段视频）→ 后台可看到报工记录与附件
- 班组长初审通过 → 质检终审通过 → 工资明细生成
- 员工 H5 只能看到自己任务/报工/工资；后台按权限点可查看全厂

兼容性验收：
- MySQL 5.7 下完成迁移并可写入/查询（避免 8.0 语法）
- Windows/Linux 均可通过脚本启动并跑通最小流程

