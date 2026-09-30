// ============================================================
// BK MATERIAL ASSISTANT  ·  LOADER (entry point)
// Fetches core + UI from the repo and wires them together.
//   core/assist-core.js   → logic (auth, data, BOM, automation)
//   ui/assist-theme.js    → CSS only
//   ui/assist-ui.js       → DOM / popups / toasts
// ============================================================
(async () => {

    // Prevent duplicate injection
    if (document.getElementById("bk-material-btn")) return;

    const BASE =
        "https://raw.githubusercontent.com/chrishant/BK-ASSIST.user.scripts/refs/heads/main/BK/BOM-assist/";

    async function loadModule(path) {

        const sep = path.includes("?") ? "&" : "?";

        const res = await fetch(`${BASE}${path}${sep}_=${Date.now()}`, {
            cache: "no-store"
        });

        if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);

        (0, eval)(await res.text());
    }

    try {

        // Core first: it has no UI dependency and does the auth check
        await loadModule("core/assist-core.js");

        const ok = await window.BKAssist.core.init();

        if (!ok) return;

        // UI only loads once the user is authorized
        await loadModule("ui/assist-theme.js");
        await loadModule("ui/assist-ui.js");

        window.BKAssist.mountUI(window.BKAssist.core);

    } catch (err) {

        console.error("✘ Material Assistant failed to load:", err);
        alert(`✘ Material Assistant\n\n${err.message}`);
    }

})();
