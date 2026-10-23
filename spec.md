# Spec · Iconfont 移动端底部导航

## 1. 项目概述

基于 `./font/` 目录的本地 iconfont 美食主题图标，制作两个移动端页面，带固定底部导航栏。

| 项目 | 内容 |
|---|---|
| 页面 A | `iconfont-3.html` — 字体图标方式（`.iconfont.icon-xxx`） |
| 页面 B | `iconfont-4.html` — SVG symbol 方式（`<svg><use xlink:href="#icon-xxx">`） |
| 导航 | 固定底部 · 4 项 · 自适应宽度 · 带数字徽章和红点 |
| 资源引用 | 直接引用 `./font/iconfont.css` + `./font/iconfont.js`，**不复制**到 cdn/ |
| index.html | 追加 2 张新卡入口（替换原 09/SOON 或追加为 10/11） |
| 命名规则 | 自定义类 / id / JS 变量加 `yy_` 前缀；iconfont 原生类 `.iconfont`、`.icon`、`.icon-hanbao` 不改 |

---

## 2. 设计方案（现代美食 App）

Subject matter：**美食外卖 App** 的首页 mockup，带底部 tab bar。视觉参考美团/饿了么风格但做克制化处理，避免过度 SaaS 卡片感。

### 2.1 色彩（6 色，全新 tokens，不复用上一轮）

| Token | HEX | 用途 |
|---|---|---|
| `--yy-bg` | `#ffffff` | 页面背景，纯白而非上一轮米纸色 |
| `--yy-ink` | `#1f1f1f` | 主文字 |
| `--yy-sub` | `#8a8a8a` | 次要文字 |
| `--yy-accent` | `#ff6b35` | 主强调色（橙红，美食色），用于 active tab、CTA |
| `--yy-accent-soft` | `#fff1ec` | 强调色浅底，用于卡片 tag |
| `--yy-line` | `#f0f0f0` | 细边线 / 分隔 |

### 2.2 字体

- **标题 / 卡片标题**：系统无衬线 `PingFang SC / Microsoft YaHei`，16-18px
- **正文 / 标签**：12-14px
- **数字徽章**：10-12px，加粗

### 2.3 页面结构（两页相同，仅图标渲染方式不同）

```
┌──────────────────────────────┐
│  [搜索栏 · 圆角 · 浅灰底]   │ ← 顶部 AppBar
├──────────────────────────────┤
│                              │
│  [Banner 轮播占位]           │ ← 橙红渐变圆角卡片
│                              │
│  [美食分类横滑 6 项]         │ ← 横向滚动分类
│                              │
│  ┌────────────────────────┐  │
│  │ 美食卡片 1              │  │ ← 左图右文案 / 上图下文
│  │ 图片 + 名称 + 价格      │  │
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │ 美食卡片 2              │  │
│  └────────────────────────┘  │
│  ...                         │
│                              │
│  ↓↓ 内容区预留 padding-bottom │ ← 为底部导航让位
├──────────────────────────────┤
│  🏠  📍  🧭  🎁            │ ← 固定底部导航（fixed）
│  首页 附近 发现  我的       │
│                    •  3     │ ← 红点在「附近」，数字徽章在「我的」
└──────────────────────────────┘
```

### 2.4 底部导航栏细节

- **固定定位**：`position: fixed; bottom: 0; left: 0; right: 0`，但内容区 `max-width: 480px` 居中
- **宽度自适应**：导航栏全宽，内部 4 项 flex 均分；内容主体 `max-width: 480px; margin: 0 auto`
- **导航项**：
  | 位置 | 图标类名 | 标签 | 徽章 |
  |---|---|---|---|
  | 1 | `.iconfont.icon-hanbao` / `#icon-hanbao` | 首页 | 无（当前 active） |
  | 2 | `.iconfont.icon-ditu` / `#icon-ditu` | 附近 | **红点**（纯圆点，无数字） |
  | 3 | `.iconfont.icon-zhinanzhen` / `#icon-zhinanzhen` | 发现 | 无 |
  | 4 | `.iconfont.icon-baoxiang` / `#icon-baoxiang` | 我的 | **数字徽章 3**（显示 "3"） |

