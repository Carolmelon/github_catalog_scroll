# 功能演示

## 🎯 目录编号功能演示

### 原始目录结构
```
FastChat
News  
Contents
Install
  Method 1: With pip
  Method 2: From source
Model Weights
  Vicuna Weights
  Other Models
Serving with Web GUI
  Launch the controller
  Launch the model worker(s)
API
```

### 添加编号后
```
1 FastChat
2 News  
3 Contents
4 Install
  4.1 Method 1: With pip
  4.2 Method 2: From source
5 Model Weights
  5.1 Vicuna Weights
  5.2 Other Models
6 Serving with Web GUI
  6.1 Launch the controller
  6.2 Launch the model worker(s)
7 API
```

## 🔧 技术实现

### CSS类名识别规则

| CSS类名 | 层级 | 编号规则 |
|---------|------|----------|
| `kHuKdh` | 主章节 | 1, 2, 3... |
| `pZWmZ` | 主章节 | 1, 2, 3... |
| `fEKbCL` | 子章节 | x.1, x.2, x.3... |
| `Sghhm` | 深层子章节 | x.1, x.2, x.3... |

### 智能识别

扩展会根据以下因素判断章节层级：
1. **关键词匹配**：预定义的主要章节关键词
2. **CSS类名**：不同类名对应不同层级
3. **上下文分析**：根据前后项目的层级推断当前项目层级

## 🚀 使用场景

### GitHub README页面
- 自动为项目文档目录添加编号
- 便于引用和导航
- 提高文档可读性

### 技术文档网站
- 为API文档添加章节编号
- 为教程步骤添加序号
- 为规范文档添加条目编号

### 在线书籍/文章
- 为章节目录添加编号
- 为子章节添加层级编号
- 便于制作目录索引

## 🎨 自定义配置

### 修改主章节关键词
编辑 `content.js` 中的 `mainSectionKeywords` 数组：

```javascript
const mainSectionKeywords = [
    'introduction', 'getting started', 'tutorial',
    'api reference', 'examples', 'faq'
];
```

### 调整CSS类名规则
修改层级判断逻辑：

```javascript
// 主章节类名
const hasMainClass = textDiv.classList.contains('main-section') || 
                    textDiv.classList.contains('chapter');

// 子章节类名  
const hasSubItemClass = textDiv.classList.contains('sub-section') ||
                       textDiv.classList.contains('subsection');
```

## 📱 浏览器兼容性

- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ Firefox (需要适配Manifest V2)
- ✅ Safari (需要适配Safari扩展格式)

## 🔍 调试技巧

### 查看编号日志
打开开发者工具控制台，查找：
```
[Catalog Numbering] 开始为选择器添加编号: ...
```

### 检查元素结构
使用开发者工具检查目标元素：
1. 右键目录项 → 检查
2. 确认CSS类名和选择器
3. 验证DOM结构是否匹配

### 测试选择器
在控制台中测试CSS选择器：
```javascript
document.querySelectorAll('你的选择器')
```

## 💡 最佳实践

1. **选择器精确性**：使用尽可能精确的CSS选择器
2. **测试优先**：先在测试页面验证功能
3. **备份原文**：扩展会自动保存原始文本，支持恢复
4. **分步操作**：复杂页面建议分段处理
5. **定期更新**：根据目标网站变化调整配置
