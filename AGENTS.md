# AGENTS.md

## 项目概述

中山大学 PPT HTML 模板，纯 HTML/CSS/JS 实现，无框架依赖。

## 核心文件

- `index.html` — PPT 主体，所有 slide 定义在此文件
- `css/sysu-theme.css` — 主题样式（颜色、字体、母版元素、各类组件）
- `css/sysu-layouts.css` — 布局工具类（分栏、卡片、图文混排）
- `js/sysu-slide.js` — 幻灯片引擎（导航、缩放、母版注入、KaTeX 渲染）

## Slide 结构

每个 slide 是 `#slide-deck` 下的 `<div class="slide">`，通过 `data-section-title` 标记所属章节。

母版元素（顶栏、底栏、进度条）由 JS 自动注入到 `#slide-deck`，slide 可通过 class 控制：
- `no-header` — 隐藏顶部章节栏
- `no-footer` — 隐藏底部三栏

配置写在 `#slide-deck` 的 `data-*` 属性上：`data-author`, `data-title`, `data-date`, `data-logo`。

## Slide 类型

| 类型 | 标识 | 说明 |
|------|------|------|
| 标题页 | `.slide-title-page` | 居中显示，`no-header no-footer` |
| 目录页 | `.slide-toc` | 带 `.toc-list`，JS 自动高亮当前章节 |
| 章节页 | `.slide-section-divider` | 绿色全屏背景居中，`no-header no-footer` |
| 内容页 | 默认 | 带 h2 标题，顶栏显示 `data-section-title` |

## 组件

- Block: `.block.block-normal` / `.block-alert` / `.block-example`
- 表格: 标准 `<table>`
- 图片: `<figure>` + `<figcaption>`
- 代码: `<pre><code class="language-xxx">`，Prism.js 高亮
- 公式: `<div class="math math-display">`，KaTeX 渲染
- 伪代码: `.algorithm-box`
- 布局: `.split-50`, `.split-3`, `.layout-img-left-text-right`, `.card-grid` 等（见 `sysu-layouts.css`）
- 提示框: `.simple-box`, `.alert-box`, `.success-box`

## 交互快捷键

左右箭头/空格翻页，F 全屏，O 总览，Home/End 首尾页。

## 导出

`Ctrl+P` 打印为 PDF，每张 slide 自动分页。
