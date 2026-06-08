# LightMes 全闭环一期（多租户 + 三端）实施计划

## 1. 目标与验收标准

### 1.1 目标
- 从零搭建可运行的 LightMes（后端 + 管理端 + 员工/客户 H5），实现制造业务闭环：客户下单 → 订单 → 生产计划 → 派工（二维码）→ 扫码报工（含图片/视频）→ 审核 → 计件工资 → 溯源 → 对账/发货/售后基础。
- 默认支持多租户（tenant），同时可以发布“单工厂独立版”（仅一个默认租户运行）。
- 严格遵守项目约束：Python3.10+ FastAPI + SQLAlchemy + MySQL5.7+；禁止 Docker/容器；统一接口返回 `{code:200,msg:"",data:{}}`；角色与数据权限严格隔离；工价=产品型号+工序，工资=审核通过报工×工价；报工支持扫码与图片/视频证据；提供 `run.bat/start.sh` 一键启动。

### 1.2 验收标准（可操作）
- **可启动**：在 Linux/Windows 环境执行 `start.sh`/`run.bat` 后，后端服务启动成功，前端可访问并完成登录。
- **三端可用**：
  - 客户端（H5）：可选租户（tenant_code）登录/注册（或由管理员开通），可浏览产品/型号、下单、查看订单进度、下载/查看对账单。
  - 员工端（H5）：扫码进入派工任务、提交报工（计件/计时）、上传图片/视频、查看报工记录与工资明细。
  - 管理端（响应式）：可完成主数据维护、订单/计划/派工、报工审核、工价维护、工资统计、溯源查询、库存/采购/发货/对账基础。
- **管理端基础能力齐全**（必须具备）：
  - 管理员管理：创建/禁用账号、重置密码、分配角色；
  - 角色与权限：按“模块/接口权限点”配置（哪些角色拥有哪些模块权限），并在前端菜单与后端接口双重生效；
  - 系统设置：验证码开关、缓存清理、上传设置、基础参数（如默认仓库/工价策略等）；
  - 租户工厂信息设置：工厂名称、联系人/电话、地址、Logo/章等资料维护（影响单据/对账/打印抬头）。
- **闭环链路完整**（最小闭环必须跑通）：
  1) 客户下单生成订单（含型号、数量、交期）；
  2) 管理端生成生产计划，按工艺路线拆分任务并派工生成二维码；
  3) 员工扫码报工并上传多媒体；
  4) 班组长/质检审核通过后自动：
     - 生成追溯码（单件/批次）；
     - 写入工资记录（仅审核通过生效）；
     - 成品入库（库存流水）；
  5) 管理端可按订单生成发货单并确认签收；
  6) 管理端可生成客户对账单（账期/按订单汇总），客户端可查看。
- **权限隔离正确**：
  - 员工只能看本人任务/报工/工资；
  - 班组长只能看本班组/本部门；
  - 客户只能看本租户下属于自己的订单/对账；
  - 平台超管可管理租户（多租户模式）。

## 2. 当前状态分析（基于仓库实际扫描）
- `/www/wwwroot/lightmes` 当前仅有两份文档：
  - `/www/wwwroot/lightmes/CLAUDE.md`
  - `/www/wwwroot/lightmes/.trae/rules/lightmes mes 开发规范.md`
