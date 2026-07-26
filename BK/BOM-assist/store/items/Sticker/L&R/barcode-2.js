(async () => {

    const TYPE = "BARCODE STICKER";
    const BRAND = "LOVE & ROSES";
    const RATE = 4.3;

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

    // Types a query into a given search input, waits for the
    // filtered dropdown popup to render, then clicks the matching
    // item — goes through the real UI flow instead of setting
    // option() directly, so DevExtreme's own handlers fire.
    async function typeAndClickListItem(input, query) {
        input.focus();
        input.value = query;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        await waitForPageStable({ settleFor: 250 });

        await waitForClick(() => {
            const items = document.querySelectorAll(".dx-list-item");
            return [...items].find(li =>
                li.textContent.trim().toUpperCase() === query.toUpperCase()
            ) || null;
        });
    }

    async function typeIntoInput(input, text) {
        input.focus();
        input.value = "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        for (const char of text) {
            input.value += char;
            input.dispatchEvent(new KeyboardEvent("keydown", { key: char, bubbles: true }));
            input.dispatchEvent(new InputEvent("input", { data: char, inputType: "insertText", bubbles: true }));
            input.dispatchEvent(new KeyboardEvent("keyup", { key: char, bubbles: true }));
            await sleep(80);
        }
        input.dispatchEvent(new Event("change", { bubbles: true }));
    }

    function unwrapEl(el) {
        return el && el.jquery ? el[0] : el;
    }

    // 0. Initial static wait
    await sleep(2000);

    // 1. Filter Summary = STICKER
    const filter = await waitFor(() =>
        document.querySelectorAll("#grid_ItemCostingDetail .dx-datagrid-filter-row input")[1]
    );
    filter.focus();
    filter.value = "STICKER";
    filter.dispatchEvent(new Event("input", { bubbles: true }));
    filter.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", bubbles: true }));
    await sleep(400);
    await waitForPageStable({ settleFor: 400 });

    // 2. Click first STICKER row
    await waitForClick(() => {
        const row = document.querySelector("#grid_ItemCostingDetail .dx-data-row");
        if (!row || !row.textContent.toUpperCase().includes("STICKER")) return null;
        return row.querySelector("td:nth-child(3)");
    });

    // 3. Select TYPE — plain awaited action, not a waitFor predicate
    await sleep(1400);
    // const typeBox = $("#gridContainer_Detail .dx-selectbox").eq(0).dxSelectBox("instance");
    // const typeData = await typeBox.getDataSource().load();
    // typeBox.option("value", typeData.find(x => x.value === TYPE).value);
    const typeBox = $("#gridContainer_Detail .dx-selectbox")
        .eq(0)
        .dxSelectBox("instance");

    const typeData = await typeBox.getDataSource().load();
    typeBox.option("value", typeData.find(x => x.value === TYPE).value);

    await sleep(800);
    // 4. Select BRAND — same direct, reliable approach as TYPE.
    // 4. Select BRAND

    const brand = $("#gridContainer_Detail .dx-selectbox")
        .eq(1)
        .dxSelectBox("instance");

    const input = brand.element().find("input.dx-texteditor-input")[0];

    input.focus();
    input.value = "";

    for (const ch of BRAND) {

        input.dispatchEvent(new KeyboardEvent("keydown", {
            key: ch,
            bubbles: true
        }));

        input.value += ch;

        input.dispatchEvent(new InputEvent("input", {
            bubbles: true,
            data: ch,
            inputType: "insertText"
        }));

        input.dispatchEvent(new KeyboardEvent("keyup", {
            key: ch,
            bubbles: true
        }));

        await sleep(120);
    }

    // Wait until BRAND appears
    let item = null;

    for (let i = 0; i < 50; i++) {

        item = [...document.querySelectorAll(".dx-list-item")]
            .find(x => x.innerText.trim().toUpperCase() === BRAND.toUpperCase());

        if (item) break;

        await sleep(100);
    }

    if (!item) {
        throw new Error(`Brand "${BRAND}" never appeared.`);
    }

    await simulateClick(item);

    await waitForPageStable();


    // 5. Excess %
    const excessInput = await waitFor(() => document.querySelector('input[ng-model="excess_per"]'));

    excessInput.focus();

    const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
    ).set;

    setter.call(excessInput, 5);

    excessInput.dispatchEvent(new Event("input", { bubbles: true }));
    excessInput.dispatchEvent(new Event("change", { bubbles: true }));
    excessInput.dispatchEvent(new Event("blur", { bubbles: true }));
    console.log("✔ Excess Setelled");

    // 6. Budget Rate
    const budgetInput = await waitFor(() => document.querySelector('input[ng-model="budgeted_rate"]'));

    budgetInput.focus();

    budgetInput.value = RATE;

    budgetInput.dispatchEvent(new Event("input", { bubbles: true }));
    budgetInput.dispatchEvent(new Event("change", { bubbles: true }));
    budgetInput.dispatchEvent(new Event("blur", { bubbles: true }));
    console.log("✔ Rate Setelled");

    // 7. Create Item
    const btn1 = await waitFor(() => document.querySelector(
        'button[ng-click="CreateBomItems(\'auto_create_costing\')"]'
    ));

    if (!btn1) throw new Error("Create Items button not found");

    btn1.click();
    console.log("✔ Item Ready — BARCODE STICKER LOVE & ROSES");

    await sleep(200);

    //8. Add Item to BOM
    const btn2 = await waitFor(() => document.querySelector(
        'button[ng-click="AddItemsToBom()"]'
    ));

    if (!btn2)
        throw new Error("Add Items To Bom button not found");

    btn2.click();
    console.log("✔ Item Added — BARCODE STICKER LOVE & ROSES");

})();
