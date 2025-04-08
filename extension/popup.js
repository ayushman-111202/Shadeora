document.addEventListener("DOMContentLoaded", async () => {
    const supportedSites = ["google", "youtube", "linkedin", "facebook", "wikipedia"];
    const themes = {
        google: [
            { name: "Dark Mode", background: "#202124", text: "#e8eaed" },
            { name: "Sepia", background: "#f5deb3", text: "#5e4637" },
            { name: "High Contrast", background: "#000000", text: "#ffff00" }
        ],
        youtube: [
            { name: "Caramel Brown", background: "#ffd59a", text: "#333333", secondary: "#000000" },
            { name: "Dark Mode", background: "#000000", text: "#ffffff", secondary: "#212121" },
            { name: "Midnight Blue", background: "#0a1a2f", text: "#e8f0fe", secondary: "#1a2f4f" }
        ],
        linkedin: [
            { name: "Muted Blue", background: "#283e4a", text: "#ffffff" },
            { name: "Warm Grey", background: "#b0a999", text: "#3c3c3c" },
            { name: "Professional Dark", background: "#1c1c1c", text: "#f5f5f5" }
        ],
        facebook: [
            { name: "Classic Dark", background: "#18191A", text: "#E4E6EB" },
            { name: "Light Blue", background: "#dfe3ee", text: "#1c1e21" },
            { name: "Minimal", background: "#f5f5f5", text: "#333" }
        ],
        wikipedia: [
            { name: "Paper White", background: "#fbf1d3", text: "#333" },
            { name: "Dark Mode", background: "#202122", text: "#ffffff" },
            { name: "Grey Mode", background: "#bdbdbd", text: "#222" }
        ]
    };

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) return;
        const url = new URL(tabs[0].url);
        const siteName = supportedSites.find(site => url.hostname.includes(site));

        if (siteName) {
            document.getElementById("theme-container").style.display = "block";
            document.getElementById("current-site").textContent = siteName.charAt(0).toUpperCase() + siteName.slice(1);

            const themeList = document.getElementById("theme-list");
            themeList.innerHTML = "";

            themes[siteName].forEach(theme => {
                const themeItem = document.createElement("button");
                themeItem.className = "theme-item";
                themeItem.textContent = theme.name;
                themeItem.style.background = theme.background;
                themeItem.style.color = theme.text;

                themeItem.addEventListener("click", () => {
                    chrome.storage.sync.set({ [`theme_${siteName}`]: theme }, () => {
                        chrome.scripting.executeScript({
                            target: { tabId: tabs[0].id },
                            files: ["content.js"]
                        }).then(() => {
                            chrome.scripting.executeScript({
                                target: { tabId: tabs[0].id },
                                func: (theme) => {
                                    // Force refresh YouTube player
                                    const video = document.querySelector("video");
                                    if (video) {
                                        video.style.backgroundColor = theme.background;
                                    }
                                    
                                    // Update metadata
                                    document.documentElement.style.setProperty(
                                        "--yt-spec-base-background", 
                                        theme.background
                                    );
                                    document.documentElement.style.setProperty(
                                        "--yt-spec-text-primary", 
                                        theme.text
                                    );
                                },
                                args: [theme]
                            });
                        });
                    });
                });

                themeItem.addEventListener("click", () => {
                    chrome.storage.sync.set({ [`theme_${siteName}`]: theme }, () => {
                        chrome.scripting.executeScript({
                            target: { tabId: tabs[0].id },
                            files: ["content.js"]
                        }, () => {
                            chrome.scripting.executeScript({
                                target: { tabId: tabs[0].id },
                                function: applyTheme,
                                args: [theme]
                            });
                        });

                    });
                });

                themeList.appendChild(themeItem);
            });
        }
    });
});

function applyTheme(theme) {
    document.body.style.backgroundColor = theme.background;
    document.body.style.color = theme.text;
}