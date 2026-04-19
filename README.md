# 中山大学 PPT HTML 模板

基于 HTML/CSS/JS 的学术 PPT 模板，灵感来源于 [Presentación UNAL](https://www.overleaf.com/latex/templates/presentacion-unal/nzfkbkgnctfp)、[SYSU Beamer Template](https://github.com/yxnchen/sysu-beamer-template) 和 [THU Beamer Theme](https://www.overleaf.com/latex/templates/thu-beamer-theme/vwnqmzndvwyb)。

无任何前端框架依赖，纯 HTML 实现。

## 快速开始

双击 `index.html` 在浏览器中打开即可。推荐 Chrome 或 Edge。

## 项目结构

```
├── index.html            # PPT 内容（编辑此文件）
├── css/
│   ├── sysu-theme.css    # 主题样式、颜色、母版组件
│   └── sysu-layouts.css  # 布局工具类（分栏、卡片、图文混排）
├── js/
│   └── sysu-slide.js     # 幻灯片引擎（导航、缩放、母版注入）
├── libs/                 # 图片资源（logo 等）
└── README.md
```

## 如何编辑

### 添加一张新 slide

在 `index.html` 的 `#slide-deck` 内添加：

```html
<div class="slide" data-section-title="章节名">
  <h2>页面标题</h2>
  <p>内容</p>
</div>
```

### 修改母版信息

编辑 `#slide-deck` 上的 `data-*` 属性：

```html
<div id="slide-deck"
  data-sysu-config
  data-author="你的名字"
  data-title="答辩题目"
  data-logo="libs/sysu_logo.png">
```

`data-date` 留空会自动使用当天日期。

## Slide 类型

### 标题页

```html
<div class="slide no-header no-footer">
  <div class="slide-title-page">
    <img class="title-logo" src="libs/sysu_logo.png" alt="Logo">
    <h1>论文标题</h1>
    <div class="subtitle">副标题</div>
    <div class="author-info">作者信息</div>
  </div>
</div>
```

### 章节页

```html
<div class="slide no-header no-footer" data-section-title="章节名">
  <div class="slide-section-divider">
    <div class="section-number">01</div>
    <h1>章节名</h1>
  </div>
</div>
```

### 目录页

```html
<div class="slide slide-toc" data-section-title="">
  <h2>主要内容</h2>
  <ol class="toc-list">
    <li>第一章</li>
    <li>第二章</li>
  </ol>
</div>
```

## 常用组件

### Block 区块

```html
<div class="block block-normal">
  <div class="block-title">标题</div>
  <div class="block-body">内容</div>
</div>
```

三种风格：`block-normal`（绿）、`block-alert`（红）、`block-example`（深绿）。

### 数学公式

```html
<div class="math math-display">E = mc^2</div>
```

使用 KaTeX 渲染，支持标准 LaTeX 语法。

### 代码

```html
<pre><code class="language-python">print("Hello")</code></pre>
```

支持 `python`、`c`、`java`、`bash`、`html` 等语言高亮。

### 表格

直接使用标准 `<table>` 标签，表头自动应用绿色主题。

### 布局

```html
<!-- 左右等分 -->
<div class="split-50">...</div>

<!-- 左图右文 -->
<div class="layout-img-left-text-right">
  <img src="...">
  <div class="text-content">...</div>
</div>

<!-- 三栏 -->
<div class="split-3">...</div>

<!-- 卡片 -->
<div class="card-grid">
  <div class="card">...</div>
</div>
```

更多布局见 `css/sysu-layouts.css`：`split-40-60`、`split-60-40`、`split-30-70`、`split-70-30`、`layout-text-left-img-right`。

### 伪代码

```html
<div class="algorithm-box">
  <div class="algo-title">算法名称</div>
  <div class="algo-line"><span class="algo-keyword">Input:</span> ...</div>
  <div class="algo-line"><span class="algo-keyword">Output:</span> ...</div>
</div>
```

## 快捷键

| 按键 | 功能 |
|------|------|
| ← → ↑ ↓ / 空格 | 翻页 |
| Home / End | 首页 / 末页 |
| F | 全屏 |
| O | 总览模式 |

## 导出 PDF

浏览器中按 `Ctrl+P`，选择"另存为 PDF"。每张 slide 自动分页。

## 导出 PPTX

使用 `export_to_pptx.py` 脚本，将每页 slide 截图后生成 PPTX 文件（图片格式，不可编辑文字）。

### 环境准备（仅需一次）

```bash
conda create -n sysu-ppt-export python=3.11 -y
conda activate sysu-ppt-export
pip install playwright python-pptx -i https://pypi.tuna.tsinghua.edu.cn/simple
```

脚本使用系统已安装的 Edge 浏览器，无需额外下载 Chromium。

### 使用方法

```bash
conda activate sysu-ppt-export
python export_to_pptx.py                         # 默认 index.html -> output.pptx
python export_to_pptx.py -i my.html -o result.pptx  # 指定输入输出
```

### 导出说明

- 脚本通过 Playwright 启动 Edge，逐页截图（2x 分辨率），再通过 python-pptx 生成 16:9 PPTX
- 母版元素（进度条、顶栏、底栏、水印）均会保留在截图中
- 依赖：`playwright`、`python-pptx`（见 `requirements.txt`）

## 许可

[MulanPSL-2.0](https://license.coscl.org.cn/MulanPSL2/)
