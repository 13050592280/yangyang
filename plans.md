# Writing Plans · iconfont 移动端底部导航（阶段 2）

## 依赖关系

```
Task 1 (iconfont-3.html) ──┐
Task 2 (iconfont-4.html) ──┤──→ Task 3 (index.html)
```

Task 1 和 Task 2 可并行（无依赖）。Task 3 必须等两个 HTML 存在。

---

## Task 1 · iconfont-3.html（字体图标方式）

### 要点
- `<link rel="stylesheet" href="./font/iconfont.css">`
- 图标使用：`<span class="iconfont icon-hanbao"></span>`
- 页面结构：AppBar 搜索栏 + Banner + 横向分类 + 美食卡片流 + 固定底部导航
- 底部导航 4 项：汉堡/地图(红点)/指南针/宝箱(数字3)
- Active 切换：点击 JS 切换 `yy_active` 类
- 全部自定义类/id/JS 变量加 `yy_` 前缀（`.iconfont`、`.icon-hanbao` 不改）

### 验收标准
- [ ] 双击打开无 404，4 个 tab bar 图标正常显示
- [ ] DOM 检查图标是字体 glyph
- [ ] 红点在「附近」右上角，数字徽章「3」在「我的」右上角
- [ ] 滚动时导航固定贴底
- [ ] max-width 480px 居中，360px 下导航 4 项均分不挤
- [ ] Active（首页）橙红，其他灰色；点击切换生效
- [ ] yy_ 前缀 grep 通过

---

## Task 2 · iconfont-4.html（SVG symbol 方式）

### 要点
- `<script src="./font/iconfont.js"></script>`（iconfont.js 自动注入 symbol，**无需调用**任何 init 函数）
- 图标使用：`<svg class="icon" aria-hidden="true"><use xlink:href="#icon-hanbao"></use></svg>`
- 需要额外加一段通用 CSS：`.icon { width:1em; height:1em; vertical-align:-0.15em; fill:currentColor }`
- 页面结构 / 底部导航 / 徽章 / active / 自适应 — **和 Task 1 完全相同**，仅图标渲染方式不同

### 验收标准
- [ ] 双击打开无 404，4 个图标正常显示
- [ ] DOM 检查图标是 `<svg><use>` 内联 SVG
- [ ] 同 Task 1 的徽章、固定定位、自适应、active、yy_ 前缀

---

## Task 3 · index.html 入口更新

### 要点
- 替换当前最后一张 `is-planned` 卡（原来是 09/SOON，如果上一轮的 SOON 被替换成了 08/09 iconfont 卡，那就新增 10/11 两张）
- 计数数字 +2
- 两张卡用原有的 `.module-card` / `.module-number` / `.module-link` 类（不加 `yy_`）

### 验收标准
- [ ] 点击新卡跳转 iconfont-3.html / iconfont-4.html 正确
- [ ] 原目录计数更新
- [ ] 原有入口不受影响

---

*等待用户确认后，进入阶段 3（TDD + 编码）。*
