<div align="center">

# LightMes

### 面向中小加工厂的轻量化生产管理系统（MES）

**扫码报工 · H5 派工 · 工单流转 · 即开即用**

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)](#快速开始)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688?logo=fastapi&logoColor=white)](#快速开始)
[![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vuedotjs&logoColor=white)](#快速开始)
[![Node](https://img.shields.io/badge/Node.js-18%2B-339933?logo=nodedotjs&logoColor=white)](#快速开始)
[![MySQL](https://img.shields.io/badge/MySQL-8.0%2B-4479A1?logo=mysql&logoColor=white)](#快速开始)
[![Stars](https://img.shields.io/github/stars/your-org/lightmes?style=social)](https://github.com/your-org/lightmes/stargazers)
[![Issues](https://img.shields.io/github/issues/your-org/lightmes)](https://github.com/your-org/lightmes/issues)

[在线体验](https://admin.mes.cenkor.cn/register/) · [官网](https://lightmes.user.023ent.net/site) · [购买 Pro 版](#pro-版) · [问题反馈](https://github.com/your-org/lightmes/issues)

</div>

---

## 项目简介

LightMes 是一款专为 **中小加工厂** 设计的开源 [MES系统](https://lightmes.user.023ent.net/site)（生产管理系统）。它聚焦车间现场最核心的痛点——**扫码报工**、**工序派工**、**工单流转**，以极低的部署门槛帮助工厂快速实现生产数据在线化。

不同于传统 MES 系统的重型架构，LightMes 采用 **Python FastAPI + Vue 3** 现代化技术栈，无需 Docker，单机即可运行。社区版已涵盖日常生产闭环，Pro 版提供计件工资、CRM、AI 工厂助手等 36 个功能模块，满足工厂从"能用"到"好用"的进阶需求。

> **关键词**：开源MES、生产管理系统、扫码报工、计件工资、工厂管理软件、轻量MES

---

## 功能预览

<div align="center">

| PC 管理端 | H5 移动端 |
|:---:|:---:|
| ![PC管理端-工单管理](docs/screenshots/admin-order.png) | ![H5移动端-扫码报工](docs/screenshots/h5-scan.png) |
| 工单管理 · 派工调度 · 数据看板 | 手机扫码报工 · 任务查看 · 进度跟踪 |

| PC 管理端 - 报工审核 | H5 移动端 - 派工详情 |
|:---:|:---:|
| ![PC管理端-报工审核](docs/screenshots/admin-review.png) | ![H5移动端-派工详情](docs/screenshots/h5-task.png) |
| 班组长初审 · 数据核对 | 派工明细 · 实时进度 |

</div>

> 以上为示意图，实际截图请替换为项目真实截图。

---

## 核心特性

### 社区版（免费开源）

| 特性 | 说明 |
|------|------|
| **扫码报工** | 工人使用手机 H5 页面扫描工序二维码，一键提交报工，告别纸质单据 |
| **H5 派工** | 班组长在手机端直接派工，任务实时下发到工人手机 |
| **班组长初审** | 报工数据由班组长在移动端初审，确保数据准确性 |
| **订单管理** | 基础的生产订单创建、编辑与状态跟踪 |
| **工单管理** | 工单拆分、工序分配、进度可视化 |
| **无需 Docker** | Windows / Linux 均可一键部署，降低运维门槛 |

**社区版限额**适合微型加工厂或体验评估

### 为什么选择 LightMes？

- **真正轻量**：前后端分离架构，单人即可完成部署，10 分钟上线
- **移动优先**：H5 移动端覆盖车间全场景，工人无需安装 APP
- **技术现代**：FastAPI 高性能异步框架 + Vue 3 组合式 API，代码易读易扩展
- **零门槛部署**：不依赖 Docker / K8s，传统服务器即可运行
- **数据自主**：源码交付，数据存储在自有服务器，安全可控

---

## 快速开始

### 环境要求

| 组件 | 最低版本 | 说明 |
|------|---------|------|
| Python | 3.10+ | 后端运行环境 |
| Node.js | 18+ | 前端构建工具链 |
| MySQL | 5.7+ | 主数据库 |
| Redis | 6.0+ | 缓存 & Celery 消息队列 |

### 一、克隆仓库

```bash
git clone https://github.com/likele001/lightmes-community.git
cd lightmes
```

### 二、后端部署

```bash
# 1. 进入后端目录
cd backend

# 2. 创建并激活虚拟环境
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

# 3. 安装依赖
pip install -r requirements.txt

# 4. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填写以下关键配置：
#   DB_HOST=127.0.0.1
#   DB_PORT=3306
#   DB_NAME=lightmes
#   DB_USER=root
#   DB_PASSWORD=your_password
#   REDIS_HOST=127.0.0.1
#   REDIS_PORT=6379
#   SECRET_KEY=your_secret_key

# 5. 初始化数据库（自动建表 & 写入初始数据）
python manage.py init_db

# 6. 启动后端服务
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# 7.（可选）启动 Celery 异步任务
celery -A app.celery_app worker --loglevel=info
```

启动成功后访问 `http://localhost:8000/docs` 可查看 API 文档。

### 三、PC 管理端（Admin）

```bash
# 1. 进入管理端目录
cd frontend/admin

# 2. 安装依赖
npm install

# 3. 配置后端地址（首次需修改）
# 编辑 .env.development，设置 VITE_API_BASE_URL=http://localhost:8000

# 4. 启动开发服务器
npm run dev
```

默认访问地址：`http://localhost:5173`

### 四、H5 移动端

```bash
# 1. 进入移动端目录
cd frontend/h5

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

默认访问地址：`http://localhost:5174`（使用手机浏览器访问体验更佳）

### 五、首次登录

| 角色 | 默认账号 | 默认密码 |
|------|---------|---------|
| 超级管理员 | admin | admin123 |

> 首次登录后请立即修改默认密码。

---

## 项目结构

```
lightmes/
├── backend/                    # 后端服务
│   ├── app/
│   │   ├── main.py             # FastAPI 应用入口
│   │   ├── celery_app.py       # Celery 异步任务配置
│   │   ├── core/               # 核心配置（安全、数据库、依赖注入）
│   │   ├── models/             # SQLAlchemy 数据模型
│   │   ├── schemas/            # Pydantic 请求/响应模型
│   │   ├── api/                # 路由接口（按模块划分）
│   │   │   ├── v1/             # v1 版本接口
│   │   │   └── deps.py         # 公共依赖
│   │   ├── services/           # 业务逻辑层
│   │   └── utils/              # 工具函数
│   ├── migrations/             # 数据库迁移脚本（Alembic）
│   ├── manage.py               # 管理命令入口
│   ├── requirements.txt        # Python 依赖清单
│   └── .env.example            # 环境变量模板
│
├── frontend/
│   ├── admin/                  # PC 管理端（Vue 3 + Element Plus + Tailwind CSS）
│   │   ├── src/
│   │   │   ├── views/          # 页面组件
│   │   │   ├── components/     # 通用组件
│   │   │   ├── api/            # 接口请求封装
│   │   │   ├── stores/         # Pinia 状态管理
│   │   │   ├── router/         # 路由配置
│   │   │   └── App.vue         # 根组件
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── h5/                     # H5 移动端（Vue 3 + Vant 4 + Tailwind CSS）
│       ├── src/
│       │   ├── views/          # 页面组件
│       │   ├── components/     # 通用组件
│       │   ├── api/            # 接口请求封装
│       │   ├── stores/         # Pinia 状态管理
│       │   └── App.vue         # 根组件
│       ├── vite.config.ts
│       └── package.json
│
├── docs/                       # 项目文档 & 截图
│   └── screenshots/            # 功能截图
│
├── LICENSE                     # MIT 许可证
└── README.md                   # 本文件
```

---

## 社区版 vs Pro 版

| 功能模块 | 社区版 | Pro 版 |
|---------|:------:|:------:|
| 扫码报工 | ✅ | ✅ |
| H5 派工 | ✅ | ✅ |
| 班组长初审 | ✅ | ✅ |
| 基础订单管理 | ✅ | ✅ |
| 基础工单管理 | ✅ | ✅ |
| 用户数 | 5 人 | **不限** |
| SKU 数量 | 20 个 | **不限** |
| 工序数量 | 10 个 | **不限** |
| 计件工资 | — | ✅ |
| 工资条签名确认 | — | ✅ |
| CRM 客户管理 | — | ✅ |
| AI 工厂助手 | — | ✅ |
| AI 数据预警 | — | ✅ |
| 仓储库存管理 | — | ✅ |
| 采购管理 | — | ✅ |
| 财务管理 | — | ✅ |
| 设备管理 | — | ✅ |
| 甘特图排产 | — | ✅ |
| 客户自助下单 | — | ✅ |
| 数据报表中心 | — | ✅ |
| 功能模块总数 | 5 | **36** |

> Pro 版采用**源码交付**，一次购买永久使用，含一年免费升级与技术答疑。
>
> **¥1,800 / 年** — 不到一台普通设备的零头，换来整个工厂的数字化升级。

---

## 适用行业

LightMes 适用于以 **工序流转** 为核心的中小加工制造企业：

| 行业 | 典型场景 |
|------|---------|
| 五金加工 | CNC 车铣、冲压、抛光、电镀等工序报工 |
| 注塑/压铸 | 模具上机、注塑成型、质检、包装 |
| 电子组装 | SMT 贴片、DIP 插件、组装测试 |
| 服装/纺织 | 裁剪、车缝、熨烫、包装 |
| 食品/饮料 | 配料、加工、灌装、封口 |
| 包装印刷 | 印刷、模切、覆膜、装订 |
| 通用制造 | 任何有"工序流转 + 计件"需求的工厂 |

---

## 技术架构

```
┌─────────────────────────────────────────────────┐
│                    客户端层                       │
│  ┌──────────────────┐  ┌──────────────────────┐  │
│  │  PC 管理端        │  │  H5 移动端            │  │
│  │  Vue 3 + Vite     │  │  Vue 3 + Vant 4      │  │
│  │  Element Plus     │  │  Tailwind CSS        │  │
│  │  Tailwind CSS     │  │  扫码/拍照/派工       │  │
│  └────────┬─────────┘  └──────────┬───────────┘  │
└───────────┼───────────────────────┼──────────────┘
            │     HTTP / WebSocket  │
┌───────────▼───────────────────────▼──────────────┐
│                    服务层                          │
│  ┌────────────────────────────────────────────┐   │
│  │  FastAPI (异步 REST API + WebSocket)       │   │
│  │  ┌──────┐ ┌──────────┐ ┌───────────────┐  │   │
│  │  │ 认证  │ │ 业务模块  │ │ Celery 异步   │  │   │
│  │  │ JWT  │ │ 订单/工单 │ │ 报表/通知     │  │   │
│  │  └──────┘ └──────────┘ └───────┬───────┘  │   │
│  └────────────────────────────────┼──────────┘   │
│                                   │               │
│  ┌──────────────┐  ┌──────────────▼────────────┐  │
│  │   Redis      │  │  MySQL                    │  │
│  │ 缓存/队列    │  │ SQLAlchemy ORM + Alembic  │  │
│  └──────────────┘  └───────────────────────────┘  │
└───────────────────────────────────────────────────┘
```

---

## Star 趋势

<div align="center">

[![Star History Chart](https://api.star-history.com/svg?repos=your-org/lightmes&type=Date)](https://star-history.com/#your-org/lightmes&Date)

</div>

> 如果 LightMes 对你有帮助，请给项目一个 Star，这是对开源项目最大的鼓励。

---

## 贡献指南

我们欢迎任何形式的贡献！

### 参与方式

1. **提交 Bug**：发现 Bug 请在 [Issues](https://github.com/likele001/lightmes-community/issues) 中详细描述，附上复现步骤和截图
2. **功能建议**：有改进想法？开一个 Issue 讨论，我们认真听取
3. **代码贡献**：
   - Fork 本仓库
   - 创建特性分支：`git checkout -b feature/your-feature`
   - 提交代码并遵循项目编码规范
   - 发起 Pull Request，描述清楚改动内容
4. **文档完善**：修正错别字、补充说明、翻译文档，同样是非常有价值的贡献
5. **传播推广**：给项目一个 Star、在技术社区分享使用心得

### 编码规范

- Python 后端遵循 [PEP 8](https://peps.python.org/pep-0008/)，使用 `ruff` 进行代码检查
- Vue 前端遵循 [Vue 官方风格指南](https://vuejs.org/style-guide/)，使用 ESLint + Prettier
- 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范

---

## 常见问题（FAQ）

**Q：社区版有使用时间限制吗？**
A：没有。社区版永久免费

**Q：可以部署在 Windows 服务器上吗？**
A：可以。LightMes 无需 Docker，Windows / Linux 均可直接部署。

**Q：数据安全如何保障？**
A：所有数据存储在工厂自有服务器（或私有云），不经过任何第三方平台，完全自主可控。

**Q：Pro 版如何交付？**
A：Pro 版为源码交付，包含全部 36 个功能模块的完整代码，支持私有化部署。

**Q：是否支持二次开发？**
A：社区版基于 MIT 协议开源，Pro 版源码交付，均支持二次开发。

---

## License

本项目社区版基于 [MIT License](LICENSE) 开源，您可以自由使用、修改和分发。

Pro 版为商业授权，源码交付，详情请联系微信咨询。

---

## 联系我们

| 渠道 | 信息 |
|------|------|
| 官网 | [https://lightmes.user.023ent.net/site](https://lightmes.user.023ent.net/site) |
| 在线体验 | [https://admin.mes.cenkor.cn/register/](https://admin.mes.cenkor.cn/register/) |
| 微信咨询 | <!-- 请替换为实际微信号 --> `your-wechat-id` |
| 问题反馈 | [GitHub Issues](https://github.com/likele001/lightmes-community/issues) |

---

<div align="center">

### 觉得 LightMes 有帮助？

<a href="https://github.com/likele001/lightmes-community/" target="_blank">
  <img src="https://img.shields.io/badge/%E2%AD%90%20Star-%E6%94%AF%E6%8C%81%E5%BC%80%E6%BA%90%E9%A1%B9%E7%9B%AE-yellow?style=for-the-badge" alt="Star this repo" />
</a>

<br><br>

**LightMes** —— 让每一家中小加工厂，都能用上自己的 MES 系统。

</div>
