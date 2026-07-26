// Materials data now lives in a separate materials.json file so it can be
// updated day-to-day without touching this script. Point MATERIALS_URL at
// wherever you host it (an intranet static path, a GitHub raw URL, etc.).
const MATERIALS_URL = "https://raw.githubusercontent.com/chrishant/BK-ASSIST.user.scripts/refs/heads/main/BK/BOM-assist/store/items/mat.json"
    ;
// The BOM automation script (bom_auto_create_multi.js), hosted so it can be
// fetched and run automatically when "Proceed" is clicked.
const AUTOMATION_SCRIPT_URL = "https://raw.githubusercontent.com/chrishant/BK-ASSIST.user.scripts/refs/heads/main/BK/BOM-assist/engine/assist-engine.js";

const DEFAULT_EXCESS = 5;

// GitHub's raw content is served through a CDN that can cache responses for
// a few minutes even with cache: "no-store" (that header only stops the
// browser's own cache). Appending a changing query param makes every fetch
// look like a new URL to the CDN, forcing it to always return the latest file.
function withCacheBust(url) {
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}_=${Date.now()}`;
}

(async () => {
    // Prevent duplicate injection
    if (document.getElementById("bk-material-btn")) return;

    // ----------------------------
    // Load materials data (from materials.json — no fallback; fail loudly)
    // ----------------------------
    let MATERIALS;
    try {
        const res = await fetch(withCacheBust(MATERIALS_URL), { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        MATERIALS = await res.json();
        console.log(`✅ Loaded materials data from ${MATERIALS_URL}`);
    } catch (err) {
        const msg = `Failed to load materials.json (${err.message}). Material Assistant will not be available.`;
        console.error(`✘ ${msg}`);
        alert(`✘ Material Assistant\n\n${msg}`);
        return;
    }

    // ----------------------------
    // Helper: Get Angular Scope
    // ----------------------------
    function getScope(selector) {
        const el = document.querySelector(selector);
        return el ? angular.element(el).scope() : null;
    }

    // ----------------------------
    // Dynamic Lists
    // ----------------------------
    function getBuyerKey() {
        const scope = getScope("#AsstCtrlMainDiv_input_item");

        const buyer = (scope?.main_model?.buyer_name || "")
            .trim()
            .toUpperCase();

        // Longest key first, so a more specific key (e.g. "RI KIDS") wins
        // over a broader one (e.g. "RI") when the buyer name could match both.
        const buyerKey = Object.keys(MATERIALS)
            .sort((a, b) => b.length - a.length)
            .find(key => buyer.includes(key.toUpperCase()));

        if (!buyerKey) {
            console.warn("No material configuration found for buyer:", buyer);
        }

        return buyerKey || null;
    }

    function getBuyerBrand() {
        const buyerKey = getBuyerKey();
        return buyerKey ? MATERIALS[buyerKey].brand : null;
    }

    function getMaterialList(type) {
        const buyerKey = getBuyerKey();
        if (!buyerKey) return [];
        return MATERIALS[buyerKey][type] || [];
    }

    // Colors, per buyer, only used for River Island labels for now —
    // shape expected in materials.json: MATERIALS[buyerKey].colors = ["BLACK", "WHITE", ...]
    function getBuyerColors() {
        const buyerKey = getBuyerKey();
        if (!buyerKey) return [];
        return MATERIALS[buyerKey].colors || [];
    }

    // Items can be flat ({item_id, item_name, type, rate}) or a
    // variant group ({type, needsColor: true, variants: [{color,
    // item_id, item_name, rate}, ...]}). This resolves a raw list
    // entry down to a concrete item once (if needed) a color is
    // known. For variant groups with no color chosen yet, returns
    // null — caller should treat that as "pending, can't check yet".
    function resolveItem(rawItem, selectedColor) {
        if (!rawItem.needsColor) return rawItem;

        if (!selectedColor) return null;

        const variant = (rawItem.variants || []).find(
            v => v.color.toUpperCase() === selectedColor.toUpperCase()
        );

        if (!variant) return null;

        return {
            item_id: variant.item_id,
            item_name: variant.item_name,
            type: rawItem.type,
            rate: variant.rate,
            color: variant.color
        };
    }

    // Union of every color that appears across any needsColor item
    // in a list, so the dropdown only ever shows colors that are
    // actually configured somewhere.
    function collectAvailableColors(items) {
        const colors = new Set();
        items.forEach(item => {
            if (item.needsColor) {
                (item.variants || []).forEach(v => colors.add(v.color));
            }
        });
        return [...colors];
    }

    // ----------------------------
    // Add Header Button
    // ----------------------------
    const headerUL = document.querySelector("#AsstCtrlMainDiv_input_item > div.panel-heading > ul");
    if (!headerUL) {
        console.error("Header UL not found.");
        return;
    }
    const li = document.createElement("li");
    li.style.float = "right";
    li.style.marginLeft = "8px";

    const assistantBtn = document.createElement("button");
    assistantBtn.id = "bk-material-btn";
    assistantBtn.className = "btn btn-primary btn-xs";
    assistantBtn.textContent = "📋 Material Assistant";
    li.appendChild(assistantBtn);
    headerUL.appendChild(li);

    // ----------------------------
    // Overlay (Popup Container)
    // ----------------------------
    const overlay = document.createElement("div");
    overlay.id = "bk-material-overlay";
    Object.assign(overlay.style, {
        position: "fixed",
        inset: "0",
        background: "rgba(0,0,0,0.45)",
        display: "none",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999
    });
    document.body.appendChild(overlay);

    function closePopup() {
        overlay.style.display = "none";
    }
    overlay.addEventListener("click", e => {
        if (e.target === overlay) {
            closePopup();
        }
    });

    function createPopup(title, body) {
        overlay.innerHTML = "";  // Clear any existing popup
        const box = document.createElement("div");
        Object.assign(box.style, {
            width: "420px",
            background: "#fff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            fontFamily: "Arial, sans-serif"
        });
        const heading = document.createElement("h4");
        heading.textContent = title;
        heading.style.marginTop = "0";
        box.appendChild(heading);
        box.appendChild(body);
        overlay.appendChild(box);
        overlay.style.display = "flex";
    }

    // ----------------------------
    // BlueKaktus Popup Trigger
    // ----------------------------
    function openCostingItemPopup() {
        const btn = document.querySelector(
            'a[title="Bom Item Costing Creation"]'
        );

        if (!btn) {
            console.error("Bom Item Costing Creation button not found.");
            return false;
        }

        btn.dispatchEvent(new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window
        }));

        return true;
    }

    // ----------------------------
    // BOM Helpers
    // ----------------------------
    function getBomItems() {

        const scope = getScope("#AsstCtrlMainDiv_input_item");

        return scope?.so_component_items_list || [];

    }

    function isItemInBom(requiredItem) {

        const bom = getBomItems();

        return bom.some(item =>

            // Best comparison
            item.item_id === requiredItem.item_id ||

            // Fallback if item_id changes
            normalize(item.item_name) === normalize(requiredItem.item_name)

        );
    }

    function normalize(str) {

        return (str || "")
            .trim()
            .replace(/\s+/g, " ")
            .toUpperCase();

    }

    // ----------------------------
    // Main Popup
    // ----------------------------
    function showMainPopup() {
        const body = document.createElement("div");

        const stickerBtn = document.createElement("button");
        stickerBtn.className = "btn btn-info btn-block";
        stickerBtn.textContent = "🏷 Sticker";
        stickerBtn.style.marginBottom = "10px";
        stickerBtn.onclick = () =>
            showList("Sticker", getMaterialList("stickers"), "STICKER");

        const labelBtn = document.createElement("button");
        labelBtn.className = "btn btn-success btn-block";
        labelBtn.textContent = "🏷 Labels";
        labelBtn.style.marginBottom = "15px";
        labelBtn.onclick = () =>
            showList("Labels", getMaterialList("labels"), "LABEL");

        const closeBtn = document.createElement("button");
        closeBtn.className = "btn btn-default btn-block";
        closeBtn.textContent = "Close";
        closeBtn.onclick = closePopup;

        body.appendChild(stickerBtn);
        body.appendChild(labelBtn);
        body.appendChild(closeBtn);

        createPopup("Material Assistant", body);
    }

    // ----------------------------
    // List Popup (Sticker/Labels)
    // ----------------------------
    function showList(title, items, category) {
        const anyNeedsColor = items.some(item => item.needsColor);
        let selectedColor = null;

        function render() {
            const body = document.createElement("div");
            const missingItems = [];   // resolved, concrete items only
            let hasPending = false;    // true if a color-dependent item is unresolved

            // ---- Color picker (only shown if this list has any color-dependent items) ----
            if (anyNeedsColor) {
                const colors = collectAvailableColors(items);

                const colorWrap = document.createElement("div");
                colorWrap.style.marginBottom = "12px";

                const colorLabel = document.createElement("label");
                colorLabel.textContent = "Color (required for some of these labels):";
                colorLabel.style.display = "block";
                colorLabel.style.marginBottom = "4px";
                colorLabel.style.fontWeight = "bold";
                colorLabel.style.fontSize = "13px";

                const colorSelect = document.createElement("select");
                colorSelect.className = "form-control";

                const blankOpt = document.createElement("option");
                blankOpt.value = "";
                blankOpt.textContent = colors.length
                    ? "Select a color..."
                    : "No colors configured for this buyer";
                colorSelect.appendChild(blankOpt);

                colors.forEach(c => {
                    const opt = document.createElement("option");
                    opt.value = c;
                    opt.textContent = c;
                    opt.selected = c === selectedColor;
                    colorSelect.appendChild(opt);
                });

                colorSelect.onchange = () => {
                    selectedColor = colorSelect.value || null;
                    render(); // rebuild list with newly resolved items
                };

                colorWrap.appendChild(colorLabel);
                colorWrap.appendChild(colorSelect);
                body.appendChild(colorWrap);
            }

            items.forEach(rawItem => {
                const resolved = resolveItem(rawItem, selectedColor);
                const itemBtn = document.createElement("button");
                itemBtn.className = "btn btn-block";
                itemBtn.style.marginBottom = "8px";

                if (!resolved) {
                    // color-dependent item, no color chosen yet
                    hasPending = true;
                    itemBtn.style.background = "#fcf8e3";
                    itemBtn.style.border = "1px solid #f0ad4e";
                    itemBtn.style.color = "#8a6d3b";
                    itemBtn.textContent = "… " + rawItem.type + " (pick a color)";
                    itemBtn.disabled = true;
                    body.appendChild(itemBtn);
                    return;
                }

                const exists = isItemInBom(resolved);

                if (exists) {
                    itemBtn.style.background = "#dff0d8";
                    itemBtn.style.border = "1px solid #5cb85c";
                    itemBtn.style.color = "#3c763d";
                    itemBtn.textContent = "✓ " + resolved.item_name;
                } else {
                    itemBtn.style.background = "#f2dede";
                    itemBtn.style.border = "1px solid #d9534f";
                    itemBtn.style.color = "#a94442";
                    itemBtn.textContent = "✖ " + resolved.item_name;
                    missingItems.push(resolved);
                }

                itemBtn.onclick = () => console.log(resolved);
                body.appendChild(itemBtn);
            });

            // Add Proceed button at bottom
            const proceedBtn = document.createElement("button");
            proceedBtn.className = "btn btn-success btn-block";
            proceedBtn.style.marginTop = "15px";

            if (hasPending) {
                proceedBtn.disabled = true;
                proceedBtn.innerHTML = "✔ Select a Color First";
                proceedBtn.style.opacity = 0.65;
            } else if (!missingItems.length) {
                proceedBtn.disabled = true;
                proceedBtn.innerHTML = "✔ All Present";
                proceedBtn.style.opacity = 0.65;
            } else {
                proceedBtn.innerHTML = "✔ Proceed";
            }

            proceedBtn.onclick = async () => {
                if (hasPending || !missingItems.length) return;

                const brand = getBuyerBrand();
                if (!brand) {
                    console.error("Can't build handoff payload — no brand resolved for this buyer.");
                    return;
                }

                // Every item must carry its own rate — no silent default.
                const itemsMissingRate = missingItems.filter(item => item.rate == null);
                if (itemsMissingRate.length) {
                    console.error(
                        `✘ ${itemsMissingRate.length} item(s) have no rate set in MATERIALS — ` +
                        `fix these before proceeding:`,
                        itemsMissingRate.map(i => i.item_name)
                    );
                }

                const itemsWithRate = missingItems.filter(item => item.rate != null);
                if (!itemsWithRate.length) {
                    console.error("No items with a valid rate — aborting handoff.");
                    return;
                }

                // Shape each missing item exactly the way the BOM automation
                // script expects its ITEMS config entries.
                const payload = itemsWithRate.map(item => ({
                    filterText: category,   // broad "Summary" filter: STICKER or LABEL
                    type: item.type,        // used to pick the right row within that filtered set
                    brand: brand,
                    color: item.color ?? null,
                    rate: item.rate,
                    excess: item.excess ?? DEFAULT_EXCESS,
                    // kept for traceability / debugging, unused by the automation script
                    item_id: item.item_id,
                    item_name: item.item_name
                }));

                // Hand off to the BOM automation script:
                // 1) a window global it can read if it's run afterwards
                // 2) a custom event it can listen for if it's already loaded
                window.bkPendingBomItems = payload;
                window.dispatchEvent(new CustomEvent("bk:missing-items-ready", { detail: payload }));

                console.log(`📦 Handed off ${payload.length} item(s) to BOM automation:`);
                console.table(payload);

                openCostingItemPopup();
                closePopup();

                // Fetch and run the automation script now that the payload is
                // sitting on window.bkPendingBomItems and the costing popup is open.
                try {
                    const res = await fetch(withCacheBust(AUTOMATION_SCRIPT_URL), { cache: "no-store" });
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    const code = await res.text();
                    // Indirect eval runs in global scope, same as pasting it into
                    // the console — gives it access to window/$/angular as normal.
                    (0, eval)(code);
                    console.log("🚀 Automation script fetched and started.");
                } catch (err) {
                    console.error(
                        `✘ Failed to fetch/run automation script (${err.message}). ` +
                        `Payload is still on window.bkPendingBomItems — you can run it manually.`
                    );
                }
            };

            // Back button
            const backBtn = document.createElement("button");
            backBtn.className = "btn btn-warning btn-block";
            backBtn.style.marginTop = "8px";
            backBtn.textContent = "← Back";
            backBtn.onclick = showMainPopup;

            body.appendChild(proceedBtn);
            body.appendChild(backBtn);

            createPopup(title, body);
        }

        render();
    }


    // Attach main popup to header button
    assistantBtn.onclick = showMainPopup;

    console.log("✅ Material Assistant injected.");
})();
