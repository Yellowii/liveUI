// Editor - Main configuration interface logic

const manager = new ThemeManager();
let previewWindow = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeThemeSelector();
    initializeColorControls();
    initializeFontControls();
    initializeShadowControls();
    initializeRadiusControls();
    initializeButtons();
    initializeImportFeature();
});

// ============================================
// Theme Selector
// ============================================

function initializeThemeSelector() {
    const container = document.getElementById('themeSelector');
    const themes = manager.loader.getAllThemes();

    themes.forEach(theme => {
        const option = document.createElement('div');
        option.className = 'theme-option';
        option.dataset.themeId = theme.id;

        const preview = document.createElement('div');
        preview.className = 'theme-preview';
        theme.colors.forEach(color => {
            const span = document.createElement('span');
            span.style.backgroundColor = color;
            preview.appendChild(span);
        });

        const name = document.createElement('div');
        name.className = 'theme-name';
        name.textContent = theme.name;

        option.appendChild(preview);
        option.appendChild(name);

        if (theme.custom) {
            const badge = document.createElement('span');
            badge.style.cssText = 'font-size: 10px; color: var(--text-tertiary); margin-left: 4px;';
            badge.textContent = '(自定义)';
            name.appendChild(badge);
        }

        option.addEventListener('click', () => {
            selectTheme(theme.id);
        });

        container.appendChild(option);
    });

    // Mark active theme
    updateActiveTheme(manager.loader.currentTheme);
}

function selectTheme(themeId) {
    manager.switchTheme(themeId);
    updateActiveTheme(themeId);
    syncControlsWithTheme();
}

function updateActiveTheme(themeId) {
    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.themeId === themeId) {
            opt.classList.add('active');
        }
    });
}

// ============================================
// Color Controls
// ============================================

function initializeColorControls() {
    const container = document.getElementById('colorGrid');

    const colorVars = [
        { var: '--bg-primary', label: '主背景' },
        { var: '--bg-secondary', label: '次背景' },
        { var: '--bg-tertiary', label: '三级背景' },
        { var: '--text-primary', label: '主文字' },
        { var: '--text-secondary', label: '次文字' },
        { var: '--accent-primary', label: '主题色' },
        { var: '--accent-primary-hover', label: '主题色悬停' },
        { var: '--accent-secondary', label: '次要色' },
        { var: '--accent-danger', label: '危险色' },
        { var: '--live-badge', label: 'LIVE徽章' },
        { var: '--viewer-bg', label: '观众数背景' }
    ];

    colorVars.forEach(item => {
        const colorItem = document.createElement('div');
        colorItem.className = 'color-item';

        const label = document.createElement('label');
        label.textContent = item.label;

        const picker = document.createElement('input');
        picker.type = 'color';
        picker.dataset.var = item.var;

        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.dataset.var = item.var;
        textInput.placeholder = '#FFFFFF';

        // Sync picker and text input
        picker.addEventListener('input', (e) => {
            const color = e.target.value;
            textInput.value = color;
            manager.updateVariable(item.var, color);
        });

        textInput.addEventListener('input', (e) => {
            const color = e.target.value;
            if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
                picker.value = color;
                manager.updateVariable(item.var, color);
            }
        });

        colorItem.appendChild(label);
        colorItem.appendChild(picker);
        colorItem.appendChild(textInput);
        container.appendChild(colorItem);
    });

    syncControlsWithTheme();
}

// ============================================
// Font Controls
// ============================================

function initializeFontControls() {
    const fontFamily = document.getElementById('fontFamily');
    const fontSize = document.getElementById('fontSize');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const fontWeightHeading = document.getElementById('fontWeightHeading');
    const fontWeightBody = document.getElementById('fontWeightBody');

    fontFamily.addEventListener('change', (e) => {
        manager.updateVariable('--font-family', e.target.value);
    });

    fontSize.addEventListener('input', (e) => {
        const value = e.target.value + 'px';
        fontSizeValue.textContent = value;
        manager.updateVariable('--font-size-base', value);
    });

    fontWeightHeading.addEventListener('change', (e) => {
        manager.updateVariable('--font-weight-semibold', e.target.value);
    });

    fontWeightBody.addEventListener('change', (e) => {
        manager.updateVariable('--font-weight-regular', e.target.value);
    });
}

// ============================================
// Shadow Controls
// ============================================

