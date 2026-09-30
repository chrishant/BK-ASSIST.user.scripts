// ============================================================
// BK MATERIAL ASSISTANT  ·  CORE (no UI code in this file)
// Auth, material data, BOM lookups, automation hand-off.
// Exposes window.BKAssist.core
// ============================================================
(function () {
    const BK = (window.BKAssist = window.BKAssist || {});

// ----------------------------
// Remote data / automation
// ----------------------------
const MATERIALS_URL =
    "https://raw.githubusercontent.com/chrishant/BK-ASSIST.user.scripts/refs/heads/main/BK/BOM-assist/store/items/mat.json";

const AUTOMATION_SCRIPT_URLS = {
    STICKER:
        "https://raw.githubusercontent.com/chrishant/BK-ASSIST.user.scripts/refs/heads/main/BK/BOM-assist/engine/assist-engine-sticker.js",

    LABEL:
        "https://raw.githubusercontent.com/chrishant/BK-ASSIST.user.scripts/refs/heads/main/BK/BOM-assist/engine/assist-engine-label.js"
};

const DEFAULT_EXCESS = 5;


// ============================================================
// CACHE BUST
// ============================================================

function withCacheBust(url) {
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}_=${Date.now()}`;
}


// ============================================================
// ACCESS KEY
// ============================================================

async function verifyKey() {

    const STORAGE = "bk_auth_hash";

    let hash = localStorage.getItem(STORAGE);

    if (!hash) {

        const key = prompt("Enter BK Assistant Access Key:");

        if (!key) return false;

        const buf = await crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(key)
        );

        hash = [...new Uint8Array(buf)]
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
    }

    const res = await fetch(
        "https://raw.githubusercontent.com/chrishant/BK-ASSIST.user.scripts/main/HASH-KEY/keys.json",
        {
            cache: "no-store"
        }
    );

    if (!res.ok) {

        alert("❌ Key server unreachable");

        return false;
    }

    const db = await res.json();

    const today = new Date();

    const valid = db.keys.find(k =>
        k.hash === hash &&
        k.active &&
        new Date(k.expiry) >= today
    );

    if (!valid) {

        localStorage.removeItem(STORAGE);

        alert("❌ Access revoked or expired");

        return false;
    }

    localStorage.setItem(STORAGE, hash);

    return true;
}


    // ========================================================
    // INIT  (auth + material data)
    // ========================================================

    let MATERIALS = null;

    async function init() {

        const authorized = await verifyKey();

        if (!authorized) {
            console.warn("✘ Material Assistant not started — access key check failed.");
            return false;
        }

        try {

            const res = await fetch(withCacheBust(MATERIALS_URL), { cache: "no-store" });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            MATERIALS = await res.json();

            console.log(`✅ Loaded materials data from ${MATERIALS_URL}`);

            return true;

        } catch (err) {

            const msg =
                `Failed to load materials.json (${err.message}). ` +
                `Material Assistant will not be available.`;

            console.error(`✘ ${msg}`);
            alert(`✘ Material Assistant\n\n${msg}`);

            return false;
        }
    }


    // ========================================================
    // ANGULAR SCOPE HELPER
    // ========================================================

    function getScope(selector) {

        const el = document.querySelector(selector);

        return el
            ? angular.element(el).scope()
            : null;
    }


    // ========================================================
    // MATERIAL HELPERS
    // ========================================================

    function getBuyerKey() {

        const scope =
            getScope("#AsstCtrlMainDiv_input_item");

        const buyer =
            (scope?.main_model?.buyer_name || "")
                .trim()
                .toUpperCase();

        const buyerKey =
            Object.keys(MATERIALS)
                .sort((a, b) => b.length - a.length)
                .find(key =>
                    buyer.includes(key.toUpperCase())
                );

        if (!buyerKey) {

            console.warn(
                "No material configuration found for buyer:",
                buyer
            );
        }

        return buyerKey || null;
    }


    function getBuyerBrand() {

        const buyerKey = getBuyerKey();

        return buyerKey
            ? MATERIALS[buyerKey].brand
            : null;
    }


    function getMaterialList(type) {

        const buyerKey = getBuyerKey();

        if (!buyerKey) return [];

        return MATERIALS[buyerKey][type] || [];
    }


    function getBuyerColors() {

        const buyerKey = getBuyerKey();

        if (!buyerKey) return [];

        return MATERIALS[buyerKey].colors || [];
    }


    // ========================================================
    // MATERIAL RESOLUTION
    // ========================================================

    function resolveItem(rawItem, selectedColor) {

        if (!rawItem.needsColor) {
            return rawItem;
        }

        if (!selectedColor) {
            return null;
        }

        const variant =
            (rawItem.variants || []).find(
                v =>
                    v.color.toUpperCase() ===
                    selectedColor.toUpperCase()
            );

        if (!variant) {
            return null;
        }

        return {
            item_id: variant.item_id,
            item_name: variant.item_name,
            type: rawItem.type,
            rate: variant.rate,
            color: variant.color,
            excess: variant.excess ?? rawItem.excess
        };
    }


    function collectAvailableColors(items) {

        const colors = new Set();

        items.forEach(item => {

            if (!item.needsColor) return;

            (item.variants || []).forEach(v => {
                colors.add(v.color);
            });
        });

        return [...colors];
    }


    // ========================================================
    // BOM
    // ========================================================

    function getBomItems() {

        const scope =
            getScope("#AsstCtrlMainDiv_input_item");

        return scope?.so_component_items_list || [];
    }


    function normalize(str) {

        return (str || "")
            .trim()
            .replace(/\s+/g, " ")
            .toUpperCase();
    }


    function isItemInBom(requiredItem) {

        const bom = getBomItems();

        return bom.some(item =>

            item.item_id === requiredItem.item_id ||

            normalize(item.item_name) ===
            normalize(requiredItem.item_name)

        );
    }


    // ========================================================
    // ITEM EVALUATION  (moved out of the UI: pure logic)
    // Returns each item's state: "pending" | "ok" | "missing"
    // ========================================================

    function evaluateItems(items, selectedColor) {

        const entries = [];
        const missingItems = [];
        let hasPending = false;

        items.forEach(rawItem => {

            const resolved = resolveItem(rawItem, selectedColor);

            if (!resolved) {
                hasPending = true;
                entries.push({ raw: rawItem, resolved: null, state: "pending" });
                return;
            }

            const exists = isItemInBom(resolved);

            if (!exists) missingItems.push(resolved);

            entries.push({
                raw: rawItem,
                resolved,
                state: exists ? "ok" : "missing"
            });
        });

        return { entries, missingItems, hasPending };
    }


    // ========================================================
    // PAYLOAD BUILDER  (moved out of the UI)
    // Returns { ok: true, payload } or { ok: false, error }
    // ========================================================

    function buildPayload(category, missingItems) {

        const brand = getBuyerBrand();

        if (!brand) {
            return { ok: false, error: "Unable to resolve buyer brand." };
        }

        const itemsMissingRate = missingItems.filter(item => item.rate == null);

        if (itemsMissingRate.length) {
            console.error("Items missing rate:", itemsMissingRate);
            return {
                ok: false,
                error: `${itemsMissingRate.length} material(s) have no rate configured.`
            };
        }

        const payload = missingItems.map(item => ({
            filterText: category,
            type: item.type,
            brand: brand,
            color: item.color ?? null,
            rate: item.rate,
            excess: item.excess ?? DEFAULT_EXCESS,
            item_id: item.item_id,
            item_name: item.item_name
        }));

        return { ok: true, payload };
    }


    async function runAutomation(category, payload, hooks = {}) {

        // UI hooks are optional so core never depends on the UI layer.
        const closePopup = hooks.closePopup || (() => {});
        const showToast  = hooks.showToast  || (() => ({ update() {} }));

        window.bkPendingBomItems = payload;

        window.dispatchEvent(
            new CustomEvent(
                "bk:missing-items-ready",
                {
                    detail: payload
                }
            )
        );

        console.log(
            `📦 Handed off ${payload.length} item(s) ` +
            `to BOM automation [${category}]:`
        );

        console.table(payload);


        openCostingItemPopup();

        closePopup();


        const scriptUrl =
            AUTOMATION_SCRIPT_URLS[category];

        if (!scriptUrl) {

            console.error(
                `✘ No automation script configured for category "${category}".`
            );

            showToast(
                "Automation script is not configured.",
                "error"
            );

            return;
        }


        const loading =
            showToast(
                `Starting ${category === "STICKER" ? "Sticker" : "Label"} automation...`,
                "loading"
            );


        try {

            const res = await fetch(
                withCacheBust(scriptUrl),
                {
                    cache: "no-store"
                }
            );

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const code = await res.text();

            (0, eval)(code);

            loading.update(
                "Automation started successfully.",
                "success"
            );

            console.log(
                `🚀 Automation script [${category}] fetched and started.`
            );

        } catch (err) {

            console.error(
                `✘ Failed to fetch/run automation script for ${category}:`,
                err
            );

            loading.update(
                `Automation failed: ${err.message}`,
                "error"
            );
        }
    }




    // ========================================================
    // OPEN BLUEKAKTUS BOM POPUP
    // ========================================================

    function openCostingItemPopup() {

        const btn =
            document.querySelector(
                'a[title="Bom Item Costing Creation"]'
            );

        if (!btn) {

            console.error(
                "Bom Item Costing Creation button not found."
            );

            return false;
        }

        btn.dispatchEvent(
            new MouseEvent(
                "click",
                {
                    bubbles: true,
                    cancelable: true,
                    view: window
                }
            )
        );

        return true;
    }



    BK.core = {
        init,
        getBuyerBrand,
        getMaterialList,
        getBuyerColors,
        collectAvailableColors,
        resolveItem,
        isItemInBom,
        normalize,
        evaluateItems,
        buildPayload,
        runAutomation,
        DEFAULT_EXCESS
    };
})();
