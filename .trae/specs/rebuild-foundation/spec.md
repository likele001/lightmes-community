# LightMes 从零重建与环境初始化 Spec

## Why
当前仓库已清空业务代码，需要在新装 Debian 服务器上重新初始化工程结构与运行环境，确保后续按“业务闭环”顺序持续开发且不再混乱。

## What Changes
- 新建后端与前端工程骨架：FastAPI 后端、Vue3 admin-pro 后台、Vue3+Vant H5
- 统一工程结构与分层规范：Router/Service/Model/Schema，域模块化（system/master/sales/production/report/payroll/trace/finance）
- 统一接口返回格式与异常处理：`{code,msg,data}`（status_code=200）
- 建立环境检查与安装流程（Debian）：Python/Node/MySQL/Redis 等必需组件（禁止 Docker）
- 建立一键启动脚本：`start.sh` 与 `run.bat`
- 建立数据库迁移体系（Alembic）与 MySQL 5.7+ 兼容约束
- 建立文件上传与存储适配层：默认本地存储，预留阿里云/腾讯云/七牛切换点

## Impact
- Affected specs: 认证与权限、多租户、主数据、订单-生产-报工-审核-工资-溯源-对账、上传与审计、前端路由与权限
- Affected code: 全量新增（当前仅保留文档与规则文件）

## ADDED Requirements

### Requirement: 环境可用性
系统 SHALL 提供一套可在 Debian 上执行的环境检查与安装步骤，确保满足：
- Python 3.10+ 可用
- Node.js + pnpm/npm 可用（用于前端构建）
- MySQL 可连接（兼容 MySQL 5.7+）
- Redis 可用（用于后续 Celery/缓存；阶段 A 可先安装但不强依赖业务）
- 不使用 Docker/容器

#### Scenario: 环境检查成功
- **WHEN** 执行环境检查脚本/命令清单
- **THEN** 能得到清晰的版本输出与缺失项列表
- **AND** 缺失项有对应的安装命令与验证命令

### Requirement: 统一项目结构
系统 SHALL 使用固定的目录结构与分层规范，禁止在 Router 写跨表复杂业务，跨域调用必须走 Service。

#### Scenario: 新增业务模块不混乱
- **WHEN** 新增一个业务域（例如 production）
- **THEN** 必须同时具备 models/schemas/services/routers 的入口与最小示例

### Requirement: 统一 API 返回与异常
系统 SHALL 对所有 API 统一返回 `{code,msg,data}`，并对常见错误（参数错误/未登录/无权限/未找到/服务器错误）进行一致封装。

#### Scenario: 参数校验失败
- **WHEN** 请求参数不合法
- **THEN** 返回 `code=400` 且 `data.errors` 包含校验错误信息

### Requirement: 多租户与权限隔离（底座阶段必须完成）
系统 SHALL 支持租户注册/初始化，并实现功能权限（permission_key）与数据范围（本人/部门/全厂）两层隔离。

#### Scenario: 员工数据隔离
- **WHEN** 员工访问“我的任务/我的报工/我的工资”
- **THEN** 仅返回本人数据（以 ctx.user.id 强制过滤）

### Requirement: 数据库迁移与 MySQL 5.7 兼容
系统 SHALL 使用 Alembic 管理迁移，迁移脚本禁止使用 MySQL 8.0 专属语法。

#### Scenario: 新表上线
- **WHEN** 新增表/字段
- **THEN** 必须提供可回滚的迁移脚本

### Requirement: 文件上传与存储切换
系统 SHALL 提供上传与下载接口，默认本地存储，并预留阿里云/腾讯云/七牛切换点（配置驱动，不改业务代码）。

#### Scenario: 上传报工证据
- **WHEN** 上传图片/视频
- **THEN** 返回 attachment_id 与可访问 url

## MODIFIED Requirements

### Requirement: 项目结构规范（来自 CLAUDE.md）
原“你来设计”的项目结构 SHALL 以本 spec 中“域模块化 + 分层”方案落地，并作为后续所有开发的唯一标准。

## REMOVED Requirements

### Requirement: 直接在现有旧代码上修补
**Reason**: 仓库已清空业务代码，且用户明确要求重新初始化。
**Migration**: 不迁移旧实现，仅迁移业务约束与数据模型设计原则；如需参考历史实现，另行放入 archive（可选）。