- **徽章规格**：
  - 红点：`position: absolute; top: -4px; right: -4px; width: 8px; height: 8px; border-radius: 50%; background: #ff3b30`
  - 数字徽章：`min-width: 16px; height: 16px; border-radius: 8px; background: #ff3b30; color: white; font-size: 10px; display: flex; align-items: center; justify-content: center; padding: 0 4px`
  - 两者都相对图标容器 `position: relative` 绝对定位

- **active 状态**：当前选中「首页」时，图标 + 标签颜色变为 `--yy-accent`，其他为 `--yy-sub`

### 2.5 图标渲染方式差异

| 方式 | iconfont-3.html | iconfont-4.html |
|---|---|---|
| 引入 | `<link rel="stylesheet" href="./font/iconfont.css">` | `<script src="./font/iconfont.js"></script>` + 通用 `.icon` CSS |
| 使用 | `<span class="iconfont icon-hanbao"></span>` | `<svg class="icon" aria-hidden="true"><use xlink:href="#icon-hanbao"></use></svg>` |
| 渲染 | 字体 glyph（和上一轮 FA 同原理） | 内联 SVG symbol（运行时已由 iconfont.js 注入 DOM） |

**注意**：iconfont.js 不需要调用任何 `createIcons()` 函数，引入即自动注册 SVG symbol，可以直接引用。

### 2.6 自适应宽度方案

- **整体**：`body` 全宽背景白；`.yy_container { max-width: 480px; margin: 0 auto; padding-bottom: 80px }` 作为主内容容器
- **底部导航**：全宽 fixed，但导航内部也 `.yy_container` 480px 居中——这样窄屏时导航和内容同宽，宽屏时导航两侧留白
- **搜索栏 / 卡片**：宽度 = 容器宽度的 100%
- **美食卡片**：单列，100% 宽，`padding: 0 16px` 外边距
- **横向分类**：`overflow-x: auto; white-space: nowrap; scrollbar-width: none`

---

## 3. 验收标准

| # | 验收项 | 方式 |
|---|---|---|
| 1 | 两个页面本地双击打开，iconfont 图标正常显示（字体方式 vs SVG 方式） | 无 404 + 视觉检查 |
| 2 | F12 检查 DOM | iconfont-3: `<span class="iconfont icon-hanbao"></span>` 渲染字体 glyph；iconfont-4: `<svg><use xlink:href="#icon-hanbao">` 渲染内联 SVG |
| 3 | 底部导航 4 项 | 汉堡/地图/指南针/宝箱 + 中文标签「首页/附近/发现/我的」 |
| 4 | 徽章显示正确 | 「附近」右上角红点（8px 红圆点）；「我的」右上角数字徽章（红色圆角胶囊，显示 3） |
| 5 | 固定定位 | 滚动内容时导航始终贴底 |
| 6 | 自适应宽度 | 360px 宽度下导航 4 项均分不挤；宽屏时内容居中（max-width 480px） |
| 7 | Active 状态 | 「首页」为橙红色 active，其余为灰色；点击其他项时切换（简单 JS） |
| 8 | index.html 有入口 | 两张新卡（10 / iconfont-3 / 字体图标） + （11 / iconfont-4 / SVG symbol） |
| 9 | yy_ 前缀覆盖 | 自定义类/id/JS 变量 grep 检查通过（`.iconfont`、`.icon`、`.icon-xxx` 不改） |
| 10 | 视觉风格 | 白底 + 橙红强调 + 圆角卡片，**没有**上一轮的米纸感/发丝线/衬线标题 |

---

## 4. 任务清单（阶段 2 产出前等待 spec 确认）

1. 确认 spec.md → 进入阶段 2
2. 阶段 2 输出任务清单（预计 3 任务：iconfont-3 + iconfont-4 并行 → index.html）
3. 阶段 3-6：TDD → Code Review → 人工验证 → Git 收尾

---

*等待用户确认 spec.md 后继续。*
