# 阅陶教育培训管理系统 (Yuetao Edu Management System) v2.0 🚀

[![Next.js](https://img.shields.io/badge/Next.js-15%2B-black?logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6%2B-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License-MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

一款专为少儿、艺术及学科类培训机构深度定制的 **全链路业务闭环管理系统**。基于 **Next.js 15 (App Router)** + **Prisma ORM** 构建，旨在通过极简的交互和强大的自动化逻辑，解决机构从招生转化到财务销课的全过程痛点。

---

## ✨ 2.0 版本重磅升级亮点

### 📦 核心业务模块
- **学员全生命周期档案**：支持中英文双姓名、动态备注、家长关联。在档案页「一站式」查看课程、财务、补课记录。
- **财务收支闭环**：不仅支持课程报名缴费，更集成「机构支出」管理，实时核算经营毛利。
- **智能库存与耗材**：物资领用与库存实时同步，自动生成领用日志，防止资产流失。
- **自动化家校沟通**：数字化记录家校联系历史，支持入学会问卷的一键下发与数据回填。

### 🛠️ 革命性技术特性
- **云端/本地环境自适应 (Auto-Pilot)**：
  - **开发环境**：无感知使用本地 SQLite，零配置运行。
  - **生产环境**：自动识别 `DATABASE_URL`，在 Vercel 等平台构建时自动将 Prisma Provider 注入为 PostgreSQL，完全屏蔽数据库迁移成本。
- **全闭环演示生态**：内置一键 Seed 脚本，秒级注入包含财务、考勤、库存全关联的 20 名真实感演示学员。
- **极致安全**：侧边栏隐藏式「系统初始化」功能，双重密码校验，保障演示环境与生产环境的安全隔离。

---

## 🚀 快速开始

### 1. 克隆与安装
```bash
git clone https://github.com/178991907/yuetao-edu-system.git
cd yuetao-edu-system
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```
> 系统将自动探测环境并初始化数据库（默认为 SQLite）。

### 3. 初始化演示数据 (推荐)
如需快速体验全业务流展示，请运行：
```bash
node scripts/seed-closed-loop.mjs && node scripts/supplement-demo.mjs
```

---

## 📑 默认访问凭据

- **管理后台**：`http://localhost:3000/dashboard`
- **默认账号**：`admin`
- **初始密码**：`admin123`

---

## 🛠️ 技术栈清单

- **全栈架构**: [Next.js 15](https://nextjs.org/) (Server Actions + App Router)
- **数据库层**: [Prisma ORM](https://www.prisma.io/) (支持 SQLite/PostgreSQL 动态切换)
- **UI/UX**: [Tailwind CSS 4.0](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **数据报表**: [Recharts](https://recharts.org/) & [XLSX](https://github.com/SheetJS/sheetjs)
- **图标系统**: [Lucide React](https://lucide.dev/)

---

## 📈 部署说明 (Vercel)

本项目完美适配 Vercel 部署：
1. 在 Vercel 后台配置环境变量 `DATABASE_URL`。
2. 推送代码，系统将在编译期自动完成从 `sqlite` 到 `postgresql` 的 Schema 静态转换。

---

© 2026 阅陶教育管理系统. [MIT Licensed](LICENSE).
