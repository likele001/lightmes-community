# LightMes 全量开发方案（从零重建，按业务闭环依次落地）

## 0. 目标与边界

### 0.1 项目目标
- 面向中小加工厂的轻量 MES：客户下单 → 订单 → 生产计划/派工 → 扫码报工（含图片/视频证据）→ 审核 → 计件工资 → 溯源 → 对账。
- 交付要求：Windows/Linux 通用、一键启动脚本（run.bat/start.sh），不依赖 Docker/容器。

### 0.2 技术约束（必须遵守）
- 后端：Python 3.10+，FastAPI + SQLAlchemy(2.x) + Pydantic(2.x)
- DB：MySQL 5.7+（禁止 MySQL 8.0 专属语法）
- 前端 PC：Vue 3 + TypeScript + Pinia + Element Plus（以 admin-pro 作为主后台）
- 移动端/H5：Vue 3 + Vant 4
- 异步任务：Celery + Redis（用于算薪/导出/定时；可在后期接入，但结构要预留）
- 接口规范：统一 `{code:200, msg:"", data:{}}`，即使异常也返回 status_code=200（沿用你现有规则）
- 权限隔离：角色权限 + 数据范围（员工只能看本人，客户只能看自有订单）
- 报工必须支持：扫码 + 图片/视频证据上传
- 工价=产品型号+工序；工资=审核通过报工×工价

## 1. 推荐交付形态（你让我来建议）

采用 **分模块单体**（推荐）：
- 仍然是“一个后端 API 服务 + 一个 admin-pro + 一个 H5”，部署最简单；
- 但后端内部严格按业务域拆模块（system/master/production/report/payroll/trace/finance），每个域都有：models/schemas/services/routers；
- 可在不改业务代码的情况下，后续平滑加 Celery worker（同一套代码，多一个进程）。

## 2. 从零重建策略（避免再次“乱”）

你希望“全部删除重来”，我建议用更稳妥的 **两步法**（最终仍能达到“彻底重来”）：

1) **先归档旧代码**：把当前 backend/frontend-* 先移动到 `archive/`（只做保留，不参与运行），避免你以后要找历史实现时完全丢失。
2) **新结构从零搭建**：在根目录重新创建标准结构与最小可运行骨架（先跑起来，再逐域实现）。

等新版本完整跑通闭环后，再执行第 3 步：
3) **删除 archive**：确认不再需要旧代码，再彻底删除。

## 3. 统一项目结构规范（强约束）

### 3.1 仓库结构（建议）
- `backend/`
  - `app/`
    - `core/`：配置、响应封装、异常、日志、时间、工具、存储适配、审计
    - `db/`：engine/session/base、alembic 集成
    - `modules/`
      - `system/`：租户、用户、角色、权限、部门、数据范围、登录
      - `master/`：产品、型号(SKU)、工序、工艺路线、工价
      - `sales/`：客户、订单（客户下单、订单状态机）
      - `production/`：工单、任务、派工、生产进度
      - `report/`：报工、审核、异常原因、多媒体证据绑定
      - `payroll/`：计件工资、补贴扣款、工资条/签名
      - `trace/`：一物一码、批次、工序履历、质检记录
      - `finance/`：对账、收支流水（按你需求逐步落地）
    - `api/`
      - `routers/`：仅负责路由层聚合（每个域一个 router 文件），不写复杂业务
    - `main.py`：装配路由 + 中间件 + 异常处理
  - `alembic/`
- `frontend-admin-pro/`：唯一后台前端（对外项目 UI 统一）
- `frontend-h5/`：员工/客户 H5（后期如需可拆两套路由）
- `scripts/`
  - `start.sh` / `run.bat`：一键启动（API + 前端 dev/或静态）
- `docs/`：PRD、数据库设计、接口文档、部署说明、演示数据说明

### 3.2 后端分层（强约束）
- Router：参数接收/鉴权/返回封装
- Service：业务编排、状态机、事务、权限与数据范围
- Model：ORM 映射
- Schema：Pydantic DTO（请求/响应）

禁止：在 Router 里写跨表复杂业务；跨域调用必须走 Service。

## 4. 核心业务域设计（闭环顺序）

你不想“分期”，但要“分阶段、按闭环依次建立”。建议阶段顺序如下，每一阶段都要求“可运行、可演示、可回归测试”。

### 阶段 A：基础底座（System Core）
目标：把“多租户 + 登录 + 权限 + 数据范围 + 操作审计 + 附件上传”一次性定型，后续所有模块沿用。

