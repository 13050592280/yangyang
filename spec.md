# Spec · Iconfont 双页面

## 1. 项目概述

创建两个艺术品牌风格的图标展示页面，资源全部本地化到 `cdn/` 目录，并更新 `index.html` 入口。

| 项目 | 内容 |
|---|---|
| 页面 A | `iconfont-1.html` — Font Awesome（字体图标方式） |
| 页面 B | `iconfont-2.html` — Lucide（运行时 SVG 替换方式） |
| CDN 目录 | `./cdn/`（新建），存放本地化的 Font Awesome + Lucide 资源 |
| index.html | 替换原 `08 / SOON` 占位卡为 `08 / iconfont-1` + `09 / iconfont-2` 两张新卡 |
| 命名规则 | 所有新 CSS 类名、id、JS 变量以 `yy_` 开头 |

**文件名修正**：用户输入的 `inconfont-2.html` 为 typo，统一使用 `iconfont-2.html`。

---

## 2. 设计方案（当代艺术出版社）

Subject matter：**独立当代艺术出版社**的图标系统手册页面。视觉锚定艺术画册的装帧语言，而非 generic 艺术画廊或 SaaS 卡片。

### 2.1 色彩（6 色）

| Token | HEX | 用途 |
|---|---|---|
| `--yy-paper` | `#f7f3ec` | 页面底色，仿艺术画册内页的米白厚纸 |
| `--yy-ink` | `#1c1a16` | 主标题、数字编号，近纸黑而非 template 常用的 `#0b0b0b` |
| `--yy-brown` | `#4a3f35` | 副标题、正文，深棕而非纯黑，参考油墨层次 |
| `--yy-ochre` | `#c47b3a` | 强调色，版画赭石红，仅用于编号、hover 边线、分隔点 |
| `--yy-line` | `#d7cfc2` | 细边线，仿画册目录的发丝线分隔 |
| `--yy-muted` | `#8a7f74` | 次要文字 |

### 2.2 字体

- **标题 / 编号**：Georgia / "Songti SC"（衬线，参考艺术画册扉页）
- **正文 / 图标标签**："Microsoft YaHei" / "PingFang SC"（无衬线，克制）
- **禁止** ALL-CAPS eyebrow、单字 italic 强调、`→` 链接装饰（template chrome）

### 2.3 布局

```
┌────────────────────────────────────────────────────┐
│  01 · ICONOGRAPHY SERIES          当代艺术出版社    │ ← 细边线 header
├────────────────────────────────────────────────────┤
│                                                    │
│   [ 48px 超大图标 ]                                │ ← Hero 单图标 + 编号
│   01 / FA·SOLID / 书籍                            │
│                                                    │
├────────────────────────────────────────────────────┤ ← 发丝线
│                                                    │
│   02  导航 NAVIGATION                              │ ← Roman 编号 + 功能分组
│   ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐                        │
│   │📖│ │🔍│ │🏠│ │⚙️│ │👤│  ← 20px 图标 + 标签名  │ ← 每组 4-6 个
│   └──┘ └──┘ └──┘ └──┘ └──┘                        │
│                                                    │
│   03  社交 SOCIAL                                  │
│   ┌──┐ ┌──┐ ┌──┐ ┌──┐                            │
│   │🐦│ │📷│ │💬│ │❤️│                            │
│   └──┘ └──┘ └──┘ └──┘                            │
│                                                    │
├────────────────────────────────────────────────────┤
│  FOOTER · 字体图标 / SVG · 当代艺术出版社           │
└────────────────────────────────────────────────────┘
```

- 整体 left-aligned（非居中），参考画册目录
- 编号用 `01 / 02 / 03`（非 Roman numeral，避免过度艺术化）
- 每页约 20 个图标，分成 3-4 组（导航 / 社交 / 操作 / 状态）
- 一个 Hero 大图标 + 多组中等网格 + 发丝线分隔

### 2.4 设计原则

