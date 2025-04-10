function applyThemeToAllElements(theme) {
    const styleTag = document.createElement('style');
    styleTag.id = 'shadeora-theme';
    styleTag.textContent = `
        :root, body, * {
            background-color: ${theme.background} !important;
            color: ${theme.text} !important;
        }
        
        :host, :host * {
            background-color: ${theme.background} !important;
            color: ${theme.text} !important;
        }
    `;
    
    if (document.head.querySelector('#shadeora-theme')) {
        document.head.removeChild(document.head.querySelector('#shadeora-theme'));
    }
    document.head.appendChild(styleTag);

    const processShadowRoots = (node) => {
        if (node.shadowRoot) {
            const shadowStyle = document.createElement('style');
            shadowStyle.textContent = `
                :host, * {
                    background-color: ${theme.background} !important;
                    color: ${theme.text} !important;
                }
            `;
            node.shadowRoot.appendChild(shadowStyle);
            node.shadowRoot.querySelectorAll('*').forEach(child => processShadowRoots(child));
        }
    };

    document.querySelectorAll('*').forEach(node => processShadowRoots(node));

    if (window.location.hostname.includes("youtube")) {
        const videoBackgroundStyle = document.createElement('style');
        videoBackgroundStyle.textContent = `
            ytd-app, ytd-watch-flexy, tp-yt-paper-dialog {
                background-color: ${theme.background} !important;
            }
            video {
                background-color: ${theme.background} !important;
            }
        `;
        document.head.appendChild(videoBackgroundStyle);
    }
}

const initTheme = () => {
    chrome.storage.sync.get(null, (data) => {
        const url = new URL(window.location.href);
        const siteKey = Object.keys(data).find(key => 
            key.startsWith("theme_") && url.hostname.includes(key.replace("theme_", ""))
        );

        if (siteKey && data[siteKey]) {
            applyThemeToAllElements(data[siteKey]);
        }
    });

    const observer = new MutationObserver(mutations => {
        mutations.forEach(() => {
            chrome.storage.sync.get(null, data => {
                const url = new URL(window.location.href);
                const siteKey = Object.keys(data).find(key => 
                    key.startsWith("theme_") && url.hostname.includes(key.replace("theme_", ""))
                );
                if (siteKey && data[siteKey]) {
                    applyThemeToAllElements(data[siteKey]);
                }
            });
        });
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });

    window.addEventListener('load', () => {
        chrome.storage.sync.get(null, data => {
            const url = new URL(window.location.href);
            const siteKey = Object.keys(data).find(key => 
                key.startsWith("theme_") && url.hostname.includes(key.replace("theme_", ""))
            );
            if (siteKey && data[siteKey]) {
                applyThemeToAllElements(data[siteKey]);
            }
        });
    });
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTheme);
} else {
    initTheme();
}