#!/bin/bash

# Chrome扩展打包脚本
# 用于创建可上传到Chrome Web Store的ZIP文件

echo "🚀 开始打包Chrome扩展..."

# 设置变量
EXTENSION_NAME="github-catalog-enhancer"
VERSION=$(grep '"version"' manifest.json | sed 's/.*"version": "\(.*\)".*/\1/')
BUILD_DIR="build"
ZIP_NAME="${EXTENSION_NAME}-v${VERSION}.zip"

# 清理旧的构建文件
echo "🧹 清理旧构建文件..."
rm -rf "$BUILD_DIR"
rm -f *.zip

# 创建构建目录
mkdir -p "$BUILD_DIR"

# 复制必需文件
echo "📁 复制扩展文件..."
cp manifest.json "$BUILD_DIR/"
cp content.js "$BUILD_DIR/"
cp popup.html "$BUILD_DIR/"
cp popup.js "$BUILD_DIR/"
cp -r icons/ "$BUILD_DIR/"

# 复制文档文件 (可选，用于审核)
cp README.md "$BUILD_DIR/" 2>/dev/null || echo "⚠️  README.md 不存在，跳过"
cp INSTALL.md "$BUILD_DIR/" 2>/dev/null || echo "⚠️  INSTALL.md 不存在，跳过"

# 创建ZIP文件
echo "📦 创建ZIP压缩包..."
cd "$BUILD_DIR"
zip -r "../$ZIP_NAME" ./*
cd ..

# 显示结果
echo "✅ 打包完成!"
echo "📄 文件名: $ZIP_NAME"
echo "📏 文件大小: $(ls -lh "$ZIP_NAME" | awk '{print $5}')"
echo ""
echo "🎯 下一步:"
echo "1. 前往 https://chrome.google.com/webstore/devconsole/"
echo "2. 点击 '添加新项目'"
echo "3. 上传 $ZIP_NAME 文件"
echo "4. 填写商店列表信息"
echo ""
echo "📋 发布清单请查看: PUBLISH_CHECKLIST.md"
