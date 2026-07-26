(async () => {

    // ---- Items must come from controller.js's "Proceed" handoff — no fallback ----
    if (!window.bkPendingBomItems || !window.bkPendingBomItems.length) {
        const msg = "No items found on window.bkPendingBomItems. Run this via the Material Assistant's Proceed button.";
        console.error(`✘ ${msg}`);
        alert(`✘ BOM Automation aborted\n\n${msg}`);
        throw new Error(msg);
    }

    const ITEMS = window.bkPendingBomItems;
    console.log(`📦 Using ${ITEMS.length} item(s) handed off from Material Assistant.`);

    // ---- Same Angular-scope-based BOM check that controller.js uses ----
    // (more reliable than scraping grid row text)
    function getScope(selector) {
        const el = document.querySelector(selector);
        return el ? angular.element(el).scope() : null;
    }

    function getBomItems() {
        const scope = getScope("#AsstCtrlMainDiv_input_item");
        return scope?.so_component_items_list || [];
    }

    function normalizeName(str) {
        return (str || "").trim().replace(/\s+/g, " ").toUpperCase();
    }

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    function isPageStable() {
        if (document.readyState !== "complete") return false;
        const sels = [
            ".dx-loadpanel-wrapper", ".dx-loadindicator-wrapper",
            ".dx-datagrid-loading-panel", ".dx-overlay-shader",
            ".dx-overlay-loading-indicator", ".dx-load-indicator",
            ".dx-scrollable-scrollbar-active"
        ];
        return sels.every(sel =>
            [...document.querySelectorAll(sel)].every(n => {
                const s = getComputedStyle(n);
                return s.display === "none" || s.visibility === "hidden";
            })
        );
    }

    async function waitForPageStable({ timeout = 15000, interval = 100, settleFor = 250 } = {}) {
        const end = Date.now() + timeout;
        let since = null;
        while (Date.now() < end) {
            if (isPageStable()) {
                if (since === null) since = Date.now();
                if (Date.now() - since >= settleFor) return true;
            } else since = null;
            await sleep(interval);
        }
        throw new Error("Timeout waiting for page to stabilize.");
    }

    async function waitFor(predicate, { timeout = 15000, interval = 100, settleFor = 150 } = {}) {
        const end = Date.now() + timeout;
        let since = null, lastEl = null;
        while (Date.now() < end) {
            try {
                if (isPageStable()) {
                    const el = await predicate();
                    if (el && el === lastEl) {
                        if (Date.now() - since >= settleFor) return el;
                    } else if (el) {
                        lastEl = el;
                        since = Date.now();
                    } else {
                        lastEl = null; since = null;
                    }
                } else {
                    lastEl = null; since = null;
                }
            } catch {
                lastEl = null; since = null;
            }
            await sleep(interval);
        }
        throw new Error("Timeout waiting for element.");
    }

    async function simulateClick(el) {
        el.scrollIntoView({ block: "center", inline: "center" });
        await sleep(100);
        el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
        el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        el.click();
        await sleep(250);
    }

    async function waitForClick(predicate, options = {}) {
        const el = await waitFor(predicate, options);
        await simulateClick(el);
        return el;
    }

    async function typeIntoDxInput(input, text) {
        input.focus();
        input.value = "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        for (const ch of text) {
            input.dispatchEvent(new KeyboardEvent("keydown", { key: ch, bubbles: true }));
            input.value += ch;
            input.dispatchEvent(new InputEvent("input", { bubbles: true, data: ch, inputType: "insertText" }));
            input.dispatchEvent(new KeyboardEvent("keyup", { key: ch, bubbles: true }));
            await sleep(120);
        }
    }

    // ---- Checks whether an item is already present in the BOM ----
    // Matches by item_id when available (from the controller.js handoff),
    // falling back to a normalized item_name match otherwise.
    function isItemAlreadyInBom(cfg) {
        const bom = getBomItems();

        return bom.some(bomItem =>
            (cfg.item_id != null && bomItem.item_id === cfg.item_id) ||
            (cfg.item_name && normalizeName(bomItem.item_name) === normalizeName(cfg.item_name))
        );
    }

    // ---- Runs the full flow for a single item config ----
    async function processItem(cfg) {
        console.log(`\n=== Starting: ${cfg.type} / ${cfg.brand} ===`);

        // 1. Filter Summary
        const filter = await waitFor(() =>
            document.querySelectorAll("#grid_ItemCostingDetail .dx-datagrid-filter-row input")[1]
        );
        filter.focus();
        filter.value = "";
        filter.dispatchEvent(new Event("input", { bubbles: true }));
        await sleep(150);
        filter.value = cfg.filterText;
        filter.dispatchEvent(new Event("input", { bubbles: true }));
        filter.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", bubbles: true }));
        await sleep(400);
        await waitForPageStable({ settleFor: 400 });

        // 2. Click first matching row
        await waitForClick(() => {
            const row = document.querySelector("#grid_ItemCostingDetail .dx-data-row");
            if (!row || !row.textContent.toUpperCase().includes(cfg.filterText.toUpperCase())) return null;
            return row.querySelector("td:nth-child(3)");
        });

        // 3. Select TYPE
        await sleep(1400);
        const typeBox = $("#gridContainer_Detail .dx-selectbox").eq(0).dxSelectBox("instance");
        const typeData = await typeBox.getDataSource().load();
        const typeMatch = typeData.find(x => x.value === cfg.type);
        if (!typeMatch) throw new Error(`Type "${cfg.type}" not found in dropdown.`);
        typeBox.option("value", typeMatch.value);

        await sleep(800);

        // 4. Select BRAND
        const brandBox = $("#gridContainer_Detail .dx-selectbox").eq(1).dxSelectBox("instance");
        const brandInput = brandBox.element().find("input.dx-texteditor-input")[0];
        await typeIntoDxInput(brandInput, cfg.brand);

        let brandItem = null;
        for (let i = 0; i < 50; i++) {
            brandItem = [...document.querySelectorAll(".dx-list-item")]
                .find(x => x.innerText.trim().toUpperCase() === cfg.brand.toUpperCase());
            if (brandItem) break;
            await sleep(100);
        }
        if (!brandItem) throw new Error(`Brand "${cfg.brand}" never appeared.`);
        await simulateClick(brandItem);
        await waitForPageStable();

        // 5. Excess %
        const excessInput = await waitFor(() => document.querySelector('input[ng-model="excess_per"]'));
        excessInput.focus();
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
        setter.call(excessInput, cfg.excess);
        excessInput.dispatchEvent(new Event("input", { bubbles: true }));
        excessInput.dispatchEvent(new Event("change", { bubbles: true }));
        excessInput.dispatchEvent(new Event("blur", { bubbles: true }));
        console.log("✔ Excess % set");

        // 6. Budget Rate
        const budgetInput = await waitFor(() => document.querySelector('input[ng-model="budgeted_rate"]'));
        budgetInput.focus();
        budgetInput.value = cfg.rate;
        budgetInput.dispatchEvent(new Event("input", { bubbles: true }));
        budgetInput.dispatchEvent(new Event("change", { bubbles: true }));
        budgetInput.dispatchEvent(new Event("blur", { bubbles: true }));
        console.log("✔ Rate set");

        // 7. Create Item
        const btn1 = await waitFor(() => document.querySelector(
            'button[ng-click="CreateBomItems(\'auto_create_costing\')"]'
        ));
        if (!btn1) throw new Error("Create Items button not found");
        btn1.click();
        console.log(`✔ Item created — ${cfg.type} ${cfg.brand}`);

        await sleep(400);

        // 8. Add Item to BOM
        const btn2 = await waitFor(() => document.querySelector(
            'button[ng-click="AddItemsToBom()"]'
        ));
        if (!btn2) throw new Error("Add Items To Bom button not found");
        btn2.click();
        console.log(`✔ Item added to BOM — ${cfg.type} ${cfg.brand}`);

        // Let the UI settle before moving to the next item
        await waitForPageStable({ settleFor: 500 });
        await sleep(1000);
    }

    // ---- Main loop ----
    await sleep(2000); // initial static wait, same as original

    const runStart = Date.now();
    const results = { created: [], skipped: [], failed: [] };

    for (const item of ITEMS) {
        const label = `${item.type} / ${item.brand}`;
        try {
            if (isItemAlreadyInBom(item)) {
                console.log(`⏭ Skipped — already in BOM: ${label}`);
                results.skipped.push(label);
                continue;
            }
            await processItem(item);
            results.created.push(label);
        } catch (err) {
            console.error(`✘ Failed on ${label}:`, err.message);
            results.failed.push(label);
            // continue to next item instead of stopping the whole run
        }
    }

    console.log("\n=== Run summary ===");
    console.log(`Created (${results.created.length}):`, results.created);
    console.log(`Skipped — already in BOM (${results.skipped.length}):`, results.skipped);
    console.log(`Failed (${results.failed.length}):`, results.failed);

    // ---- Completion alert with elapsed time + timestamp ----
    function formatDuration(ms) {
        const totalSec = Math.round(ms / 1000);
        const min = Math.floor(totalSec / 60);
        const sec = totalSec % 60;
        if (min > 0) return `${min}m ${sec}s`;
        return `${sec}s`;
    }

    const elapsedMs = Date.now() - runStart;
    const finishedAt = new Date().toLocaleTimeString();

    alert(
        `✅ BOM Automation complete\n\n` +
        `Duration: ${formatDuration(elapsedMs)}\n\n` +
        `Created: ${results.created.length}\n` +
        (results.failed.length ? `\n\nFailed items:\n- ${results.failed.join("\n- ")}` : "")
    );

})();
