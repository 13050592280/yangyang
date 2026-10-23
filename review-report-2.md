# Code Review · iconfont 移动端底部导航

## 审查范围

| 文件 | 类型 | yy_ 覆盖 |
|---|---|---|
| [iconfont-3.html](file:///d:/高级网页设计/iconfont-3.html) | 字体图标方式 | 126 处 ✅ |
| [iconfont-4.html](file:///d:/高级网页设计/iconfont-4.html) | SVG symbol 方式 | 127 处 ✅ |
| [index.html](file:///d:/高级网页设计/index.html) | 追加 2 张卡 + 计数 11 | — |

---

## 审查清单（12/12 通过）

| # | 审查项 | 结果 |
|---|---|---|
| 1 | **font 目录引用**：`./font/iconfont.css` / `./font/iconfont.js` 相对路径 | ✅ |
| 2 | **iconfont.css 路径匹配**：`@font-face url('iconfont.ttf')` 从 root HTML 引用后解析为 `./font/iconfont.ttf` | ✅ |
| 3 | **iconfont-3 图标渲染方式**：`<span class="iconfont icon-xxx">` 共 10 处（4 tab + 6 cat + 4 card + 1 search + 1 banner 隐含） | ✅ |
| 4 | **iconfont-4 图标渲染方式**：`<svg class="icon"><use xlink:href="#icon-xxx">` 共 10 处 + `iconfont.js` 提前注入 symbol | ✅ |
| 5 | **symbol IDs**：hanbao / ditu / zhinanzhen / baoxiang 全部命中 | ✅ 7 处明确匹配 |
| 6 | **固定底部导航居中**：`position:fixed; left:50%; transform:translateX(-50%); max-width:480px` | ✅ |
| 7 | **红点 + 数字徽章**：`yy_dot`（8px 红圆点附近）+ `yy_badge`（胶囊 3 在我的）absolute 定位正确 | ✅ |
| 8 | **viewport meta**：`maximum-scale=1.0,user-scalable=no` 移动端适配 | ✅ |
| 9 | **safe-area-inset-bottom**：iPhone 底部安全区适配 | ✅ |
| 10 | **零 template chrome**：无 `→`、无 ALL-CAPS、无衬线标题（这轮是美食 App 风，用无衬线） | ✅ grep 零命中 |
| 11 | **JS 只用 const/var + click handler + aria-selected 切换** | ✅ |
| 12 | **index.html 入口**：10 / iconfont-3 / 字体图标 + 11 / iconfont-4 / SVG symbol，计数 11 | ✅ |

### 无问题项 · Ready to proceed

---

## 人工验证清单（阶段 5）

| # | 测试项 | 预期 |
|---|---|---|
| 1 | 双击打开 iconfont-3.html | 汉堡/地图/指南针/宝箱 4 图标显示为字体 glyph（不是方框） |
| 2 | F12 Elements | iconfont-3: `<span class="iconfont icon-hanbao">`；iconfont-4: `<svg><use xlink:href="#icon-hanbao">` |
| 3 | 红点 + 徽章 | 「附近」图标右上角红圆点；「我的」图标右上角红色胶囊显示 "3" |
| 4 | 固定定位 | 滚动 Banner→分类→卡片流时，底部导航始终贴底 |
| 5 | Active 切换 | 初始「首页」橙红；点击「附近」变为橙红，首页变灰 |
| 6 | 自适应宽度 | 360px 下 4 项均分；480px 以上导航两侧留白居中 |
| 7 | index.html | 10 / 11 两张新卡存在，点击跳转正确 |

---

*审查通过，Ready to proceed → 阶段 5 人工验证 + 阶段 6 Git。*
