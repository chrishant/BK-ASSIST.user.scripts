// ----------------------------------------------------------------------
// fetch.js — bootstrap loader

(async () => {
    const CONTROLLER_SCRIPT_URL = "https://raw.githubusercontent.com/chrishant/BK-ASSIST.user.scripts/refs/heads/main/BK/BOM-assist/material-assistant.js"; // raw GitHub URL to controller.js

    // GitHub's raw content CDN can cache for a few minutes even with
    // cache: "no-store" (that only affects the browser's own cache).
    // A changing query param forces the CDN to treat this as a fresh URL.
    function withCacheBust(url) {
        const sep = url.includes("?") ? "&" : "?";
        return `${url}${sep}_=${Date.now()}`;
    }

    try {
        const res = await fetch(withCacheBust(CONTROLLER_SCRIPT_URL), { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const code = await res.text();

        // Indirect eval runs in global scope — same as pasting controller.js
        // directly into the console — so it has full access to window/$/angular.
        (0, eval)(code);

        console.log(`✅ controller.js fetched and started from ${CONTROLLER_SCRIPT_URL}`);
    } catch (err) {
        const msg = `Failed to load controller.js (${err.message}).`;
        console.error(`✘ ${msg}`);
        alert(`✘ BOM Assistant Loader\n\n${msg}`);
    }
})();
