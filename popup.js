document.addEventListener('DOMContentLoaded', function () {
    const selectorInput = document.getElementById('selectorInput');
    const setScrollBtn = document.getElementById('setScrollBtn');
    const stopBtn = document.getElementById('stopBtn');
    const statusDiv = document.getElementById('status');
    const resultDiv = document.getElementById('result');
    
    // 新增的目录编号相关元素
    const catalogSelectorInput = document.getElementById('catalogSelectorInput');
    const addNumbersBtn = document.getElementById('addNumbersBtn');
    const removeNumbersBtn = document.getElementById('removeNumbersBtn');
    
    // 新增的颜色功能相关元素
    const applyColorsBtn = document.getElementById('applyColorsBtn');
    const removeColorsBtn = document.getElementById('removeColorsBtn');
    
    // 目录功能状态
    let isNumberingMonitoring = false;
    let isColoringMonitoring = false;

    // 从存储中获取上次使用的选择器
    chrome.storage.local.get(['lastSelector', 'lastCatalogSelector'], function (result) {
        if (result.lastSelector) {
            selectorInput.value = result.lastSelector;
        }
        if (result.lastCatalogSelector) {
            catalogSelectorInput.value = result.lastCatalogSelector;
        }
    });

    // 检查当前监控状态
    function checkStatus() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    { action: "getStatus" },
                    function (response) {
                        if (chrome.runtime.lastError) {
                            updateStatus('未连接', false);
                        } else if (response && response.success) {
                            updateStatus(
                                response.isMonitoring ? `正在监控: ${response.currentSelector}` : '未监控',
                                response.isMonitoring
                            );
                            // 更新目录功能状态
                            isNumberingMonitoring = response.isNumberingEnabled || false;
                            isColoringMonitoring = response.isColoringEnabled || false;
                            updateCatalogButtons();
                        }
                    }
                );
            }
        });
    }

    // 更新状态显示
    function updateStatus(message, isMonitoring) {
        statusDiv.textContent = message;
        statusDiv.className = isMonitoring ? 'monitoring' : 'not-monitoring';
        setScrollBtn.textContent = isMonitoring ? '重新设置监控' : '开始监控';
        stopBtn.style.display = isMonitoring ? 'block' : 'none';
    }
    
    // 更新目录按钮状态
    function updateCatalogButtons() {
        // 更新编号按钮
        addNumbersBtn.textContent = isNumberingMonitoring ? '停止编号监控' : '开始编号监控';
        addNumbersBtn.style.background = isNumberingMonitoring ? '#f44336' : '#4CAF50';
        removeNumbersBtn.style.display = 'none'; // 隐藏旧的移除按钮
        
        // 更新颜色按钮
        applyColorsBtn.textContent = isColoringMonitoring ? '停止颜色监控' : '开始颜色监控';
        applyColorsBtn.style.background = isColoringMonitoring ? '#f44336' : '#2196F3';
        removeColorsBtn.style.display = 'none'; // 隐藏旧的移除按钮
    }

    // 初始检查状态
    checkStatus();

    setScrollBtn.addEventListener('click', function () {
        const selector = selectorInput.value.trim();

        if (!selector) {
            showResult('请输入有效的CSS选择器', 'error');
            return;
        }

        // 保存当前选择器
        chrome.storage.local.set({ lastSelector: selector });

        // 获取当前活跃的标签页
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        action: "setOverflowScroll",
                        selector: selector
                    },
                    function (response) {
                        if (chrome.runtime.lastError) {
                            showResult('无法与页面通信，请刷新页面后重试', 'error');
                        } else if (response) {
                            showResult(response.message, response.success ? 'success' : 'error');
                            // 更新状态
                            setTimeout(checkStatus, 100);
                        }
                    }
                );
            }
        });
    });

    stopBtn.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    { action: "stopMonitoring" },
                    function (response) {
                        if (chrome.runtime.lastError) {
                            showResult('无法与页面通信', 'error');
                        } else if (response) {
                            showResult(response.message, 'success');
                            // 更新状态
                            setTimeout(checkStatus, 100);
                        }
                    }
                );
            }
        });
    });

    // 编号按钮事件监听器（开关式）
    addNumbersBtn.addEventListener('click', function () {
        const selector = catalogSelectorInput.value.trim();

        if (!selector) {
            showResult('请输入有效的目录CSS选择器', 'error');
            return;
        }

        // 保存当前选择器
        chrome.storage.local.set({ lastCatalogSelector: selector });

        const action = isNumberingMonitoring ? "stopCatalogNumbering" : "startCatalogNumbering";

        // 获取当前活跃的标签页
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        action: action,
                        selector: selector
                    },
                    function (response) {
                        if (chrome.runtime.lastError) {
                            showResult('无法与页面通信，请刷新页面后重试', 'error');
                        } else if (response) {
                            showResult(response.message, response.success ? 'success' : 'error');
                            // 更新状态
                            isNumberingMonitoring = !isNumberingMonitoring;
                            updateCatalogButtons();
                        }
                    }
                );
            }
        });
    });

    // 移除编号按钮事件监听器
    removeNumbersBtn.addEventListener('click', function () {
        const selector = catalogSelectorInput.value.trim();

        if (!selector) {
            showResult('请输入有效的目录CSS选择器', 'error');
            return;
        }

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        action: "removeCatalogNumbers",
                        selector: selector
                    },
                    function (response) {
                        if (chrome.runtime.lastError) {
                            showResult('无法与页面通信', 'error');
                        } else if (response) {
                            showResult(response.message, response.success ? 'success' : 'error');
                        }
                    }
                );
            }
        });
    });

    // 颜色按钮事件监听器（开关式）
    applyColorsBtn.addEventListener('click', function () {
        const selector = catalogSelectorInput.value.trim();

        if (!selector) {
            showResult('请输入有效的目录CSS选择器', 'error');
            return;
        }

        const action = isColoringMonitoring ? "stopCatalogColoring" : "startCatalogColoring";

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        action: action,
                        selector: selector
                    },
                    function (response) {
                        if (chrome.runtime.lastError) {
                            showResult('无法与页面通信，请刷新页面后重试', 'error');
                        } else if (response) {
                            showResult(response.message, response.success ? 'success' : 'error');
                            // 更新状态
                            isColoringMonitoring = !isColoringMonitoring;
                            updateCatalogButtons();
                        }
                    }
                );
            }
        });
    });

    // 移除颜色按钮事件监听器
    removeColorsBtn.addEventListener('click', function () {
        const selector = catalogSelectorInput.value.trim();

        if (!selector) {
            showResult('请输入有效的目录CSS选择器', 'error');
            return;
        }

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        action: "removeCatalogColors",
                        selector: selector
                    },
                    function (response) {
                        if (chrome.runtime.lastError) {
                            showResult('无法与页面通信', 'error');
                        } else if (response) {
                            showResult(response.message, response.success ? 'success' : 'error');
                        }
                    }
                );
            }
        });
    });

    function showResult(message, type) {
        resultDiv.textContent = message;
        resultDiv.className = type;
        resultDiv.style.display = 'block';

        // 3秒后自动隐藏结果
        setTimeout(() => {
            resultDiv.style.display = 'none';
        }, 3000);
    }
});