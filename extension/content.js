document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get(null, (data) => {
        const url = new URL(window.location.href);
        const siteKey = Object.keys(data).find(key => url.hostname.includes(key.replace("theme_", "")));

        if (siteKey && data[siteKey]) {
            applyTheme(data[siteKey]);
        }
    });
});

function applyTheme(theme) {
    document.documentElement.style.setProperty("background-color", theme.background, "important");
    document.documentElement.style.setProperty("color", theme.text, "important");
}
