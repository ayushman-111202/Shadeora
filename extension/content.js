// Apply theme to YouTube's shadow DOM elements
function applyYouTubeTheme(theme) {
    // Function to inject styles into shadow roots
    const styleShadowDOM = (root) => {
        const style = document.createElement('style');
        style.textContent = `
            :host {
                background-color: ${theme.background} !important;
                color: ${theme.text} !important;
            }
            ytd-app {
                background-color: ${theme.background} !important;
            }
            #content.ytd-app {
                background-color: ${theme.background} !important;
            }
            ytd-watch-flexy {
                background-color: ${theme.background} !important;
            }
            tp-yt-paper-dialog {
                background-color: ${theme.background} !important;
                color: ${theme.text} !important;
            }
        `;
        root.appendChild(style);
    };

    // Recursive function to find all shadow roots
    const traverseShadowDOM = (node) => {
        if (node.shadowRoot) {
            styleShadowDOM(node.shadowRoot);
            const children = node.shadowRoot.children;
            for (let child of children) {
                traverseShadowDOM(child);
            }
        }
        for (let child of node.children) {
            traverseShadowDOM(child);
        }
    };

    // Initial application
    traverseShadowDOM(document.documentElement);

    // Watch for dynamic content changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                traverseShadowDOM(node);
            });
        });
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
}

// Universal theme application
function applyTheme(theme) {
    // Apply to root elements
    document.documentElement.style.setProperty("background-color", theme.background, "important");
    document.documentElement.style.setProperty("color", theme.text, "important");
    document.body.style.setProperty("background-color", theme.background, "important");
    document.body.style.setProperty("color", theme.text, "important");

    // YouTube-specific handling
    if (window.location.hostname.includes("youtube")) {
        applyYouTubeTheme(theme);
    }
}

// Initialize with MutationObserver for SPA navigation
const initTheme = () => {
    chrome.storage.sync.get(null, (data) => {
        const url = new URL(window.location.href);
        const siteKey = Object.keys(data).find(key => 
            url.hostname.includes(key.replace("theme_", ""))
        );

        if (siteKey && data[siteKey]) {
            applyTheme(data[siteKey]);
        }
    });

    // Re-apply on SPA navigation
    const bodyObserver = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            chrome.storage.sync.get(null, (data) => {
                const url = new URL(window.location.href);
                const siteKey = Object.keys(data).find(key => 
                    url.hostname.includes(key.replace("theme_", ""))
                );
                if (siteKey && data[siteKey]) {
                    applyTheme(data[siteKey]);
                }
            });
        });
    });

    bodyObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
};

// Start with DOMContentLoaded and track dynamic changes
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTheme);
} else {
    initTheme();
}