function initializeShadowControls() {
    const shadowStrength = document.getElementById('shadowStrength');
    const shadowStrengthValue = document.getElementById('shadowStrengthValue');
    const shadowBlur = document.getElementById('shadowBlur');
    const shadowBlurValue = document.getElementById('shadowBlurValue');

    shadowStrength.addEventListener('input', (e) => {
        const value = e.target.value;
        shadowStrengthValue.textContent = value + '%';

        const opacity = value / 100 * 0.2;
        const shadowMd = `0 4px 6px -1px rgba(0, 0, 0, ${opacity}), 0 2px 4px -1px rgba(0, 0, 0, ${opacity * 0.6})`;
        manager.updateVariable('--shadow-md', shadowMd);
    });

    shadowBlur.addEventListener('input', (e) => {
        const value = e.target.value;
        shadowBlurValue.textContent = value + 'px';

        const blur = parseInt(value);
        const shadowLg = `0 ${blur}px ${blur * 1.5}px -${blur * 0.3}px rgba(0, 0, 0, 0.1), 0 ${blur * 0.4}px ${blur * 0.6}px -${blur * 0.2}px rgba(0, 0, 0, 0.05)`;
        manager.updateVariable('--shadow-lg', shadowLg);
    });
}

// ============================================
// Radius Controls
// ============================================

function initializeRadiusControls() {
    const radiusSmall = document.getElementById('radiusSmall');
    const radiusSmallValue = document.getElementById('radiusSmallValue');
    const radiusLarge = document.getElementById('radiusLarge');
    const radiusLargeValue = document.getElementById('radiusLargeValue');

    radiusSmall.addEventListener('input', (e) => {
        const value = e.target.value + 'px';
        radiusSmallValue.textContent = value;
        manager.updateVariable('--radius-sm', value);
    });

    radiusLarge.addEventListener('input', (e) => {
        const value = e.target.value + 'px';
        radiusLargeValue.textContent = value;
        manager.updateVariable('--radius-lg', value);
    });
}

// ============================================
// Import Feature
// ============================================

function initializeImportFeature() {
    const importBtn = document.getElementById('importColors');
    const importTextarea = document.getElementById('colorImport');

    importBtn.addEventListener('click', () => {
        const text = importTextarea.value.trim();
        if (!text) return;

        const colors = manager.parseColorImport(text);
        if (colors.length === 0) {
            alert('未检测到有效颜色代码');
            return;
        }

        const updates = manager.autoAssignColors(colors);
        manager.updateVariables(updates);
        syncControlsWithTheme();

        importTextarea.value = '';
        alert(`成功导入 ${colors.length} 个颜色`);
    });
}

// ============================================
// Action Buttons
// ============================================

function initializeButtons() {
    // Apply to preview page
    document.getElementById('applyTheme').addEventListener('click', () => {
        manager.applyToPreview();

        // Also update the iframe
        const iframe = document.getElementById('previewFrame');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'applyTheme',
                theme: manager.currentConfig
            }, '*');
        }

        showNotification('主题已应用到预览页');
    });

    // Open preview in new window
    document.getElementById('openPreview').addEventListener('click', () => {
        if (previewWindow && !previewWindow.closed) {
            previewWindow.focus();
        } else {
            previewWindow = window.open('preview.html', 'LiveUI Preview', 'width=1920,height=1080');
        }
    });

    // Save as new theme
    document.getElementById('saveAsNew').addEventListener('click', () => {
        const name = prompt('请输入新主题名称:');
        if (!name) return;

        const themeId = manager.saveAsNewTheme(name);

        // Refresh theme selector
        document.getElementById('themeSelector').innerHTML = '';
        initializeThemeSelector();
        updateActiveTheme(themeId);

        showNotification(`主题 "${name}" 已保存`);
    });

    // Export theme
    document.getElementById('exportTheme').addEventListener('click', () => {
        manager.exportTheme();
        showNotification('主题已导出');
    });

    // Reset
    document.getElementById('resetTheme').addEventListener('click', () => {
        if (confirm('确定要重置到默认主题吗？')) {
            manager.reset();
            syncControlsWithTheme();
            updateActiveTheme('macos-light');
        }
    });
}

// ============================================
// Utilities
// ============================================

function syncControlsWithTheme() {
    const config = manager.currentConfig;

    // Sync color pickers
    document.querySelectorAll('.color-item input[type="color"]').forEach(picker => {
        const varName = picker.dataset.var;
        const value = config[varName];
        if (value && value.startsWith('#')) {
            picker.value = value;
            picker.nextElementSibling.value = value;
        }
    });

    // Sync font controls
    const fontFamily = document.getElementById('fontFamily');
    if (config['--font-family']) {
        fontFamily.value = config['--font-family'];
    }

    const fontSize = document.getElementById('fontSize');
    if (config['--font-size-base']) {
        const size = parseInt(config['--font-size-base']);
        fontSize.value = size;
        document.getElementById('fontSizeValue').textContent = size + 'px';
    }
}

function showNotification(message) {
    // Simple notification (could be enhanced with a toast component)
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        background: var(--accent-primary);
        color: var(--text-inverse);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Listen for messages from iframe
window.addEventListener('message', (e) => {
    if (e.data.type === 'requestTheme') {
        const iframe = document.getElementById('previewFrame');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'applyTheme',
                theme: manager.currentConfig
            }, '*');
        }
    }
});

// Add animations
const style = document.createElement('style');
style.textContent = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}
`;
document.head.appendChild(style);
