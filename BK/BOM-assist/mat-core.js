// ============================================================
// BK MATERIAL ASSISTANT
// CORE
// ============================================================

(() => {

    const MATERIALS_URL =
        "https://raw.githubusercontent.com/chrishant/BK-ASSIST.user.scripts/main/BK/BOM-assist/store/items/mat.json";


    const AUTOMATION_SCRIPT_URLS = {

        STICKER:
            "https://raw.githubusercontent.com/chrishant/BK-ASSIST.user.scripts/main/BK/BOM-assist/engine/assist-engine-sticker.js",

        LABEL:
            "https://raw.githubusercontent.com/chrishant/BK-ASSIST.user.scripts/main/BK/BOM-assist/engine/assist-engine-label.js"
    };


    const DEFAULT_EXCESS = 5;


    let MATERIALS = null;


    // ========================================================
    // INTERNAL
    // ========================================================

    function cacheBust(url) {

        const separator =
            url.includes("?")
                ? "&"
                : "?";

        return `${url}${separator}_=${Date.now()}`;
    }


    function getScope(selector) {

        const element =
            document.querySelector(
                selector
            );


        return element
            ? angular.element(element).scope()
            : null;
    }


    function getMainScope() {

        return getScope(
            "#AsstCtrlMainDiv_input_item"
        );
    }


    function normalize(value) {

        return (value || "")
            .trim()
            .replace(/\s+/g, " ")
            .toUpperCase();
    }


    // ========================================================
    // MATERIAL DATA
    // ========================================================

    async function loadMaterials() {

        const response =
            await fetch(
                cacheBust(
                    MATERIALS_URL
                ),
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Materials HTTP ${response.status}`
            );
        }


        MATERIALS =
            await response.json();


        return MATERIALS;
    }


    // ========================================================
    // BUYER
    // ========================================================

    function getBuyerName() {

        return (
            getMainScope()
                ?.main_model
                ?.buyer_name ||
            ""
        ).trim();
    }


    function getBuyerKey() {

        if (!MATERIALS) {
            return null;
        }


        const buyer =
            normalize(
                getBuyerName()
            );


        return Object.keys(MATERIALS)
            .sort(
                (a, b) =>
                    b.length - a.length
            )
            .find(
                key =>
                    buyer.includes(
                        normalize(key)
                    )
            ) || null;
    }


    function getBuyerConfig() {

        const key =
            getBuyerKey();


        return key
            ? MATERIALS[key]
            : null;
    }


    function getBuyerBrand() {

        return (
            getBuyerConfig()
                ?.brand ||
            null
        );
    }


    // ========================================================
    // MATERIALS
    // ========================================================

    function getMaterialList(type) {

        return (
            getBuyerConfig()
                ?.[type] ||
            []
        );
    }


    function getBuyerColors() {

        return (
            getBuyerConfig()
                ?.colors ||
            []
        );
    }


    function resolveItem(
        rawItem,
        selectedColor
    ) {

        if (!rawItem.needsColor) {

            return {
                ...rawItem
            };
        }


        if (!selectedColor) {
            return null;
        }


        const variant =
            (rawItem.variants || [])
                .find(
                    item =>
                        normalize(item.color) ===
                        normalize(selectedColor)
                );


        if (!variant) {
            return null;
        }


        return {

            item_id:
                variant.item_id,

            item_name:
                variant.item_name,

            type:
                rawItem.type,

            rate:
                variant.rate,

            color:
                variant.color,

            excess:
                variant.excess ??
                rawItem.excess
        };
    }


    function collectAvailableColors(
        items
    ) {

        const colors =
            new Set();


        items.forEach(
            item => {

                if (!item.needsColor) {
                    return;
                }


                (item.variants || [])
                    .forEach(
                        variant =>
                            colors.add(
                                variant.color
                            )
                    );
            }
        );


        return [...colors];
    }


    // ========================================================
    // BOM
    // ========================================================

    function getBomItems() {

        return (
            getMainScope()
                ?.so_component_items_list ||
            []
        );
    }


    function isItemInBom(
        requiredItem
    ) {

        return getBomItems()
            .some(
                item =>

                    item.item_id ===
                    requiredItem.item_id ||

                    normalize(
                        item.item_name
                    ) ===
                    normalize(
                        requiredItem.item_name
                    )
            );
    }


    function getBomStatus(items) {

        return items.map(
            item => ({

                item,

                present:
                    isItemInBom(
                        item
                    )
            })
        );
    }


    // ========================================================
    // AUTOMATION
    // ========================================================

    async function runAutomation(
        category,
        payload
    ) {

        if (
            !AUTOMATION_SCRIPT_URLS[
                category
            ]
        ) {

            throw new Error(
                `Automation not configured: ${category}`
            );
        }


        window.bkPendingBomItems =
            payload;


        window.dispatchEvent(
            new CustomEvent(
                "bk:missing-items-ready",
                {
                    detail: payload
                }
            )
        );


        const scriptUrl =
            AUTOMATION_SCRIPT_URLS[
                category
            ];


        const response =
            await fetch(
                cacheBust(
                    scriptUrl
                ),
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Automation HTTP ${response.status}`
            );
        }


        const code =
            await response.text();


        (0, eval)(code);


        return {
            category,
            count:
                payload.length
        };
    }


    // ========================================================
    // PUBLIC API
    // ========================================================

    const API = {

        version:
            "1.0.0",


        async init() {

            if (!MATERIALS) {

                await loadMaterials();
            }


            return API;
        },


        isReady() {

            return (
                MATERIALS !== null
            );
        },


        getBuyerName,

        getBuyerKey,

        getBuyerConfig,

        getBuyerBrand,

        getMaterialList,

        getBuyerColors,

        resolveItem,

        collectAvailableColors,

        getBomItems,

        isItemInBom,

        getBomStatus,

        runAutomation
    };


    window.BKMaterialAssistant =
        API;


    console.log(
        "🧠 BK Material Assistant Core loaded."
    );

})();
