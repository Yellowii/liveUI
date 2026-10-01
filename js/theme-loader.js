// Theme Loader - Shared utilities for loading and applying themes

class ThemeLoader {
    constructor() {
        this.currentTheme = this.loadTheme();
        this.customThemes = this.loadCustomThemes();
    }

    // Load theme from localStorage or default
    loadTheme() {
        const saved = localStorage.getItem('liveui-theme');
        return saved || 'macos-light';
    }

    // Save current theme
    saveTheme(themeName) {
        localStorage.setItem('liveui-theme', themeName);
        this.currentTheme = themeName;
    }

    // Apply theme to document
    applyTheme(themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
        this.saveTheme(themeName);
    }

    // Load custom themes from localStorage
    loadCustomThemes() {
        const saved = localStorage.getItem('liveui-custom-themes');
        return saved ? JSON.parse(saved) : {};
    }

    // Save custom themes
    saveCustomThemes(themes) {
        localStorage.setItem('liveui-custom-themes', JSON.stringify(themes));
        this.customThemes = themes;
    }

    // Apply custom theme variables
    applyCustomTheme(themeData) {
        const root = document.documentElement;
        Object.entries(themeData).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
    }

    // Get all available themes
    getAllThemes() {
        const builtInThemes = [
            { id: 'macos-light', name: 'macOS Light', colors: ['#f5f5f7', '#ffffff', '#007aff'] },
            { id: 'macos-dark', name: 'macOS Dark', colors: ['#1c1c1e', '#2c2c2e', '#0a84ff'] },
            { id: 'streaming-pro', name: 'Streaming Pro', colors: ['#0f0f10', '#18181b', '#9147ff'] },
            { id: 'minimal', name: 'Minimal', colors: ['#ffffff', '#fafafa', '#000000'] }
        ];

        const customThemesList = Object.entries(this.customThemes).map(([id, data]) => ({
            id,
            name: data.name || id,
            colors: [data['--bg-primary'], data['--bg-secondary'], data['--accent-primary']],
            custom: true
        }));

        return [...builtInThemes, ...customThemesList];
    }

    // Extract current theme variables
    extractCurrentTheme() {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);

        const variables = [
            // Colors
            '--bg-primary',
            '--bg-secondary',
            '--bg-tertiary',
            '--bg-overlay',
            '--text-primary',
            '--text-secondary',
            '--text-tertiary',
            '--text-inverse',
            '--border-light',
            '--border-medium',
            '--border-strong',
            '--accent-primary',
            '--accent-primary-hover',
            '--accent-secondary',
            '--accent-danger',
            '--accent-warning',
            '--live-badge',
            '--viewer-bg',
            // Typography
            '--font-family',
            '--font-size-base',
            '--font-weight-regular',
            '--font-weight-medium',
            '--font-weight-semibold',
            // Spacing
            '--radius-sm',
            '--radius-lg',
            // Effects
            '--backdrop-blur',
            '--shadow-sm',
            '--shadow-md',
            '--shadow-lg'
        ];

        const themeData = {};
        variables.forEach(varName => {
            const value = computedStyle.getPropertyValue(varName).trim();
            if (value) {
                themeData[varName] = value;
            }
        });

        return themeData;
    }

    // Listen for theme changes from other windows
    startSyncListener() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'liveui-theme') {
                this.applyTheme(e.newValue);
            } else if (e.key === 'liveui-custom-theme-data') {
                const themeData = JSON.parse(e.newValue);
                this.applyCustomTheme(themeData);
            }
        });
    }

    // Broadcast theme change to other windows
    broadcastThemeChange(themeData) {
        localStorage.setItem('liveui-custom-theme-data', JSON.stringify(themeData));
        // Trigger storage event
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'liveui-custom-theme-data',
            newValue: JSON.stringify(themeData)
        }));
    }
}

// Initialize theme loader
const themeLoader = new ThemeLoader();

// Apply saved theme on load
document.addEventListener('DOMContentLoaded', () => {
    themeLoader.applyTheme(themeLoader.currentTheme);
    themeLoader.startSyncListener();
});