必做清单：
- 统一响应 `{code,msg,data}` + 全局异常处理
- 配置管理：.env + Settings（MySQL、JWT、CORS、文件存储、云存储占位配置）
- DB：SQLAlchemy session、Alembic、迁移规范（每个版本必须可回滚）
- 租户：tenant 表与租户注册/初始化（创建默认角色/管理员/字典项）
- 账号体系：用户、部门、角色、权限点、用户-角色、角色-权限
- 数据范围：最少支持
  - 本人（user_id=ctx.user.id）
  - 本部门（department_id）
  - 本租户全厂（tenant_id）
- 文件上传：图片/视频
  - 存储适配层：local 默认 + 预留 aliyun/tencent/qiniu 切换点
  - 附件表记录：url、storage_key、sha256、size、mime、biz_type/biz_id
- 操作日志：重要动作写审计（创建订单、派工、审核、作废等）

验收：新租户注册→登录→创建角色/授权→上传文件→下载预览→审计日志可查。

### 阶段 B：主数据（Master Data）
目标：支撑后续生产闭环的所有基础数据。

必做清单：
- 产品（基础库）：code/name/category/unit/默认主图/状态
- 型号（SKU，独立）：model_code/name/color/material/spec/images/status，关联产品
- 工序：code/name/workshop/std_minutes/status
- 工艺路线：按型号配置工序顺序（seq）
- 工价：型号×工序×price_type（piece）单价，支持生效/停用与变更记录
- 字典：单位、颜色、工序分类等（可放在 system 或 master）

验收：后台能完整维护主数据；工艺路线能生成有序工序列表；工价能查到唯一生效记录。

### 阶段 C：订单→工单→任务→派工（Production Backbone）
目标：把“生产任务”的承载实体一次性定型，为报工/审核/工资/溯源打基础。

建议状态机（可简化但要可扩展）：
- 订单：draft → confirmed → producing → done → shipped/canceled
- 工单：pending → working → done/canceled
- 任务：pending → assigned → working → done

必做清单：
- 客户（最小版）：客户档案（后续 CRM 扩展）
- 订单：客户下单（后续）+ 管理端建单（先实现）
- 订单确认：自动分解工单（按订单行 / 按 SKU）
- 任务生成：按型号工艺路线生成任务（task_code 用于二维码）
- 派工：任务分配到员工（assigned_user_id），记录派工人/时间
- 进度看板：订单/工单/任务进度汇总（至少数量完成度）

验收：建订单→确认→生成工单与任务→派工→员工 H5 能看到“我的任务”。

### 阶段 D：扫码报工 + 多媒体证据 + 审核（Report & Audit）
目标：把最高频流程跑通，并且数据结构可追溯、可审计、可复核。

必做清单：
- H5 扫码报工：
  - 扫码 task_code → 拉取任务信息 → 输入合格/不良 → 上传图片/视频 → 提交
  - 提交后返回“预估工资”（用当前工价估算）
- 报工记录：submitted → leader_approved → qc_approved / rejected
- 审核：班组长初审、质检终审；驳回必须填写原因
- 多媒体：报工绑定附件（attachment_ids），审核端可预览

验收：员工扫码报工→后台可见→班组长初审→质检终审→状态正确且有审核流水。

### 阶段 E：计件工资（Payroll）
目标：工资必须基于“审核通过报工”，并且可重算、可追溯。

必做清单：
- 工资明细：以报工为粒度落表（report_id 唯一），避免重复结算
- 月汇总：按员工/月份汇总
- 补贴扣款：全勤、岗位、迟到等（先做数据结构与手工录入）
- 工资条：员工查看明细；电子签名确认（后期可接微信能力）
- 导出：Excel（后期可接异步任务）

验收：终审通过报工→自动生成工资明细→员工查询→后台月汇总/导出。

### 阶段 F：溯源 + 对账（Trace & Finance）
目标：形成真正“闭环”。

必做清单（按最小闭环落地）：
- 一物一码：成品码/箱码/批次码
- 工序履历：从码反查每道工序报工、员工、时间、质检结论、证据附件
- 对账：客户对账单（订单维度、交付与结算）

验收：扫码成品码→能反查订单/工单/任务/报工/审核/工资关联链条；客户可下载对账单。

### 阶段 G：排产/报表/异步任务（Advanced）
目标：提升管理效率与交付深度。

可选清单：
- 排产：甘特图、负荷、齐套检查
- 报表：产量、良率、工时、经营报表、自定义报表
- Celery + Redis：自动算薪、导出任务、定时结算、消息通知

## 5. 权限与数据范围（必须先设计清楚）

