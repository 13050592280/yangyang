# Writing Plans · 任务拆解（阶段 2）

基于 spec.md 拆解为 4 个独立可验证的任务。任务间有明确依赖：Task 1 → Task 2/3 可并行 → Task 4。

---

## Task 1 · CDN 资源本地化（阻塞 Task 2/3 的前置任务）

### 子步骤
1. 创建 `./cdn/font-awesome/` 和 `./cdn/lucide/` 目录结构
2. **shell 下载**（禁止 Write 工具）：`Invoke-WebRequest` 下载 FA 6.6.0 `all.min.css` 到 `cdn/font-awesome/all.min.css`
3. 解析 FA CSS 中 `@font-face { src: url("...") }` 的所有路径，**shell 下载**所有 woff2/woff 文件到 `cdn/font-awesome/webfonts/`
4. 修补 FA CSS 中的 `url()` 路径改为本地相对路径 `./cdn/font-awesome/webfonts/xxx.woff2`（因为两个 HTML 在根目录，引用路径 `./cdn/font-awesome/all.min.css` 后 CSS 内部 url 应指向 `./webfonts/` 或者 `./cdn/font-awesome/webfonts/`？需要根据实际引用关系确定）
5. **shell 下载** Lucide `0.544.0` UMD 到 `cdn/lucide/lucide.min.js`（从 `unpkg.com/lucide@0.544.0/dist/umd/lucide.js` 下载后重命名 .min.js 或直接用 .js，内容已经是压缩的）

### 验收标准
- [ ] `cdn/font-awesome/all.min.css` 存在，解析后 url 路径指向本地
- [ ] `cdn/font-awesome/webfonts/` 下有 FA free 版需要的所有 woff2/woff 文件（预计 fa-solid-900、fa-regular-400 等）
- [ ] `cdn/lucide/lucide.min.js` 存在（文件大小正常，非截断）
- [ ] 用任一临时 HTML 引用本地资源打开，FA 图标和 Lucide 运行时初始化无 404

---

## Task 2 · iconfont-1.html（Font Awesome，字体图标方式）

### 内容
- 引入 `cdn/font-awesome/all.min.css`（字体图标方式）
- 约 20 个 FA solid 图标，分 3-4 组（导航 / 社交 / 操作 / 状态）
- Hero 区一个 72px 超大 FA 图标 + 编号
- **当代艺术出版社视觉风格**（米白纸感 / 深棕衬线 / 发丝线 / 赭石强调）
- **所有自定义 CSS 类 / id / JS 变量加 `yy_` 前缀**
- 响应式（360px 不破版）

### 验收标准
- [ ] 本地双击打开无 404
- [ ] 图标渲染为字体 glyph（DOM 检查 `fa-solid fa-xxx` 的 `<i>` 标签）
- [ ] 视觉：米白底 + 发丝线 + 深棕衬线 + 赭石强调，无 template chrome
- [ ] 自定义类/id/JS 变量 grep 检查带 `yy_` 前缀
- [ ] 360px 宽度下网格合理折行

### 人工验收清单（阶段 3 TDD 产物，写在 Task 2 编码前）
1. ✅ index.html 入口存在且可点击跳转
2. ✅ FA 资源引用本地无 404
3. ✅ Hero 图标 72px 居中（相对于页面版心）
4. ✅ 分组网格每组 4-6 个图标 + 标签
5. ✅ 发丝线 header/footer 分隔
6. ✅ 响应式：360px 网格折为 2 列或单列

---

## Task 3 · iconfont-2.html（Lucide，运行时 SVG 替换方式）

### 内容
- 引入 `cdn/lucide/lucide.min.js`（UMD）
- 约 20 个 Lucide 图标，分 3-4 组（导航 / 社交 / 操作 / 状态）
- Hero 区一个 72px 超大 Lucide 图标 + 编号
- 使用 `<i data-lucide="xxx"></i>` + `lucide.createIcons()` 运行时替换为内联 SVG
- **当代艺术出版社视觉风格**（与 Task 2 同设计 tokens，但 Lucide 用 stroke 风格，FA 是 filled 风格，视觉上自然有差异）
- **所有自定义 CSS 类 / id / JS 变量加 `yy_` 前缀**
- 响应式（360px 不破版）

### 验收标准
- [ ] 本地双击打开无 404
- [ ] DOM 检查 `<i data-lucide="xxx">` 被替换为 `<svg>` 标签
- [ ] 视觉：米白底 + 发丝线 + 深棕衬线 + 赭石强调，无 template chrome
- [ ] 自定义类/id/JS 变量 grep 检查带 `yy_` 前缀
- [ ] 360px 宽度下网格合理折行

### 人工验收清单（阶段 3 TDD 产物）
1. ✅ index.html 入口存在且可点击跳转
2. ✅ Lucide 资源引用本地无 404
3. ✅ Hero 图标 72px 居中
4. ✅ 分组网格每组 4-6 个图标 + 标签
5. ✅ 发丝线 header/footer 分隔
6. ✅ 响应式：360px 网格折为 2 列或单列

---

## Task 4 · index.html 入口更新

### 内容
- 替换 `index.html` 中 `08 / SOON` 的 `is-planned` 占位卡
- 改为 `08 / ICON` → `iconfont-1.html`（Font Awesome 字体图标）
- 新增 `09 / ICON` → `iconfont-2.html`（Lucide SVG）
- 更新 "课堂目录" 下方的计数文字（原 `08 个实践入口` → 实际数量）
- 两张卡的 `module-number`、`module-card`、`module-link` 都用原 index.html 已有的类（不加 `yy_` 前缀，因为是修改而非新建）

### 验收标准
- [ ] 点击 08 卡跳转 iconfont-1.html 正确
- [ ] 点击 09 卡跳转 iconfont-2.html 正确
- [ ] 原目录计数数字正确更新
- [ ] index.html 本身所有原有入口功能不受影响

---

## 依赖关系

```
Task 1 (CDN) ──→ Task 2 (FA page) ──┐
               ──→ Task 3 (Lucide) ──┤──→ Task 4 (index.html)
```

Task 2 和 Task 3 可以并行；Task 4 必须等两个 HTML 文件都存在。

---

*等待用户确认任务清单后，进入阶段 3（TDD：人工验收清单 + 实现）。*
