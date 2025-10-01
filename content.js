// 全局变量存储当前监控的选择器和观察器
let currentSelector = null;
let observer = null;
let intervalId = null;

// 目录编号和颜色监控状态
let catalogSelector = null;
let isNumberingEnabled = false;
let isColoringEnabled = false;

// 应用样式到匹配的元素
function applyOverflowScroll(selector) {
    const elements = document.querySelectorAll(selector);
    let appliedCount = 0;

    elements.forEach(element => {
        // 检查元素是否已经设置过样式，避免重复设置
        if (element.style.overflowY !== 'scroll') {
            element.style.overflowY = 'scroll';
            appliedCount++;
        }
    });

    if (appliedCount > 0) {
        console.log(`[Overflow Scroll Extension] 已为 ${appliedCount} 个新元素设置 overflow-y: scroll`);
    }

    return elements.length;
}

// 开始监控指定选择器
function startMonitoring(selector) {
    console.log(`[Overflow Scroll Extension] 开始监控选择器: ${selector}`);
    
    // 停止之前的监控
    stopMonitoring();
    
    currentSelector = selector;
    
    // 立即应用一次
    const initialCount = applyOverflowScroll(selector);
    
    // 使用 MutationObserver 监控DOM变化
    observer = new MutationObserver((mutations) => {
        let shouldCheck = false;
        
        mutations.forEach((mutation) => {
            // 检查是否有新增或删除的节点
            if (mutation.type === 'childList' && 
                (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                shouldCheck = true;
            }
        });
        
        if (shouldCheck) {
            applyOverflowScroll(currentSelector);
            // 同时检查目录功能
            applyCatalogFeatures();
        }
    });
    
    // 开始观察整个文档的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // 同时使用定时器作为备用方案，每2秒检查一次
    intervalId = setInterval(() => {
        applyOverflowScroll(currentSelector);
        applyCatalogFeatures();
    }, 2000);
    
    return {
        success: true,
        count: initialCount,
        message: `开始监控选择器 "${selector}"，当前匹配 ${initialCount} 个元素`
    };
}

// 停止监控
function stopMonitoring() {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
    
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    
    if (currentSelector) {
        console.log(`[Overflow Scroll Extension] 停止监控选择器: ${currentSelector}`);
        currentSelector = null;
    }
}

// 统一应用目录功能（编号和颜色）
function applyCatalogFeatures() {
    if (!catalogSelector) return;
    
    if (isNumberingEnabled) {
        addCatalogNumbers(catalogSelector);
    }
    
    if (isColoringEnabled) {
        applyCatalogColors(catalogSelector);
    }
}

// 开始目录编号监控
function startCatalogNumbering(selector) {
    catalogSelector = selector;
    isNumberingEnabled = true;
    console.log(`[Catalog Numbering] 开始监控目录编号: ${selector}`);
    
    const result = addCatalogNumbers(selector);
    return {
        success: result.success,
        message: `开始监控目录编号 "${selector}"，${result.message}`
    };
}

// 停止目录编号监控
function stopCatalogNumbering() {
    if (isNumberingEnabled && catalogSelector) {
        console.log(`[Catalog Numbering] 停止监控目录编号: ${catalogSelector}`);
        removeCatalogNumbers(catalogSelector);
    }
    isNumberingEnabled = false;
    
    // 如果颜色功能也停止了，清空选择器
    if (!isColoringEnabled) {
        catalogSelector = null;
    }
    
    return {
        success: true,
        message: "已停止目录编号监控"
    };
}

// 开始目录颜色监控
function startCatalogColoring(selector) {
    catalogSelector = selector;
    isColoringEnabled = true;
    console.log(`[Catalog Colors] 开始监控目录颜色: ${selector}`);
    
    const result = applyCatalogColors(selector);
    return {
        success: result.success,
        message: `开始监控目录颜色 "${selector}"，${result.message}`
    };
}

// 停止目录颜色监控
function stopCatalogColoring() {
    if (isColoringEnabled && catalogSelector) {
        console.log(`[Catalog Colors] 停止监控目录颜色: ${catalogSelector}`);
        removeCatalogColors(catalogSelector);
    }
    isColoringEnabled = false;
    
    // 如果编号功能也停止了，清空选择器
    if (!isNumberingEnabled) {
        catalogSelector = null;
    }
    
    return {
        success: true,
        message: "已停止目录颜色监控"
    };
}

// 添加目录编号功能
function addCatalogNumbers(selector) {
    console.log(`[Catalog Numbering] 开始为选择器添加编号: ${selector}`);
    
    const catalogElement = document.querySelector(selector);
    if (!catalogElement) {
        return {
            success: false,
            message: `未找到匹配的目录元素: ${selector}`
        };
    }
    
    // 获取所有的li元素
    const listItems = catalogElement.querySelectorAll('li');
    if (listItems.length === 0) {
        return {
            success: false,
            message: "目录中没有找到列表项"
        };
    }
    
    let numberedCount = 0;
    let topLevelNumber = 1;      // kHuKdh 顶级标题
    let firstLevelNumber = 1;    // pZWmZ 一级标题
    let secondLevelNumber = 1;   // fEKbCL 二级标题
    let thirdLevelNumber = 1;    // Sghhm 三级标题
    
    let currentTopLevel = 0;
    let currentFirstLevel = 0;
    
    // 基于CSS类名的层级识别和编号
    listItems.forEach((li, index) => {
        const textDiv = li.querySelector('.prc-ActionList-ItemLabel-TmBhn > div');
        if (!textDiv) return;
        
        const originalText = textDiv.textContent.trim();
        if (/^(🆙\s*)?\d+(\.\d+)*\s/.test(originalText)) return; // 跳过已编号的（包括emoji）
        
        let numberedText;
        let levelClass = '';
        
        // 根据CSS类名确定层级
        if (textDiv.classList.contains('kHuKdh')) {
            // 顶级标题 - 添加emoji
            numberedText = `🆙 ${topLevelNumber} ${originalText}`;
            currentTopLevel = topLevelNumber;
            topLevelNumber++;
            firstLevelNumber = 1;
            secondLevelNumber = 1;
            thirdLevelNumber = 1;
            levelClass = 'top-level';
        } else if (textDiv.classList.contains('pZWmZ')) {
            // 一级标题
            numberedText = `${firstLevelNumber} ${originalText}`;
            currentFirstLevel = firstLevelNumber;
            firstLevelNumber++;
            secondLevelNumber = 1;
            thirdLevelNumber = 1;
            levelClass = 'first-level';
        } else if (textDiv.classList.contains('fEKbCL')) {
            // 二级标题
            numberedText = `${currentFirstLevel}.${secondLevelNumber} ${originalText}`;
            secondLevelNumber++;
            thirdLevelNumber = 1;
            levelClass = 'second-level';
        } else if (textDiv.classList.contains('Sghhm')) {
            // 三级标题
            numberedText = `${currentFirstLevel}.${secondLevelNumber - 1}.${thirdLevelNumber} ${originalText}`;
            thirdLevelNumber++;
            levelClass = 'third-level';
        } else {
            // 未知类型，跳过编号但记录
            console.log(`[Catalog Numbering] 未识别的类型: ${originalText}, 类名: ${textDiv.className}`);
            return;
        }
        
        // 添加标记以便后续移除和样式应用
        textDiv.setAttribute('data-original-text', originalText);
        textDiv.setAttribute('data-level-class', levelClass);
        textDiv.textContent = numberedText;
        numberedCount++;
    });
    
    return {
        success: true,
        message: `成功为 ${numberedCount} 个目录项添加了编号`
    };
}

// 应用层级背景颜色功能
function applyCatalogColors(selector) {
    console.log(`[Catalog Colors] 开始为选择器应用颜色: ${selector}`);
    
    const catalogElement = document.querySelector(selector);
    if (!catalogElement) {
        return {
            success: false,
            message: `未找到匹配的目录元素: ${selector}`
        };
    }
    
    // 定义适合夜间模式的颜色方案
    const colors = {
        // 'top-level': 'rgba(59, 130, 246, 0.15)',    // 蓝色 - 顶级
        // 'first-level': 'rgba(16, 185, 129, 0.12)',  // 绿色 - 一级
        // 'second-level': 'rgba(245, 158, 11, 0.12)', // 橙色 - 二级
        // 'third-level': 'rgba(139, 92, 246, 0.12)'   // 紫色 - 三级

        'top-level': 'rgba(59, 130, 246, 0.4)',    // 蓝色(alpha=0.4) - 顶级
        'first-level': 'rgba(59, 130, 246, 0.3)',  // 蓝色(alpha=0.3) - 一级
        'second-level': 'rgba(59, 130, 246, 0.2)', // 蓝色(alpha=0.2) - 二级
        'third-level': 'rgba(59, 130, 246, 0.1)',   // 蓝色(alpha=0.1) - 三级
    };
    
    const textDivs = catalogElement.querySelectorAll('.prc-ActionList-ItemLabel-TmBhn > div[data-level-class]');
    let coloredCount = 0;
    
    textDivs.forEach(div => {
        const levelClass = div.getAttribute('data-level-class');
        if (colors[levelClass]) {
            div.style.backgroundColor = colors[levelClass];
            div.style.borderRadius = '4px';
            // div.style.padding = '2px 6px';
            // div.style.margin = '1px 0';
            coloredCount++;
        }
    });
    
    return {
        success: true,
        message: `成功为 ${coloredCount} 个目录项应用了颜色`
    };
}

// 移除层级背景颜色功能
function removeCatalogColors(selector) {
    console.log(`[Catalog Colors] 开始移除选择器的颜色: ${selector}`);
    
    const catalogElement = document.querySelector(selector);
    if (!catalogElement) {
        return {
            success: false,
            message: `未找到匹配的目录元素: ${selector}`
        };
    }
    
    const textDivs = catalogElement.querySelectorAll('.prc-ActionList-ItemLabel-TmBhn > div[data-level-class]');
    let removedCount = 0;
    
    textDivs.forEach(div => {
        div.style.backgroundColor = '';
        div.style.borderRadius = '';
        div.style.padding = '';
        div.style.margin = '';
        removedCount++;
    });
    
    return {
        success: true,
        message: `成功移除了 ${removedCount} 个目录项的颜色`
    };
}

// 移除目录编号功能
function removeCatalogNumbers(selector) {
    console.log(`[Catalog Numbering] 开始移除选择器的编号: ${selector}`);
    
    const catalogElement = document.querySelector(selector);
    if (!catalogElement) {
        return {
            success: false,
            message: `未找到匹配的目录元素: ${selector}`
        };
    }
    
    // 获取所有带有原始文本标记的div元素
    const textDivs = catalogElement.querySelectorAll('.prc-ActionList-ItemLabel-TmBhn > div[data-original-text]');
    let removedCount = 0;
    
    textDivs.forEach(div => {
        const originalText = div.getAttribute('data-original-text');
        if (originalText) {
            div.textContent = originalText;
            div.removeAttribute('data-original-text');
            removedCount++;
        }
    });
    
    // 如果没有找到标记的元素，尝试通过正则表达式移除编号
    if (removedCount === 0) {
        const allTextDivs = catalogElement.querySelectorAll('.prc-ActionList-ItemLabel-TmBhn > div');
        allTextDivs.forEach(div => {
            const text = div.textContent.trim();
            // 匹配形如 "🆙 1 " 或 "1 " 或 "3.1 " 开头的文本
            const match = text.match(/^(🆙\s*)?(\d+(?:\.\d+)*)\s+(.+)$/);
            if (match) {
                div.textContent = match[3]; // 保留编号后的文本
                div.removeAttribute('data-level-class'); // 移除层级标记
                removedCount++;
            }
        });
    }
    
    return {
        success: true,
        message: removedCount > 0 ? `成功移除了 ${removedCount} 个目录项的编号` : "没有找到需要移除编号的项目"
    };
}

// 监听来自popup或background script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "setOverflowScroll") {
        const result = startMonitoring(request.selector);
        sendResponse(result);
    } else if (request.action === "stopMonitoring") {
        stopMonitoring();
        sendResponse({ success: true, message: "已停止监控" });
    } else if (request.action === "getStatus") {
        sendResponse({
            success: true,
            isMonitoring: currentSelector !== null,
            currentSelector: currentSelector,
            catalogSelector: catalogSelector,
            isNumberingEnabled: isNumberingEnabled,
            isColoringEnabled: isColoringEnabled
        });
    } else if (request.action === "startCatalogNumbering") {
        const result = startCatalogNumbering(request.selector);
        sendResponse(result);
    } else if (request.action === "stopCatalogNumbering") {
        const result = stopCatalogNumbering();
        sendResponse(result);
    } else if (request.action === "startCatalogColoring") {
        const result = startCatalogColoring(request.selector);
        sendResponse(result);
    } else if (request.action === "stopCatalogColoring") {
        const result = stopCatalogColoring();
        sendResponse(result);
    } else if (request.action === "addCatalogNumbers") {
        const result = addCatalogNumbers(request.selector);
        sendResponse(result);
    } else if (request.action === "removeCatalogNumbers") {
        const result = removeCatalogNumbers(request.selector);
        sendResponse(result);
    } else if (request.action === "applyCatalogColors") {
        const result = applyCatalogColors(request.selector);
        sendResponse(result);
    } else if (request.action === "removeCatalogColors") {
        const result = removeCatalogColors(request.selector);
        sendResponse(result);
    }
    return true; // 保持消息通道开放，用于异步响应
});

// 页面卸载时清理资源
window.addEventListener('beforeunload', () => {
    stopMonitoring();
    stopCatalogNumbering();
    stopCatalogColoring();
});