### 5.1 角色建议
- 平台管理员（platform_admin）
- 租户管理员（admin）
- 厂长/老板（owner）
- 班组长（leader）
- 质检（qc）
- 员工（worker）
- 客户（customer）
- 财务（finance）

### 5.2 两层权限模型（强约束）
1) **功能权限**：permission_key（按钮/菜单/API）
2) **数据范围**：数据归属字段（tenant_id + created_by/assigned_user_id/customer_id 等）+ scope 规则

所有查询接口都必须带 tenant_id 过滤；员工/客户接口必须强制按 user_id/customer_id 过滤。

## 6. 上传与云存储切换（强约束）

### 6.1 存储适配层
- 接口统一：save/open/delete
- 驱动：
  - local（默认，保证一键启动可用）
  - aliyun/tencent/qiniu（预留配置与实现入口；后续补 SDK）

### 6.2 安全与合规
- 严禁日志输出任何 access_key/secret
- 限制文件大小、mime 白名单（image/*、video/*）
- 文件路径必须做安全处理（禁止目录穿越）

## 7. 前端总体方案（对外项目，UI 统一）

### 7.1 后台（frontend-admin-pro）
- 菜单按域：系统/主数据/订单/生产/报工审核/工资/溯源/对账/报表
- 每个域配套：
  - 列表页（筛选、分页、导出）
  - 详情页（只读与变更记录）
  - 新增/编辑弹窗（统一表单校验）
- 权限：
  - 路由级（无权限跳 403）
  - 按钮级（指令/组件封装）

### 7.2 H5（frontend-h5）
- 员工端：我的任务、扫码报工、我的报工、我的工资
- 客户端：产品目录、下单、订单进度、对账下载（后期加入）

## 8. 数据库设计规范（MySQL 5.7）
- 全表必须：id（BigInt/Int）、tenant_id、created_at（CURRENT_TIMESTAMP）
- 关键业务表必须有：status（字符串状态机）、唯一约束（tenant_id + 业务编号）
- JSON 字段：MySQL 5.7 可用 JSON 类型但兼容性与索引受限；建议一期用 Text 存 JSON 字符串（你现有代码也是这个风格）
- 索引：tenant_id + 常用筛选字段（order_id、model_id、assigned_user_id、month）

## 9. 接口规范（统一可维护）

### 9.1 通用约定
- 统一返回：`{code,msg,data}`
- 分页：`{list, total}`（建议标准化）
- 错误码建议：
  - 200 成功
  - 400 参数/业务错误
  - 401 未登录
  - 403 无权限
  - 404 不存在
  - 500 服务器错误

### 9.2 路由分组建议
- `/api/auth/*`：登录、验证码、当前用户
- `/api/tenant/*`：租户注册与初始化
- `/api/admin/system/*`：用户/角色/权限/设置/字典/日志
- `/api/admin/mes/master/*`：产品/型号/工序/路线/工价
- `/api/admin/mes/production/*`：订单/工单/任务/派工/看板
- `/api/admin/mes/report/*`：报工审核
- `/api/admin/mes/payroll/*`：工资
- `/api/admin/mes/trace/*`：溯源
- `/api/h5/*`：员工/客户 H5
- `/api/files/*`：上传/下载

## 10. 从零开始的“第 1 次落地”执行清单（你照着做不会乱）

你说“我都整不懂了”，所以这里给一套非常具体、按顺序执行的落地清单：

1) 固定结构：先把目录结构按第 3 章建立好（只放空壳也可以）
2) 写最小可运行后端：
   - settings、db session、response、error、main.py、health check
3) 接 Alembic：
   - init、生成 0001_core 迁移、跑起来
4) 做 System Core：
   - tenant/user/role/permission + 登录 + 数据范围依赖
5) 做 Upload Core：
   - storage 适配层（local）+ attachments 表 + 上传/下载接口
6) 做 Master Data：
   - 产品/型号/工序/路线/工价（并把“工价=型号+工序”写成强约束）
7) 做 Production Backbone：
   - 订单→工单→任务→派工→我的任务
8) 做 Report & Audit：
   - 扫码报工（含证据）→ 双级审核 → 审核流水
9) 做 Payroll：
   - 审核通过触发工资明细 → 月汇总 → 工资条
10) 做 Trace & Finance：
   - 一物一码溯源 → 对账单

## 11. 下一步我需要你确认的“删除重建动作”

当你确认要执行“从零重建”后，我会按你选的策略进行：
- 先创建 `archive/` 并移动旧目录（或你坚持直接删除也可以，但不推荐）
- 新建新的 backend/frontend 结构与最小可运行骨架
- 按第 4 章阶段顺序逐步开发（每个阶段都能演示闭环）

