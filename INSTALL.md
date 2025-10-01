# 安装和使用指南

## 📦 安装步骤

### 1. 准备扩展文件
确保你有以下文件：
- `manifest.json`
- `content.js`
- `popup.html`
- `popup.js`
- `test.html`
- `icons/` 文件夹及其中的图标文件

### 2. 在Chrome中安装扩展

1. **打开Chrome扩展管理页面**
   - 在地址栏输入：`chrome://extensions/`
   - 或者：菜单 → 更多工具 → 扩展程序

2. **启用开发者模式**
   - 在页面右上角打开"开发者模式"开关

3. **加载扩展**
   - 点击"加载已解压的扩展程序"
   - 选择包含所有扩展文件的文件夹
   - 点击"选择文件夹"

4. **确认安装**
   - 扩展应该出现在扩展列表中
   - 浏览器工具栏应该显示扩展图标

## 🚀 使用指南

### 功能一：Overflow Scroll设置

1. **打开任意网页**
2. **点击扩展图标**
3. **输入CSS选择器**
   - 例如：`div.content`
   - 例如：`#main-container`
4. **点击"开始监控"**
5. **查看结果反馈**

### 功能二：目录编号

1. **打开包含目录结构的网页**
   - 例如：GitHub README页面
   - 或者：打开提供的 `test.html` 进行测试

2. **点击扩展图标**

3. **在"目录编号功能"部分输入选择器**
   - GitHub示例：`#__primerPortalRoot__ > div > div > div > section > nav > ul`
   - 测试页面：`#test-catalog`

4. **点击"添加编号"**
   - 目录项将自动添加层级编号
   - 主章节：1, 2, 3...
   - 子章节：3.1, 3.2, 6.1, 6.2...

5. **移除编号（可选）**
   - 点击"移除编号"恢复原始文本

## 🔧 故障排除

### 常见问题

**Q: 扩展图标不显示？**
A: 检查是否正确加载了扩展，确认开发者模式已启用

**Q: 点击按钮没有反应？**
A: 
- 刷新目标网页后重试
- 检查CSS选择器是否正确
- 打开开发者工具查看控制台错误

**Q: 编号功能不工作？**
A:
- 确认选择器匹配正确的目录结构
- 检查目录项是否使用了预期的CSS类名
- 尝试在测试页面 `test.html` 上验证功能

**Q: 编号显示不正确？**
A:
- 编号逻辑基于CSS类名判断层级
- 可能需要根据具体网站调整识别规则
- 查看 `content.js` 中的 `mainSectionKeywords` 数组

### 调试技巧

1. **打开开发者工具**
   - F12 或右键 → 检查

2. **查看控制台日志**
   - 扩展会输出操作日志
   - 查找以 `[Overflow Scroll Extension]` 或 `[Catalog Numbering]` 开头的消息

3. **检查元素**
   - 使用元素选择器确认CSS选择器
   - 验证目标元素的类名和结构

## 📝 自定义配置

### 修改编号规则

编辑 `content.js` 文件中的 `mainSectionKeywords` 数组：

```javascript
const mainSectionKeywords = [
    'fastchat', 'news', 'contents', 'install', 
    // 添加你的关键词
    'your-keyword-here'
];
```

### 调整层级识别

修改 `content.js` 中的层级判断逻辑：

```javascript
// 当前逻辑基于CSS类名
const hasSubItemClass = textDiv.classList.contains('fEKbCL') || 
                       textDiv.classList.contains('Sghhm');

// 可以添加更多类名或使用其他判断方式
```

## 🔄 更新扩展

1. 修改代码后，在 `chrome://extensions/` 页面
2. 找到你的扩展
3. 点击刷新按钮 🔄
4. 重新测试功能

## 📞 支持

如果遇到问题：
1. 检查本文档的故障排除部分
2. 在测试页面验证基本功能
3. 查看浏览器控制台的错误信息
4. 确认目标网站的DOM结构是否符合预期
