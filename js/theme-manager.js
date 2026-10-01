// Theme Manager - Core theme management logic

class ThemeManager {
    constructor() {
        this.loader = new ThemeLoader();
        this.currentConfig = this.loader.extractCurrentTheme();
        this.isCustom = false;
    }

    // Apply a built-in or custom theme
    switchTheme(themeId) {
        if (this.loader.customThemes[themeId]) {
            // Custom theme
            this.loader.applyTheme('custom-' + themeId);
            this.loader.applyCustomTheme(this.loader.customThemes[themeId]);
            this.currentConfig = this.loader.customThemes[themeId];
            this.isCustom = true;
        } else {
            // Built-in theme
            this.loader.applyTheme(themeId);
            this.isCustom = false;
            // Wait for CSS to apply, then extract
            setTimeout(() => {
                this.currentConfig = this.loader.extractCurrentTheme();
            }, 50);
        }
    }

    // Update a single CSS variable
    updateVariable(varName, value) {
        document.documentElement.style.setProperty(varName, value);
        this.currentConfig[varName] = value;
        this.isCustom = true;
    }

    // Update multiple variables at once
    updateVariables(updates) {
        Object.entries(updates).forEach(([varName, value]) => {
            document.documentElement.style.setProperty(varName, value);
            this.currentConfig[varName] = value;
        });
        this.isCustom = true;
    }

    // Save current config as a new theme
    saveAsNewTheme(name) {
        const themeId = name.toLowerCase().replace(/\s+/g, '-');
        const themeData = { ...this.currentConfig, name };

        this.loader.customThemes[themeId] = themeData;
        this.loader.saveCustomThemes(this.loader.customThemes);

        return themeId;
    }

    // Apply changes to preview frame
    applyToPreview() {
        this.loader.broadcastThemeChange(this.currentConfig);
    }

    // Export current theme as JSON
    exportTheme() {
        const themeData = {
            name: this.isCustom ? 'Custom Theme' : this.loader.currentTheme,
            variables: this.currentConfig,
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `theme-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Import theme from JSON
    importTheme(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (data.variables) {
                this.updateVariables(data.variables);
                return { success: true, name: data.name };
            }
            return { success: false, error: 'Invalid theme format' };
        } catch (e) {
            return { success: false, error: 'Failed to parse JSON' };
        }
    }

    // Parse color import (supports various formats)
    parseColorImport(text) {
        const colors = [];
        const lines = text.split('\n');

        const hexRegex = /#[0-9A-Fa-f]{6}/g;
        const rgbRegex = /rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g;
        const rgbaRegex = /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)/g;
        const cssVarRegex = /--[\w-]+\s*:\s*([^;]+)/g;

        lines.forEach(line => {
            // Extract HEX colors
            const hexMatches = line.match(hexRegex);
            if (hexMatches) colors.push(...hexMatches);

            // Extract RGB colors
            const rgbMatches = line.match(rgbRegex);
            if (rgbMatches) colors.push(...rgbMatches);

            // Extract RGBA colors
            const rgbaMatches = line.match(rgbaRegex);
            if (rgbaMatches) colors.push(...rgbaMatches);

            // Extract CSS variables
            let cssMatch;
            while ((cssMatch = cssVarRegex.exec(line)) !== null) {
                colors.push(cssMatch[1].trim());
            }
        });

        return colors.filter((c, i, arr) => arr.indexOf(c) === i); // Remove duplicates
    }

    // Auto-assign imported colors to theme variables
    autoAssignColors(colors) {
        const assignments = {
            0: '--bg-primary',
            1: '--bg-secondary',
            2: '--bg-tertiary',
            3: '--accent-primary',
            4: '--accent-secondary',
            5: '--text-primary',
            6: '--text-secondary'
        };

        const updates = {};
        colors.forEach((color, index) => {
            if (assignments[index]) {
                updates[assignments[index]] = color;
            }
        });

        return updates;
    }

    // Reset to default theme
    reset() {
        this.switchTheme('macos-light');
        document.documentElement.removeAttribute('style');
    }
}

// Export for use in editor
window.ThemeManager = ThemeManager;