1. **一个焦点**：每页 Hero 区放一个 72px 超大图标当视觉锚点，其余 20px 图标只做信息展示
2. **克制的装饰**：只有发丝线分隔和赭石色编号两处强调，其余全部低饱和
3. **书籍排版语言**：细边线、密集但有呼吸的行距、衬线标题 + 无衬线标签的对比
4. **禁止** template chrome（ALL-CAPS eyebrow、`→` 链接、单字斜体、圆角卡片网格、暖米黄底）

---

## 3. CDN 资源下载清单

所有资源下载到 `./cdn/` 目录，**使用 shell 下载**（禁止 Write 工具写入第三方库，避免截断）。

### 3.1 Font Awesome（Free 版，字体图标方式）

```
cdn/font-awesome/
├── all.min.css          # 从 cdnjs 下载后，@font-face url 改为本地相对路径 ../cdn/font-awesome/webfonts/
└── webfonts/
    ├── fa-solid-900.woff2   # 解析 CSS 后按 url 下载所有依赖
    ├── fa-solid-900.woff    #
    ├── fa-regular-400.woff2 #
    └── ...                  # FA free 版实际需要的 woff2/woff 文件
```

**下载步骤**：
1. 先下载 `all.min.css`，解析其中 `@font-face { src: url("...") }` 的所有路径
2. 逐一下载 webfonts 到本地
3. 修改 CSS 中的 `url()` 为 `./cdn/font-awesome/webfonts/xxx.woff2`

### 3.2 Lucide（UMD 方式，运行时 SVG 替换）

```
cdn/lucide/
└── lucide.min.js    # 从 unpkg.com/lucide@latest/dist/umd/lucide.min.js 下载
```

**使用方式**：HTML 写 `<i class="yy_lc" data-lucide="heart"></i>`，页尾 `<script>lucide.createIcons();</script>`

---

## 4. 命名规则示例（yy_ 前缀）

```html
<!-- CSS 类 -->
<section class="yy_page">
<div class="yy_header">
<div class="yy_hero">
<div class="yy_hero_icon">
<div class="yy_group">
<div class="yy_icon_grid">

<!-- id -->
<main id="yy_main">
<h2 id="yy_group_title_01">

<!-- JS 变量 -->
<script>
  const yy_iconCount = 20;
  const yy_groups = ['导航', '社交', '操作', '状态'];
</script>
```

注意：Font Awesome 自带的 `fa-solid fa-book` 类名保持原样（第三方库类名不应被用户规则覆盖），**新增的自定义类**才加 `yy_` 前缀。同理 Lucide 的 `data-lucide` 属性和 `lucide.createIcons()` 调用不改。

---

## 5. 验收标准

| # | 验收项 | 方式 |
|---|---|---|
| 1 | 两个页面在浏览器打开正常，无 404 资源 | 本地双击打开验证 |
| 2 | Font Awesome 图标正确显示（字体方式，非 SVG） | 检查 DOM 中 `<i class="fa-solid fa-book">` 渲染为字体 glyph |
| 3 | Lucide 图标正确显示（运行时 SVG 方式） | 检查 DOM 中 `<i data-lucide>` 被替换为 `<svg>` 标签 |
| 4 | cdn/ 目录完整，FA 有 all.min.css + webfonts/*.woff2，Lucide 有 lucide.min.js | 文件清单检查 |
| 5 | 视觉符合「当代艺术出版社」风格（米白纸感、深棕衬线、发丝线、赭石强调、无 template chrome） | 人工视觉检查 |
| 6 | index.html 中 08/SOON 占位卡被替换为两张新卡（08 iconfont-1、09 iconfont-2），链接正确 | 点击跳转验证 |
| 7 | 所有自定义 CSS 类 / id / JS 变量带 `yy_` 前缀 | 代码 grep 检查 |
| 8 | 响应式：窗口缩到 360px 宽时布局不破 | 浏览器 DevTools 模拟 |

---

## 6. 任务清单（阶段 2 产出前等待 spec 确认）

1. 确认 spec.md → 进入阶段 2（writing-plans）
2. 阶段 2 输出：拆分为独立可验证的任务清单 + 验收标准
3. 阶段 3-6：TDD → Code Review → 人工验证 → Git 收尾

---

*等待用户确认 spec.md 后继续。*
