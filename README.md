# Live UI Theme Editor

一个现代化的直播画面主题编辑器，支持实时预览和可视化配置。

## 功能特性

- 🎨 **可视化主题编辑器** - 无需代码，使用拾色器、滑块等直观配置
- 🔄 **实时预览** - 左侧实时查看更改效果，支持新窗口预览
- 🎭 **预设主题** - 内置 4 款精美主题（macOS Light/Dark、Streaming Pro、Minimal）
- 💾 **自定义主题保存** - 创建并保存无限数量的自定义主题
- 📦 **批量颜色导入** - 支持 HEX、RGB、CSS 变量等多种格式
- 📤 **主题导出/导入** - JSON 格式，方便分享和备份
- 📱 **响应式缩放** - 预览页面根据浏览器自动等比例缩放
- 🎯 **macOS 设计风格** - 精致的字重、圆角、阴影效果

## 项目结构

```
liveUI/
├── index.html              # 配置页面（主入口）
├── preview.html            # 预览页面
├── css/
│   ├── base.css           # CSS 变量和主题定义
│   ├── editor.css         # 编辑器样式
│   └── preview.css        # 预览页样式
├── js/
│   ├── theme-loader.js    # 主题加载工具
│   ├── theme-manager.js   # 主题管理核心
│   ├── editor.js          # 编辑器交互逻辑
│   └── preview.js         # 预览页缩放逻辑
└── assets/
    └── icons/             # 图标资源（待添加）
```

## 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/Yellowii/liveUI.git
cd liveUI
```

### 2. 打开编辑器

直接在浏览器中打开 `index.html` 即可开始使用。

### 3. 配置主题

- 左侧查看实时预览
- 右侧选择预设主题或自定义配置
- 调整颜色、字体、阴影、圆角等参数
- 点击"应用到预览页"更新独立预览窗口

## 使用指南

### 选择预设主题

在"预设主题"区域点击任意主题卡片即可应用：

- **macOS Light** - 浅色优雅风格
- **macOS Dark** - 深色专业风格
- **Streaming Pro** - 直播平台风格（紫色强调）
- **Minimal** - 极简黑白风格

### 自定义主题

1. **颜色配置** - 使用拾色器或输入 HEX 代码
2. **字体设置** - 选择字体族、字号、字重
3. **阴影效果** - 调整阴影强度和模糊半径
4. **圆角设置** - 控制小圆角和大圆角数值

### 批量导入颜色

在"快速导入"区域粘贴颜色代码，支持：

```css
/* HEX */
#FF5733
#3498DB

/* RGB */
rgb(255, 87, 51)
rgb(52, 152, 219)

/* CSS 变量 */
--primary: #FF5733
--secondary: #3498DB
```

点击"导入颜色"自动应用到主题。

### 保存自定义主题

1. 完成配置后点击"另存为新主题"
2. 输入主题名称
3. 新主题自动添加到主题选择器

### 导出/导入主题

- **导出** - 点击"导出主题"下载 JSON 文件
- **导入** - 将 JSON 内容粘贴到导入区（功能待完善）

## 技术栈

- **纯原生技术** - HTML5 + CSS3 + Vanilla JavaScript
- **CSS 变量** - 实现主题系统
- **localStorage** - 持久化主题配置
- **PostMessage API** - 跨窗口通信
- **Storage Event** - 跨标签页同步

## 浏览器支持

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

需要支持：
- CSS 自定义属性
- backdrop-filter (毛玻璃效果)
- CSS Grid/Flexbox

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

---

由 Claude Code 构建 🤖
