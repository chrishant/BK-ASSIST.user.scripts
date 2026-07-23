const MATERIALS = {
    "RIVER ISLAND": {
        stickers: [
            {
                item_id: 62771,
                item_name: "CARTON STICKER RI"
            },
            {
                item_id: 62770,
                item_name: "POLYBAG STICKER RI"
            },
            {
                item_id: 22813,
                item_name: "BARCODE STICKER RFID RI"
            }
        ],

        labels: [
            {
                item_id: 62541,
                item_name: "MAIN LABEL RI SOME WHERE TO GO GREY"
            },
            {
                item_id: 32570,
                item_name: "SIZE LABEL RI GREY"
            },
            {
                item_id: 11597,
                item_name: "WASH CARE LABEL RI"
            },
            {
                item_id: 68112,
                item_name: "COO LABEL RI"
            }
        ]
    },
    "LOVE & ROSES": {
        stickers: [
            {
                item_id: 62771,
                item_name: "CARTON STICKER LOVE & ROSES"
            },
            {
                item_id: 62770,
                item_name: "POLYBAG STICKER LOVE & ROSES"
            },
            {
                item_id: 22813,
                item_name: "BARCODE STICKER LOVE & ROSES"
            }
        ],

        labels: [
            {
                item_id: 62541,
                item_name: "MAIN LABEL LOVE & ROSES"
            },
            {
                item_id: 32570,
                item_name: "SIZE LABEL LOVE & ROSES"
            },
            {
                item_id: 11597,
                item_name: "WASH CARE LABEL LOVE & ROSES"
            }
        ]
    }
};

(() => {
    // Prevent duplicate injection
    if (document.getElementById("bk-material-btn")) return;

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
    function getMaterialList(type) {
        const scope = getScope("#AsstCtrlMainDiv_input_item");

        const buyer = (scope?.main_model?.buyer_name || "")
            .trim()
            .toUpperCase();

        const buyerKey = Object.keys(MATERIALS).find(key =>
            buyer.includes(key.toUpperCase())
        );

        if (!buyerKey) {
            console.warn("No material configuration found for buyer:", buyer);
            return [];
        }

        return MATERIALS[buyerKey][type] || [];
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
        // stickerBtn.onclick = () => showList("Sticker", getStickerList());
        stickerBtn.onclick = () =>
            showList("Sticker", getMaterialList("stickers"));

        const labelBtn = document.createElement("button");
        labelBtn.className = "btn btn-success btn-block";
        labelBtn.textContent = "🏷 Labels";
        labelBtn.style.marginBottom = "15px";
        labelBtn.onclick = () =>
            showList("Labels", getMaterialList("labels"));
        // labelBtn.onclick = () => showList("Labels", getLabelList());

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
    function showList(title, items) {
        const body = document.createElement("div");
        const missingItems = [];

        items.forEach(requiredItem => {

            const exists = isItemInBom(requiredItem);

            const itemBtn = document.createElement("button");

            itemBtn.className = "btn btn-block";
            itemBtn.style.marginBottom = "8px";

            if (exists) {

                itemBtn.style.background = "#dff0d8";
                itemBtn.style.border = "1px solid #5cb85c";
                itemBtn.style.color = "#3c763d";
                itemBtn.textContent = "✓ " + requiredItem.item_name;

            } else {

                itemBtn.style.background = "#f2dede";
                itemBtn.style.border = "1px solid #d9534f";
                itemBtn.style.color = "#a94442";
                itemBtn.textContent = "✖ " + requiredItem.item_name;

                missingItems.push(requiredItem);
            }

            itemBtn.onclick = () =>
                console.log(requiredItem);

            body.appendChild(itemBtn);

        });

        // Add Proceed button at bottom
        const proceedBtn = document.createElement("button");
        proceedBtn.className = "btn btn-success btn-block";
        proceedBtn.style.marginTop = "15px";
        proceedBtn.innerHTML = "✔ Proceed";

        // Disable if nothing missing
        if (!missingItems.length) {
            proceedBtn.disabled = true;
            proceedBtn.innerHTML = "✔ All Present";
            proceedBtn.style.opacity = 0.65;
        }

        proceedBtn.onclick = () => {
            if (!missingItems.length) return;
            // console.log("Missing items:", missingItems);
            console.table(missingItems);
            openCostingItemPopup();
            closePopup();
            // TODO: add missingItems to BOM here
        };

        // Back button
        const backBtn = document.createElement("button");
        backBtn.className = "btn btn-warning btn-block";
        backBtn.style.marginTop = "8px";
        backBtn.textContent = "← Back";
        backBtn.onclick = showMainPopup;

        body.appendChild(proceedBtn);
        body.appendChild(backBtn);

        // Finally show the popup with the title and body
        createPopup(title, body);
    }


    // Attach main popup to header button
    assistantBtn.onclick = showMainPopup;

    console.log("✅ Material Assistant injected.");
})();

