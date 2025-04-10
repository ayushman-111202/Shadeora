document.addEventListener("DOMContentLoaded", async () => {
    const supportedSites = ["google", "youtube", "linkedin", "facebook", "wikipedia"];
    const themes = {
        google: [
            { name: "Light Mode", background: "#ffffff", text: "#202124" },
            { name: "Dark Mode", background: "#202124", text: "#e8eaed" },
            { name: "Blinky Blue", background: "#e6f0ff", text: "#003366" },
            { name: "Cherry Pink", background: "#ffe6f2", text: "#660033" },
            { name: "Glossy Green", background: "#e6ffe6", text: "#006600" }
        ],
        youtube: [
            { name: "Light Mode", background: "#ffffff", text: "#030303" },
            { name: "Dark Mode", background: "#0f0f0f", text: "#f1f1f1" },
            { name: "Apple Red", background: "#ffebee", text: "#b71c1c" },
            { name: "Chocolate Brown", background: "#efebe9", text: "#4e342e" },
            { name: "Mango Yellow", background: "#fffde7", text: "#f9a825" }
        ],
        linkedin: [
            { name: "Light Mode", background: "#ffffff", text: "#000000" },
            { name: "Dark Mode", background: "#1c1c1c", text: "#f5f5f5" },
            { name: "Bubbly Blue", background: "#e3f2fd", text: "#0d47a1" },
            { name: "Goblin Green", background: "#e8f5e9", text: "#1b5e20" },
            { name: "Peachy Pink", background: "#fce4ec", text: "#ad1457" }
        ],
        facebook: [
            { name: "Light Mode", background: "#f0f2f5", text: "#1c1e21" },
            { name: "Dark Mode", background: "#18191A", text: "#E4E6EB" },
            { name: "Bingo Blue", background: "#e1f5fe", text: "#01579b" },
            { name: "Gothic Green", background: "#e8f5e9", text: "#2e7d32" },
            { name: "Particle Purple", background: "#f3e5f5", text: "#6a1b9a" }
        ],
        wikipedia: [
            { name: "Light Mode", background: "#f8f9fa", text: "#202122" },
            { name: "Dark Mode", background: "#202122", text: "#ffffff" },
            { name: "Caramel Brown", background: "#efebe9", text: "#5d4037" },
            { name: "Thinking Teal", background: "#e0f2f1", text: "#004d40" },
            { name: "Atom Amber", background: "#fff8e1", text: "#ff6f00" }
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
                    chrome.storage.sync.set({ 
                        [`theme_${siteName}`]: theme,
                        lastAppliedTheme: { site: siteName, theme: theme }
                    }, () => {
                        chrome.scripting.executeScript({
                            target: { tabId: tabs[0].id },
                            files: ["content.js"]
                        });
                    });
                });

                themeList.appendChild(themeItem);
            });

            document.getElementById("reset-theme").addEventListener("click", () => {
                chrome.storage.sync.remove(`theme_${siteName}`, () => {
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        func: () => {
                            document.documentElement.style = "";
                            document.body.style = "";
                            const allElements = document.querySelectorAll('*');
                            allElements.forEach(el => {
                                el.style = "";
                                if (el.shadowRoot) {
                                    el.shadowRoot.innerHTML = '';
                                }
                            });
                            location.reload();
                        }
                    });
                });
            });
        }
    });
});