// ============================================================
// BK MATERIAL ASSISTANT  ·  UI / UX (no business logic here)
// DOM, popups, toasts, interactions. Styles: ui/assist-theme.js
// Exposes window.BKAssist.mountUI(core)
// ============================================================
(function () {
    const BK = (window.BKAssist = window.BKAssist || {});

    BK.mountUI = function mountUI(core) {

    const {
        getBuyerBrand,
        getMaterialList,
        collectAvailableColors,
        evaluateItems,
        buildPayload,
        runAutomation,
        normalize
    } = core;


    // ========================================================
    // ICONS
    // ========================================================

    const ICONS = {

        sticker:
            '<path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/>' +
            '<path d="M15 3v6h6"/>' +
            '<path d="M8.5 13h.01"/>' +
            '<path d="M15.5 13h.01"/>' +
            '<path d="M9.5 16.5s.9 1 2.5 1 2.5-1 2.5-1"/>',

        label:
            '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/>' +
            '<circle cx="7.5" cy="7.5" r=".6" fill="currentColor"/>',

        check:
            '<path d="M20 6 9 17l-5-5"/>',

        x:
            '<path d="M18 6 6 18M6 6l12 12"/>',

        chevronLeft:
            '<path d="m15 18-6-6 6-6"/>',

        search:
            '<circle cx="11" cy="11" r="7"/>' +
            '<path d="m21 21-4.3-4.3"/>',

        dots:
            '<circle cx="12" cy="12" r="1"/>' +
            '<circle cx="19" cy="12" r="1"/>' +
            '<circle cx="5" cy="12" r="1"/>',

        bang:
            '<path d="M12 6v7"/>' +
            '<path d="M12 17h.01"/>'
    };


    function icon(name, size = 16) {

        const s =
            document.createElement("span");

        s.className = "ico";

        s.innerHTML =
            `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor"` +
            ` stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">` +
            `${ICONS[name] || ""}</svg>`;

        return s;
    }


    function el(tag, cls, text) {

        const n =
            document.createElement(tag);

        if (cls) {
            n.className = cls;
        }

        if (text != null) {
            n.textContent = text;
        }

        return n;
    }


    // ========================================================
    // THEME
    // ========================================================

    const THEME_CSS = BK.THEME_CSS;


    // ========================================================
    // LAUNCHER BUTTON STYLE
    // ========================================================

    if (!document.getElementById("bk-icloud-launch-style")) {

        const ls = document.createElement("style");

        ls.id = "bk-icloud-launch-style";

        ls.textContent = BK.LAUNCHER_CSS;

        document.head.appendChild(ls);
    }


    // ========================================================
    // HEADER BUTTON
    // ========================================================

    const headerUL =
        document.querySelector(
            "#AsstCtrlMainDiv_input_item > div.panel-heading > ul"
        );

    if (!headerUL) {

        console.error(
            "Header UL not found."
        );

        return;
    }


    const li =
        document.createElement("li");

    li.style.float =
        "right";

    li.style.marginLeft =
        "8px";


    const assistantBtn =
        document.createElement("button");

    assistantBtn.id =
        "bk-material-btn";

    assistantBtn.className =
        "bk-ic-launch";

    assistantBtn.textContent =
        "📋 Material Assistant";


    li.appendChild(
        assistantBtn
    );

    headerUL.appendChild(
        li
    );


    // ========================================================
    // SHADOW DOM OVERLAY
    // ========================================================

    const overlay =
        document.createElement("div");

    overlay.id =
        "bk-material-overlay";


    Object.assign(
        overlay.style,
        {
            position: "fixed",
            inset: "0",
            zIndex: 999999,
            pointerEvents: "none"
        }
    );


    document.body.appendChild(
        overlay
    );


    const shadow =
        overlay.attachShadow({
            mode: "open"
        });


    shadow.innerHTML =

        `<style>${THEME_CSS}</style>` +

        `<div class="backdrop">` +

            `<div class="box"
                role="dialog"
                aria-modal="true"
                aria-labelledby="bk-title"
                tabindex="-1">` +

                `<div class="view"></div>` +

            `</div>` +

        `</div>` +

        `<div
            class="toast-wrap"
            aria-live="polite">
        </div>`;


    const backdrop =
        shadow.querySelector(
            ".backdrop"
        );

    const box =
        shadow.querySelector(
            ".box"
        );

    const toastWrap =
        shadow.querySelector(
            ".toast-wrap"
        );


    let isOpen =
        false;

    let lastFocus =
        null;

    let morphTimer =
        null;


    // ========================================================
    // CLOSE
    // ========================================================

    function closePopup() {

        isOpen =
            false;

        backdrop.classList.remove(
            "open"
        );
    }


    function dismiss() {

        closePopup();

        if (
            lastFocus &&
            lastFocus.focus
        ) {

            lastFocus.focus({
                preventScroll: true
            });
        }
    }


    backdrop.addEventListener(
        "click",
        e => {

            if (
                e.target === backdrop
            ) {

                dismiss();
            }
        }
    );


    document.addEventListener(
        "keydown",
        e => {

            if (
                e.key === "Escape" &&
                isOpen
            ) {

                dismiss();
            }
        }
    );


    // ========================================================
    // KEYBOARD CONTROL
    // ========================================================

    shadow.addEventListener(
        "keydown",
        e => {

            e.stopPropagation();


            if (e.key === "Escape") {

                dismiss();

                return;
            }


            if (e.key === "Tab") {

                const f = [
                    ...box.querySelectorAll(
                        "button:not(:disabled), input, select"
                    )
                ]
                    .filter(
                        n =>
                            !n.hidden &&
                            n.offsetParent !== null
                    );


                if (!f.length) {
                    return;
                }


                const active =
                    shadow.activeElement;


                if (
                    e.shiftKey &&
                    (
                        active === f[0] ||
                        active === box
                    )
                ) {

                    e.preventDefault();

                    f[f.length - 1].focus();

                } else if (
                    !e.shiftKey &&
                    active === f[f.length - 1]
                ) {

                    e.preventDefault();

                    f[0].focus();
                }

                return;
            }


            if (
                e.key === "ArrowDown" ||
                e.key === "ArrowUp"
            ) {

                const rows = [
                    ...box.querySelectorAll(
                        ".row:not([hidden]):not(:disabled), .tile"
                    )
                ];


                if (!rows.length) {
                    return;
                }


                const active =
                    shadow.activeElement;

                const i =
                    rows.indexOf(active);


                const inSearch =
                    active &&
                    active.tagName === "INPUT";


                if (
                    i === -1 &&
                    !inSearch
                ) {
                    return;
                }


                e.preventDefault();


                const next =
                    e.key === "ArrowDown"
                        ? rows[(i + 1) % rows.length]
                        : rows[
                            (i - 1 + rows.length) %
                            rows.length
                        ];


                if (
                    inSearch &&
                    e.key === "ArrowDown"
                ) {

                    rows[0].focus();

                } else if (!inSearch) {

                    next.focus();
                }
            }
        }
    );


    ["keyup", "keypress"].forEach(
        type => {

            shadow.addEventListener(
                type,
                e => e.stopPropagation()
            );
        }
    );


    // ========================================================
    // TOAST
    // ========================================================

    function showToast(
        msg,
        kind = "success"
    ) {

        const t =
            el("div", "toast");


        const ic =
            el("span", "ti");


        const tx =
            el("span", "");


        t.appendChild(ic);

        t.appendChild(tx);

        toastWrap.appendChild(t);


        let timer = null;


        function dismissToast() {

            t.classList.remove(
                "in"
            );

            setTimeout(
                () => t.remove(),
                450
            );
        }


        function set(m, k) {

            const wasVisible =
                t.classList.contains("in");


            t.className =
                "toast " +
                k +
                (
                    wasVisible
                        ? " in"
                        : ""
                );


            ic.textContent =
                "";


            if (k === "loading") {

                ic.appendChild(
                    el("span", "spin")
                );

            } else {

                ic.appendChild(
                    icon(
                        k === "error"
                            ? "bang"
                            : "check",
                        13
                    )
                );
            }


            tx.textContent =
                m;


            clearTimeout(
                timer
            );


            if (
                k !== "loading"
            ) {

                timer =
                    setTimeout(
                        dismissToast,
                        k === "error"
                            ? 4800
                            : 3200
                    );
            }
        }


        set(
            msg,
            kind
        );


        requestAnimationFrame(
            () => {

                requestAnimationFrame(
                    () => {

                        t.classList.add(
                            "in"
                        );
                    }
                );
            }
        );


        return {
            update: set
        };
    }


    // ========================================================
    // POPUP SHELL
    // ========================================================

    function createPopup(
        title,
        body,
        opts = {}
    ) {

        const {
            subtitle,
            mode = "open",
            onBack,
            backLabel
        } = opts;


        const wasOpen =
            isOpen;


        const oldView =
            box.querySelector(
                ".view"
            );


        const keepScroll =
            box.scrollTop;


        const view =
            el(
                "div",
                "view"
            );


        if (mode !== "none") {

            view.classList.add(
                "stagger"
            );
        }


        if (
            wasOpen &&
            mode === "push"
        ) {

            view.classList.add(
                "enter-push"
            );
        }


        if (
            wasOpen &&
            mode === "pop"
        ) {

            view.classList.add(
                "enter-pop"
            );
        }


        // ----------------------------------------------------
        // HEADER
        // ----------------------------------------------------

        const head =
            el(
                "div",
                "head"
            );


        const left =
            el(
                "div",
                "l"
            );


        if (onBack) {

            const b =
                el(
                    "button",
                    "navbtn"
                );


            b.appendChild(
                icon(
                    "chevronLeft",
                    20
                )
            );


            b.appendChild(
                document.createTextNode(
                    backLabel || "Back"
                )
            );


            b.onclick =
                onBack;


            left.appendChild(
                b
            );
        }


        const mid =
            el(
                "div",
                "mid"
            );


        const t =
            el(
                "div",
                "title",
                title
            );


        t.id =
            "bk-title";


        mid.appendChild(
            t
        );


        if (subtitle) {

            mid.appendChild(
                el(
                    "div",
                    "sub",
                    subtitle
                )
            );
        }


        const right =
            el(
                "div",
                "r"
            );


        const x =
            el(
                "button",
                "x"
            );


        x.setAttribute(
            "aria-label",
            "Close"
        );


        x.appendChild(
            icon(
                "x",
                14
            )
        );


        x.onclick =
            dismiss;


        right.appendChild(
            x
        );


        head.appendChild(
            left
        );

        head.appendChild(
            mid
        );

        head.appendChild(
            right
        );


        view.appendChild(
            head
        );


        view.appendChild(
            body
        );


        // ----------------------------------------------------
        // SWAP
        // ----------------------------------------------------

        if (wasOpen) {

            const h0 =
                box.offsetHeight;


            box.style.height =
                h0 + "px";


            oldView.replaceWith(
                view
            );


            box.style.height =
                "auto";


            const h1 =
                box.offsetHeight;


            box.style.height =
                h0 + "px";


            void box.offsetHeight;


            box.style.height =
                h1 + "px";


            clearTimeout(
                morphTimer
            );


            morphTimer =
                setTimeout(
                    () => {

                        box.style.height =
                            "";
                    },
                    420
                );


            if (
                mode === "none"
            ) {

                box.scrollTop =
                    keepScroll;
            }

        } else {

            oldView.replaceWith(
                view
            );


            clearTimeout(
                morphTimer
            );


            box.style.height =
                "";


            box.scrollTop =
                0;


            isOpen =
                true;


            lastFocus =
                document.activeElement;


            requestAnimationFrame(
                () => {

                    backdrop.classList.add(
                        "open"
                    );


                    box.focus({
                        preventScroll:
                            true
                    });
                }
            );
        }
    }


    // ========================================================
    // HOME
    // ========================================================

    function showMainPopup() {

        const body =
            el(
                "div",
                "stagger"
            );


        const welcome =
            el(
                "div",
                "welcome st"
            );

        welcome.style.setProperty(
            "--i",
            "0"
        );


        welcome.appendChild(
            el(
                "div",
                "welcome-title",
                "Choose material category"
            )
        );


        welcome.appendChild(
            el(
                "div",
                "welcome-sub",
                getBuyerBrand()
                    ? `Buyer: ${getBuyerBrand()}`
                    : "BOM material assistant"
            )
        );


        body.appendChild(
            welcome
        );


        const tiles =
            el(
                "div",
                "tiles"
            );


        // ----------------------------------------------------
        // STICKER
        // ----------------------------------------------------

        const stickerTile =
            el(
                "button",
                "tile st"
            );


        stickerTile.style.setProperty(
            "--i",
            "1"
        );


        const stickerIcon =
            el(
                "div",
                "appicon sticker"
            );


        stickerIcon.appendChild(
            icon(
                "sticker",
                32
            )
        );


        stickerTile.appendChild(
            stickerIcon
        );


        stickerTile.appendChild(
            el(
                "div",
                "tile-name",
                "Sticker"
            )
        );


        stickerTile.appendChild(
            el(
                "div",
                "tile-meta",
                "Sticker materials"
            )
        );


        stickerTile.onclick =
            () => {

                showList(
                    "Sticker",
                    getMaterialList(
                        "stickers"
                    ),
                    "STICKER"
                );
            };


        // ----------------------------------------------------
        // LABEL
        // ----------------------------------------------------

        const labelTile =
            el(
                "button",
                "tile st"
            );


        labelTile.style.setProperty(
            "--i",
            "2"
        );


        const labelIcon =
            el(
                "div",
                "appicon label"
            );


        labelIcon.appendChild(
            icon(
                "label",
                32
            )
        );


        labelTile.appendChild(
            labelIcon
        );


        labelTile.appendChild(
            el(
                "div",
                "tile-name",
                "Labels"
            )
        );


        labelTile.appendChild(
            el(
                "div",
                "tile-meta",
                "Label materials"
            )
        );


        labelTile.onclick =
            () => {

                showList(
                    "Labels",
                    getMaterialList(
                        "labels"
                    ),
                    "LABEL"
                );
            };


        tiles.appendChild(
            stickerTile
        );

        tiles.appendChild(
            labelTile
        );


        body.appendChild(
            tiles
        );


        body.appendChild(
            el(
                "div",
                "hint st",
                "Select a category to check your BOM"
            )
        );


        createPopup(
            "Material Assistant",
            body,
            {
                subtitle:
                    "BOM Material Manager"
            }
        );
    }


    // ========================================================
    // MATERIAL ROW
    // ========================================================

    function createMaterialRow(
        item,
        state,
        index
    ) {

        const row =
            el(
                "button",
                `row ${state} st`
            );


        row.style.setProperty(
            "--i",
            index
        );


        const dot =
            el(
                "span",
                "dot"
            );


        if (state === "ok") {

            dot.appendChild(
                icon(
                    "check",
                    14
                )
            );

        } else if (
            state === "missing"
        ) {

            dot.appendChild(
                icon(
                    "x",
                    14
                )
            );

        } else {

            dot.appendChild(
                icon(
                    "bang",
                    14
                )
            );
        }


        const name =
            el(
                "span",
                "name",
                item.item_name ||
                item.type ||
                "Material"
            );


        const tagText =
            state === "ok"
                ? "Added"
                : state === "missing"
                    ? "Missing"
                    : "Select color";


        const tag =
            el(
                "span",
                "tag",
                tagText
            );


        row.appendChild(
            dot
        );

        row.appendChild(
            name
        );

        row.appendChild(
            tag
        );


        return row;
    }


    // ========================================================
    // MATERIAL LIST
    // ========================================================

    function showList(
        title,
        items,
        category
    ) {

        const anyNeedsColor =
            items.some(
                item =>
                    item.needsColor
            );


        let selectedColor =
            null;


        function render() {

            const body =
                el(
                    "div",
                    "stagger"
                );





            // ------------------------------------------------
            // COLOR
            // ------------------------------------------------

            if (anyNeedsColor) {

                const colors =
                    collectAvailableColors(
                        items
                    );


                const field =
                    el(
                        "div",
                        "field st"
                    );


                field.style.setProperty(
                    "--i",
                    "0"
                );


                field.appendChild(
                    el(
                        "div",
                        "field-label",
                        "COLOR"
                    )
                );


                const chips =
                    el(
                        "div",
                        "chips"
                    );


                colors.forEach(
                    (color, index) => {

                        const chip =
                            el(
                                "button",
                                "chip"
                            );


                        chip.style.setProperty(
                            "--i",
                            index
                        );


                        chip.setAttribute(
                            "aria-checked",
                            selectedColor === color
                                ? "true"
                                : "false"
                        );


                        const sw =
                            el(
                                "span",
                                "sw"
                            );


                        chip.appendChild(
                            sw
                        );


                        chip.appendChild(
                            document.createTextNode(
                                color
                            )
                        );


                        chip.onclick =
                            () => {

                                selectedColor =
                                    color;

                                render();
                            };


                        chips.appendChild(
                            chip
                        );
                    }
                );


                if (!colors.length) {

                    field.appendChild(
                        el(
                            "div",
                            "note",
                            "No colors configured for this buyer."
                        )
                    );

                } else {

                    field.appendChild(
                        chips
                    );
                }


                body.appendChild(
                    field
                );
            }


            // ------------------------------------------------
            // RESOLVE ITEMS  (logic lives in core)
            // ------------------------------------------------

            const {
                entries: resolvedItems,
                missingItems,
                hasPending
            } = evaluateItems(items, selectedColor);


            // ------------------------------------------------
            // SUMMARY
            // ------------------------------------------------

            const total =
                items.length;


            const pendingCount =
                resolvedItems.filter(
                    x =>
                        x.state === "pending"
                ).length;


            const presentCount =
                resolvedItems.filter(
                    x =>
                        x.state === "ok"
                ).length;


            const missingCount =
                resolvedItems.filter(
                    x =>
                        x.state === "missing"
                ).length;


            const summary =
                el(
                    "div",
                    "summary st"
                );


            summary.style.setProperty(
                "--i",
                "1"
            );


            const sumTop =
                el(
                    "div",
                    "sum-top"
                );


            const summaryLeft =
                el(
                    "span",
                    "",
                    "BOM status"
                );


            const summaryRight =
                el(
                    "b",
                    "",
                    `${presentCount} / ${total}`
                );


            sumTop.appendChild(
                summaryLeft
            );

            sumTop.appendChild(
                summaryRight
            );


            summary.appendChild(
                sumTop
            );


            const bar =
                el(
                    "div",
                    "bar"
                );


            const progress =
                total
                    ? Math.round(
                        (
                            presentCount /
                            total
                        ) * 100
                    )
                    : 0;


            const fill =
                el(
                    "i"
                );


            fill.style.width =
                `${progress}%`;


            bar.appendChild(
                fill
            );


            summary.appendChild(
                bar
            );


            body.appendChild(
                summary
            );


            // ------------------------------------------------
            // SEARCH
            // ------------------------------------------------

            if (items.length >= 5) {

                const search =
                    el(
                        "div",
                        "search st"
                    );


                search.style.setProperty(
                    "--i",
                    "2"
                );


                search.appendChild(
                    icon(
                        "search",
                        16
                    )
                );


                const input =
                    document.createElement(
                        "input"
                    );


                input.type =
                    "search";

                input.placeholder =
                    "Search materials...";

                input.autocomplete =
                    "off";


                search.appendChild(
                    input
                );


                body.appendChild(
                    search
                );


                input.addEventListener(
                    "input",
                    () => {

                        const query =
                            normalize(
                                input.value
                            );


                        body
                            .querySelectorAll(
                                ".row"
                            )
                            .forEach(
                                row => {

                                    const name =
                                        normalize(
                                            row
                                                .querySelector(
                                                    ".name"
                                                )
                                                ?.textContent
                                        );


                                    row.hidden =
                                        query &&
                                        !name.includes(
                                            query
                                        );
                                }
                            );
                    }
                );
            }


            // ------------------------------------------------
            // MATERIAL LIST
            // ------------------------------------------------

            const list =
                el(
                    "div",
                    "list st"
                );


            list.style.setProperty(
                "--i",
                "3"
            );


            if (!items.length) {

                const empty =
                    el(
                        "div",
                        "empty"
                    );


                empty.appendChild(
                    icon(
                        "dots",
                        24
                    )
                );


                empty.appendChild(
                    document.createTextNode(
                        "No materials configured for this category."
                    )
                );


                list.appendChild(
                    empty
                );

            } else {

                resolvedItems.forEach(
                    (entry, index) => {

                        if (
                            entry.state ===
                            "pending"
                        ) {

                            const pendingItem = {
                                item_name:
                                    entry.raw.type
                                        ? `${entry.raw.type} requires a color`
                                        : "Select a color"
                            };


                            const row =
                                createMaterialRow(
                                    pendingItem,
                                    "pending",
                                    index
                                );


                            row.disabled =
                                true;


                            list.appendChild(
                                row
                            );


                            return;
                        }


                        list.appendChild(
                            createMaterialRow(
                                entry.resolved,
                                entry.state,
                                index
                            )
                        );
                    }
                );
            }


            body.appendChild(
                list
            );


            // ------------------------------------------------
            // ACTION AREA
            // ------------------------------------------------

            const actions =
                el(
                    "div",
                    "actions"
                );


            const proceed =
                el(
                    "button",
                    "btn primary st"
                );


            proceed.style.setProperty(
                "--i",
                "4"
            );


            if (hasPending) {

                proceed.disabled =
                    true;

                proceed.appendChild(
                    icon(
                        "bang",
                        16
                    )
                );

                proceed.appendChild(
                    document.createTextNode(
                        " Select a Color First"
                    )
                );

            } else if (
                !missingCount
            ) {

                proceed.disabled =
                    true;

                proceed.classList.add(
                    "done"
                );

                proceed.appendChild(
                    icon(
                        "check",
                        16
                    )
                );

                proceed.appendChild(
                    document.createTextNode(
                        " All Materials Present"
                    )
                );

            } else {

                proceed.appendChild(
                    icon(
                        "check",
                        16
                    )
                );

                proceed.appendChild(
                    document.createTextNode(
                        ` Add ${missingCount} ` +
                        (
                            category === "STICKER"
                                ? "Sticker"
                                : "Label"
                        ) +
                        (
                            missingCount === 1
                                ? ""
                                : "s"
                        )
                    )
                );
            }


            proceed.onclick =
                async () => {

                    if (
                        hasPending ||
                        !missingItems.length
                    ) {
                        return;
                    }


                    const built =
                        buildPayload(
                            category,
                            missingItems
                        );


                    if (!built.ok) {

                        showToast(
                            built.error,
                            "error"
                        );

                        return;
                    }


                    const payload =
                        built.payload;


                    proceed.disabled =
                        true;


                    proceed.innerHTML =
                        "";


                    proceed.appendChild(
                        el(
                            "span",
                            "spin"
                        )
                    );


                    proceed.appendChild(
                        document.createTextNode(
                            " Starting..."
                        )
                    );


                    await runAutomation(
                        category,
                        payload,
                        {
                            closePopup,
                            showToast
                        }
                    );
                };


            actions.appendChild(
                proceed
            );


            body.appendChild(
                actions
            );


            createPopup(
                title,
                body,
                {
                    subtitle:
                        `${presentCount} present · ` +
                        `${missingCount} missing` +
                        (
                            pendingCount
                                ? ` · ${pendingCount} waiting`
                                : ""
                        ),

                    mode:
                        "push",

                    onBack:
                        showMainPopup,

                    backLabel:
                        "Back"
                }
            );
        }


        render();
    }




    // ========================================================
    // LAUNCH
    // ========================================================

    assistantBtn.onclick =
        showMainPopup;


    console.log(
        "✅ Material Assistant injected with modern UI."
    );

    };
})();
