# 中山大学 PPT HTML 模板

基于 HTML/CSS/JS 的学术 PPT 模板，灵感来源于 [Presentación UNAL](https://www.overleaf.com/latex/templates/presentacion-unal/nzfkbkgnctfp)、[SYSU Beamer Template](https://github.com/yxnchen/sysu-beamer-template) 和 [THU Beamer Theme](https://www.overleaf.com/latex/templates/thu-beamer-theme/vwnqmzndvwyb)。

无任何前端框架依赖，纯 HTML 实现。

## 效果演示

https://github.com/user-attachments/assets/8ad66840-1076-4f98-b08e-b432a458360d

## 快速开始

由于模板将幻灯片内容拆分到多个 `sections/*.html` 文件，**不能直接双击 `index.html` 打开**。需要启动本地 HTTP 服务器：

```bash
python -m http.server 8000
# 然后访问 http://localhost:8000
```

或者使用 VS Code 的 Live Server 插件。推荐 Chrome 或 Edge 浏览器。

## 项目结构

```
├── index.html            # PPT 入口（配置与脚本引用）
├── sections/             # 幻灯片内容（分章节存放）
│   ├── 00-title.html     # 标题页 + 目录
│   ├── 01-intro.html     # 引言
│   ├── 02-examples.html  # 基础功能展示
│   ├── 03-advanced.html  # 高级功能展示
│   └── 04-end.html       # 结尾与参考文献
├── css/
│   ├── sysu-theme.css    # 主题样式、颜色、母版组件
│   └── sysu-layouts.css  # 布局工具类（分栏、卡片、图文混排）
├── js/
│   ├── sysu-slide.js     # 幻灯片引擎（导航、缩放、母版注入）
│   └── section-loader.js # 分文件加载器
├── libs/                 # 图片资源（logo 等）
├── export_to_pptx.py     # PPTX 导出脚本
├── requirements.txt      # Python 依赖
├── 演示.mp4              # 效果演示视频
└── README.md
```

## 如何编辑

### 添加一张新 slide

在对应的 `sections/*.html` 文件中添加 slide 代码块，例如：

```html
<div class="slide" data-section-title="章节名">
  <h2>页面标题</h2>
  <p>内容</p>
</div>
```

如果要新增章节，还需要在 `js/section-loader.js` 的 `SECTIONS` 数组中追加新的文件路径。

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

## 导出 PPTX

使用 `export_to_pptx.py` 脚本，将每页 slide 截图后生成 PPTX 文件。

> ⚠️ 注意：导出的 PPTX 为静态图片格式，每页 slide 是一张截图，**不支持动画效果**，文字也不可编辑。

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