- 未发现任何后端/前端源码、依赖清单、数据库迁移或一键启动脚本，因此一期需要从零创建完整工程结构与运行脚手架。
- 参考系统（仅用于对齐业务闭环，不直接复用代码）存在于 `/www/wwwroot/thinkmes`，其文档 [后台与MES功能及闭环说明.md](file:///www/wwwroot/thinkmes/docs/%E5%90%8E%E5%8F%B0%E4%B8%8EMES%E5%8A%9F%E8%83%BD%E5%8F%8A%E9%97%AD%E7%8E%AF%E8%AF%B4%E6%98%8E.md) 已梳理出闭环所需模块清单（MES/HR/设备/财务）。

## 3. 关键决策（已确认）
- **数据库**：MySQL `localhost:3306`，数据库名 `lightmes`，用户 `lightmes`，密码 `123456`（以环境变量为准，可覆盖）。
- **认证**：JWT Bearer。
- **多媒体存储**：一期落地本地磁盘存储，并设计可扩展的存储抽象，后续可接阿里云 OSS / 七牛 / 腾讯云 COS / 又拍云。
- **异步任务**：一期不引入 Celery + Redis（先同步闭环跑通）。
- **多租户识别**：登录时输入 `tenant_code`，token 内携带 tenant_id；后续请求不要求额外 Header；可预留“租户自带域名尾部 tenant 标识”的扩展点。
- **范围**：MES + HR + 设备 + 财务（暂不做 CRM/AI/餐饮/自媒体/租户套餐计费等）。
- **管理端**：一个响应式管理端。

## 4. 总体架构与目录规划（将创建）

### 4.1 后端（FastAPI）
计划创建目录（均在 `/www/wwwroot/lightmes` 下）：
- `backend/`
  - `app/main.py`：FastAPI 入口；挂载路由；全局异常与统一返回封装。
  - `app/core/config.py`：配置（读取环境变量/`.env`），包含 MySQL 连接、JWT 密钥、上传目录等。
  - `app/core/security.py`：密码哈希、JWT 签发与校验。
  - `app/core/rbac.py`：角色/权限与数据范围控制（本人/班组/全租户/平台）。
  - `app/db/base.py`、`app/db/session.py`：SQLAlchemy engine/session/Base。
  - `app/models/*`：ORM 模型（所有业务表带 `tenant_id`）。
  - `app/schemas/*`：Pydantic schema（请求/响应）。
  - `app/api/routers/*`：路由分模块组织（auth、tenant、mes、hr、equipment、finance、files）。
  - `app/services/*`：领域服务（下单、排产/派工、报工审核、工资计算、库存流水、追溯码生成、对账单生成）。
  - `app/storage/*`：存储抽象（LocalStorage 实现；未来 CloudStorage 适配器）。
  - `alembic/`：数据库迁移（推荐用 Alembic，兼容 MySQL5.7）。
  - `requirements.txt`：依赖清单（FastAPI、SQLAlchemy、PyMySQL、Pydantic、python-jose/pyjwt、passlib 等）。

### 4.2 前端
- `frontend-admin/`：Vue3 + TS + Pinia + Element Plus（响应式管理端）
  - 功能：租户内后台（主数据、订单/计划/派工、报工审核、工资、溯源、库存/采购/发货/对账、HR/设备/财务基础）
- `frontend-h5/`：Vue3 + Vant4（员工端 + 客户端）
  - 员工端：扫码报工、任务列表、报工记录、工资明细
  - 客户端：下单、订单进度、对账单

### 4.3 一键启动脚本
- `start.sh`：Linux 一键启动（后端 + 2 个前端 dev 或 build+serve 可选）
- `run.bat`：Windows 一键启动
- `scripts/`：初始化与运维脚本（如 init_mysql.sql、创建默认租户/账号、生成示例数据）

## 5. 数据模型（一期最小闭环表设计）

### 5.1 多租户与账号
- `tenants`：租户（tenant_code 唯一、名称、状态、域名尾部标识可选）
- `users`：用户（tenant_id、账号/手机、密码hash、用户类型 admin/employee/customer、部门/班组、状态）
- `departments`：部门/班组（tenant_id）
- `roles`：角色（tenant_id，名称，状态）
- `permissions`：权限点（全局定义：key、名称、模块、说明）
- `role_permissions`：角色-权限点关联（tenant_id、role_id、permission_key）
- `user_roles`：用户-角色关联（tenant_id、user_id、role_id）
- `tenant_settings`：租户工厂信息与参数设置（tenant_id、key、value；包含工厂资料、验证码开关、默认参数等）
- `attachments`：附件记录（tenant_id、url、type、size、hash、业务关联）
- `operation_logs`：操作日志（tenant_id、user_id、action、resource、payload 摘要、ip、ua、time）
- `captcha_sessions`：验证码会话（tenant_id 可空、scene、key、code_hash、expire_at）

### 5.2 MES 主数据
- `customers`：客户档案（tenant_id）
- `suppliers`：供应商（tenant_id）
- `products`：产品基础库（tenant_id）
- `product_models`：产品型号（tenant_id、product_id、型号编码唯一、属性、图片）
- `processes`：工序（tenant_id）
- `process_routes`：工艺路线（tenant_id、model_id、工序顺序）
- `process_prices`：工价（tenant_id、model_id、process_id、计价模式 piece/hour、单价、版本/生效日期）

### 5.3 订单与计划与派工
- `orders`：订单（tenant_id、customer_id、order_no、状态、交期）
- `order_items`：订单明细（tenant_id、order_id、model_id、qty）
- `production_plans`：生产计划（tenant_id、order_id、状态、开始/结束）
- `allocations`：任务分配/派工（tenant_id、plan_id、order_id、model_id、process_id、user_id、qty、二维码 token、状态）

### 5.4 报工、审核、工资、追溯、库存
- `reports`：报工（tenant_id、allocation_id、user_id、work_type、qty 或 hours、item_nos(可选)、状态、提交时间）
- `report_media`：报工媒体（tenant_id、report_id、type=image/video、url、meta）
- `report_audits`：审核记录（tenant_id、report_id、审核人、结果、备注、时间、质检结果）
- `wages`：工资明细（tenant_id、user_id、report_id、model_id、process_id、qty/hours、unit_price、amount、结算月份）
- `trace_codes`：追溯码（tenant_id、code、report_id、order_id、model_id、process_id、user_id、item_no/批次）
- `warehouses` / `stocks` / `stock_logs`：仓库、库存、库存流水（含完工入库、采购入库、领料出库）
- `shipments`：发货单（tenant_id、order_id、状态、物流信息、签收）
- `after_sales`：售后单（tenant_id、order_id/trace_code_id、原因、状态）
- `statements`：对账单（tenant_id、customer_id、账期、金额、明细快照/导出文件）

说明：
- 所有表必须兼容 MySQL 5.7（避免 MySQL 8 专属语法/特性）。
- 核心计算约束：**工资只来源于审核通过的报工**；工价按 **产品型号 × 工序** 获取。

## 6. API 设计（按三端拆分，统一返回）

### 6.1 统一返回与错误
- 所有 API 返回：`{ "code": 200, "msg": "", "data": {...} }`
- 认证失败/权限不足/参数错误/业务错误均保持该包裹结构，code 可约定为非 200（例如 400/401/403/500 等），但外层结构不变。

### 6.2 认证与租户
- `POST /api/auth/login`：tenant_code + username + password → token + user_info
- `POST /api/auth/logout`：可选（前端清 token 为主）
- `POST /api/tenant/register`：租户注册（平台可审核/直通，按配置）
- `GET /api/me`：获取当前用户信息与菜单权限
- `GET /api/auth/captcha?scene=login`：获取验证码（管理端登录用，可通过租户设置开关启用/关闭）

### 6.3 管理端基础能力（Admin 必备）
- 管理员与账号：
  - `GET /api/admin/users` / `POST /api/admin/users` / `PUT /api/admin/users/{id}` / `POST /api/admin/users/{id}/reset_password`
- 角色与权限（模块权限点）：
  - `GET /api/admin/permissions`：权限点列表（后端内置 + 可扩展）
  - `GET /api/admin/roles` / `POST /api/admin/roles` / `PUT /api/admin/roles/{id}`
  - `PUT /api/admin/roles/{id}/permissions`：给角色分配权限点
  - `PUT /api/admin/users/{id}/roles`：给用户分配角色
- 系统设置（租户级）：
  - `GET /api/admin/settings` / `PUT /api/admin/settings`：包含验证码开关、上传设置、默认仓库等
  - `PUT /api/admin/tenant/profile`：租户工厂信息（工厂名/联系人/电话/地址/Logo/章等）
- 缓存与运维：
  - `POST /api/admin/cache/clear`：清理服务端缓存（菜单缓存、配置缓存、验证码等）
- 附件与日志：
  - `GET /api/admin/attachments`：附件管理（用于审核查看/追溯）
  - `GET /api/admin/operation_logs`：操作日志查询/导出（一期先查询）

### 6.4 客户端（H5）
- `GET /api/h5/catalog`：产品/型号列表（按租户）
- `POST /api/h5/orders`：客户下单
- `GET /api/h5/orders`：客户订单列表（仅本人客户）
- `GET /api/h5/orders/{id}`：订单详情 + 进度
- `GET /api/h5/statements`：对账单列表
- `GET /api/h5/statements/{id}`：对账单详情/下载

### 6.5 员工端（H5）
- `GET /api/h5/tasks`：我的任务（派工）
- `GET /api/h5/tasks/scan/{token}`：扫码进入任务详情
- `POST /api/h5/reports`：提交报工（含媒体上传引用）
- `POST /api/files/upload`：上传图片/视频（返回 url）
- `GET /api/h5/reports`：我的报工
- `GET /api/h5/wages`：我的工资明细/汇总

### 6.6 管理端（Admin 业务模块）
覆盖 MES/HR/设备/财务一期必要接口，主要包括：
- 主数据：客户、供应商、产品、型号、工序、工艺路线、工价
- 订单：订单列表/详情、确认/取消、物料需求（若一期包含 BOM/物料/采购）
- 计划与派工：计划创建、按路线生成任务、派工、二维码生成/导出/打印
- 报工与审核：报工列表、审核通过/驳回、媒体查看
- 工资：工资明细/汇总、按月统计导出
- 溯源：追溯码查询、按追溯码反查报工/订单/员工
- 仓储采购：仓库、库存查询、采购入库、领料出库、完工入库
- 发货售后：发货、签收、售后单
- HR：部门/班组、员工档案、基础考勤（简化）
- 设备：设备档案、点检/维修记录（简化）
- 财务：应收/应付/对账单生成（简化）

## 7. 权限与数据隔离规则（一期实现）
- 权限由“角色 + 权限点”控制：
  - 后端每个管理端接口绑定一个或多个 permission_key（例如 `mes.order.read`、`mes.order.write`、`sys.role.manage` 等）
  - 前端菜单根据 permission_key 渲染；后端接口根据 permission_key 严格鉴权（菜单与接口一致）
- 默认角色（一期内置并可在租户内调整）：
  - 平台超管（platform_admin）：可管理租户、查看所有租户数据（仅平台接口启用）
  - 租户管理员（tenant_admin）：本租户全数据 + 系统设置/权限分配
  - 班组长（leader）：本租户内按 `department_id` 过滤可见范围（计划/派工/报工/工资/库存等）
  - 员工（employee）：仅本人相关（tasks/reports/wages）
  - 客户（customer）：仅本人客户账号关联的订单/对账

## 8. 分步实施顺序（一步一步交付，确保每步可运行）

### Step A：工程骨架 + 基础设施（可启动）
- 创建后端工程结构、配置系统、统一返回、日志、JWT 登录、租户识别（tenant_code）。
- 建立 Alembic 迁移与基础表（tenants/users/departments/roles/permissions/role_permissions/user_roles/tenant_settings）。
- 管理端基础能力：
  - 验证码：提供获取验证码接口；支持租户级开关；
  - 缓存：提供清理缓存接口（一期实现进程内缓存清理）；
  - 租户工厂信息：租户资料设置接口与管理端页面；
  - 管理员管理、角色管理、权限点分配（模块权限）全链路可用。
- 创建默认平台超管 + 默认租户 + 租户管理员 + 默认权限点与默认角色映射（种子数据脚本）。

### Step B：MES 主数据
- 产品/型号（独立模块）、工序、工艺路线、工价（型号×工序）全套 CRUD。
- 前端管理端完成相应页面；H5 客户端提供浏览接口。

### Step C：订单 → 计划 → 派工二维码
- 客户端下单、管理端订单确认。
- 生产计划创建；按工艺路线拆分 allocations；派工到员工；生成二维码 token（可打印/下载）。
- 员工端扫码进入任务详情。

### Step D：报工（含图片/视频）→ 审核 → 工资/追溯/入库
- 员工端提交报工：计件（item_nos 或 qty）/计时（hours），上传多媒体。
- 管理端审核（班组长初审 + 质检终审按一期简化为两级或单级可配置）。
- 审核通过后同步执行：
  - 写 `wages`（依据 process_prices）；
  - 生成 `trace_codes`；
  - 写入 `stock_logs` 完工入库并更新库存。

### Step E：对账/发货/售后 + HR/设备/财务基础
- 发货：按订单发货、确认签收；客户端可见进度。
- 对账：生成账期对账单（按客户汇总订单金额/数量/加工费等），客户端查看/下载。
- HR：员工档案/班组维护（用于派工与权限）。
- 设备：设备档案、点检/维修（先可记录，后续与工序/工单联动）。
- 财务：应收应付/对账（先以对账单为主，逐步细化）。

## 9. 一键启动与本地运行约定
- `backend/.env.example`：包含 DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME/JWT_SECRET/UPLOAD_DIR 等默认配置（允许覆盖）。
- `start.sh/run.bat` 行为：
  - 检查 Python 版本/venv；
  - 安装依赖；
  - 执行数据库迁移；
  - 启动后端；
  - 启动前端（dev 模式，默认端口：admin=5173，h5=5174）。
- 生产模式（可选，另提供脚本，不影响一键启动要求）：
  - `scripts/build_frontends.sh`/`scripts/build_frontends.bat`：打包两套前端到 `backend/static/admin` 与 `backend/static/h5`；
  - 后端用 StaticFiles 托管静态资源（生产部署时只启动后端即可）。

## 10. 验证步骤（实现后逐项验证）
- 后端：
  - 运行迁移成功，能创建表并写入种子数据；
  - 登录拿到 token；
  - 各角色访问同一资源时权限过滤正确；
  - 关键链路接口（下单→派工→扫码报工→审核→工资/追溯/库存）可通过接口测试脚本跑通。
- 前端：
  - 管理端在手机/PC 尺寸下可用；
  - H5 端扫码入口、上传媒体、列表/详情/工资展示正常。
- 数据一致性：
  - 审核未通过不生成工资/追溯/入库；
  - 工价变更按生效规则影响新报工（一期先按“取当前有效价”实现，并记录 price_snapshot）。

## 11. 假设与边界（一期）
- 一期优先保证“订单→派工→报工→审核→工资/追溯/入库→发货→对账”闭环顺畅；BOM/MRP/采购/领料/盘点等可按你确认后在 Step E 扩展深度。
- 租户套餐计费、CRM、AI、自媒体、工作流引擎等不在一期范围（后续可按模块逐步加）。
