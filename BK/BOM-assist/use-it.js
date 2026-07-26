// fetch.js — paste into console to load controller.js (which loads everything else)

const CONTROLLER_SCRIPT_URL = "https://raw.githubusercontent.com/chrishant/BK-ASSIST.user.scripts/refs/heads/main/BK/BOM-assist/material-assistant.js";

(async () => {
    try {
        const bust = CONTROLLER_URL.includes("?") ? "&" : "?";
        const res = await fetch(`${CONTROLLER_URL}${bust}_=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        (0, eval)(await res.text());
        console.log(`✅ controller.js loaded from ${CONTROLLER_URL}`);
    } catch (err) {
        console.error(`✘ Failed to load controller.js: ${err.message}`);
        alert(`✘ BOM Assistant Loader\n\nFailed to load controller.js: ${err.message}`);
    }
})();
