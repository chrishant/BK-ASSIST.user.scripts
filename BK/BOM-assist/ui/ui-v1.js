// ============================================================
// BK MATERIAL ASSISTANT
// UI V3
// ============================================================

(async () => {

    const CORE_URL =
        "https://raw.githubusercontent.com/chrishant/BK-ASSIST.user.scripts/refs/heads/main/BK/BOM-assist/mat-core.js";


    function cacheBust(url) {

        const separator =
            url.includes("?")
                ? "&"
                : "?";

        return `${url}${separator}_=${Date.now()}`;
    }


    async function loadCore() {

        const response =
            await fetch(
                cacheBust(CORE_URL),
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Core HTTP ${response.status}`
            );
        }


        const code =
            await response.text();


        (0, eval)(code);
    }


    try {

        // ----------------------------------------------------
        // CORE
        // ----------------------------------------------------

        await loadCore();


        const BK =
            window.BKMaterialAssistant;


        if (!BK) {

            throw new Error(
                "Material Assistant core API was not initialized."
            );
        }


        await BK.init();


        // ----------------------------------------------------
        // UI
        // ----------------------------------------------------

        console.log(
            "🎨 Material Assistant UI V3 starting..."
        );


        /*
         * Your complete UI implementation goes here.
         *
         * The UI talks ONLY to:
         *
         *     window.BKMaterialAssistant
         *
         * It should not contain material-resolution logic,
         * BOM logic, buyer logic, or engine-loading logic.
         */


        console.log(
            "✅ Material Assistant UI V3 ready."
        );


    } catch (error) {

        console.error(
            "❌ Material Assistant UI V3 failed:",
            error
        );


        alert(
            "Material Assistant UI V3 failed.\n\n" +
            error.message
        );
    }

})();
