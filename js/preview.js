// Preview Page - Handle responsive scaling

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('liveCanvas');

    function scaleCanvas() {
        const container = canvas.parentElement;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        const canvasAspect = 16 / 9; // 1920 / 1080
        const containerAspect = containerWidth / containerHeight;

        let scale;
        if (containerAspect > canvasAspect) {
            // Container is wider - fit to height
            scale = containerHeight / 1080;
        } else {
            // Container is taller - fit to width
            scale = containerWidth / 1920;
        }

        canvas.style.transform = `scale(${scale})`;
    }

    // Scale on load and resize
    scaleCanvas();
    window.addEventListener('resize', scaleCanvas);

    // Listen for theme changes from editor
    window.addEventListener('storage', (e) => {
        if (e.key === 'liveui-custom-theme-data') {
            const themeData = JSON.parse(e.newValue);
            themeLoader.applyCustomTheme(themeData);
        }
    });
});
