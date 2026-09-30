// ============================================================
// BK MATERIAL ASSISTANT
// UI V2
//
// This file contains ONLY the UI.
// Core functionality is provided by:
//
// window.BKMaterialAssistant
//
// Expected Core API:
//
// - getBuyerBrand()
// - getMaterialList(type)
// - collectAvailableColors(items)
// - resolveItem(item, color)
// - isItemInBom(item)
// - runAutomation(category, payload)
// - showToast(message, type)
// - registerUI(config)
//
// ============================================================

(() => {

    "use strict";


    // ========================================================
    // CORE
    // ========================================================

    const CORE =
        window.BKMaterialAssistant;


    if (!CORE) {

        console.error(
            "BK Material Assistant UI v2: Core not found."
        );

        return;
    }


    // ========================================================
    // CONFIG
    // ========================================================

    const UI_VERSION =
        "v2";


    const ROOT_ID =
        "bk-material-ui-v2";


    const LAUNCHER_ID =
        "bk-material-btn";


    // ========================================================
    // PREVENT DUPLICATE UI
    // ========================================================

    if (
        document.getElementById(ROOT_ID)
    ) {

        console.warn(
            "BK Material Assistant UI v2 already mounted."
        );

        return;
    }


    // ========================================================
    // ICONS
    // ========================================================

    const ICONS = {

        clipboard:
            `
            <rect x="5" y="4" width="14" height="17" rx="2"/>
            <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/>
            <path d="M8 9h8"/>
            <path d="M8 13h6"/>
            <path d="M8 17h4"/>
            `,

        sticker:
            `
            <path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/>
            <path d="M15 3v6h6"/>
            <path d="M8.5 13h.01"/>
            <path d="M15.5 13h.01"/>
            <path d="M9.5 16.5s.9 1 2.5 1 2.5-1 2.5-1"/>
            `,

        label:
            `
            <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/>
            <circle cx="7.5" cy="7.5" r=".7"/>
            `,

        check:
            `
            <path d="m5 12 4 4L19 6"/>
            `,

        x:
            `
            <path d="M18 6 6 18"/>
            <path d="M6 6l12 12"/>
            `,

        chevron:
            `
            <path d="m9 18 6-6-6-6"/>
            `,

        back:
            `
            <path d="m15 18-6-6 6-6"/>
            `,

        search:
            `
            <circle cx="11" cy="11" r="7"/>
            <path d="m20 20-4-4"/>
            `,

        alert:
            `
            <path d="M12 6v7"/>
            <path d="M12 17h.01"/>
            `,

        refresh:
            `
            <path d="M20 11a8 8 0 0 0-14.9-3"/>
            <path d="M4 4v4h4"/>
            <path d="M4 13a8 8 0 0 0 14.9 3"/>
            <path d="M20 20v-4h-4"/>
            `,

        close:
            `
            <path d="M18 6 6 18"/>
            <path d="M6 6l12 12"/>
            `,

        plus:
            `
            <path d="M12 5v14"/>
            <path d="M5 12h14"/>
            `,

        settings:
            `
            <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/>
            <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.42 1.42-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2v-.08a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.42-1.42.06-.06A1.7 1.7 0 0 0 9.4 15a1.7 1.7 0 0 0-1.56-1.03H7v-2h.84A1.7 1.7 0 0 0 9.4 10.9a1.7 1.7 0 0 0-.34-1.88L9 8.96l1.42-1.42.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 13.39 6.4V6h2v.4a1.7 1.7 0 0 0 1.03 1.54 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.42 1.42-.06.06a1.7 1.7 0 0 0-.34 1.88A1.7 1.7 0 0 0 20.94 12H21v2h-.06A1.7 1.7 0 0 0 19.4 15Z"/>
            `
    };


    function icon(
        name,
        size = 18
    ) {

        const wrapper =
            document.createElement(
                "span"
            );

        wrapper.className =
            "bk-icon";

        wrapper.innerHTML =
            `
            <svg
                width="${size}"
                height="${size}"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true">
                ${ICONS[name] || ""}
            </svg>
            `;

        return wrapper;
    }


    // ========================================================
    // DOM HELPERS
    // ========================================================

    function el(
        tag,
        className,
        text
    ) {

        const node =
            document.createElement(tag);


        if (className) {

            node.className =
                className;
        }


        if (
            text !== undefined &&
            text !== null
        ) {

            node.textContent =
                text;
        }


        return node;
    }


    function clear(node) {

        while (node.firstChild) {

            node.removeChild(
                node.firstChild
            );
        }
    }


    // ========================================================
    // CSS
    // ========================================================

    const CSS = `

    :host,
    #${ROOT_ID} {

        --bk-text:
            #1d1d1f;

        --bk-secondary:
            #6e6e73;

        --bk-blue:
            #0071e3;

        --bk-blue-hover:
            #0077ed;

        --bk-green:
            #34c759;

        --bk-red:
            #ff3b30;

        --bk-orange:
            #ff9f0a;

        --bk-surface:
            rgba(248,248,250,.92);

        --bk-card:
            rgba(255,255,255,.76);

        --bk-card-solid:
            #ffffff;

        --bk-border:
            rgba(0,0,0,.08);

        --bk-fill:
            rgba(120,120,128,.12);

        --bk-shadow:
            0 30px 80px rgba(0,0,0,.28);

        --bk-radius:
            24px;

        font-family:
            -apple-system,
            BlinkMacSystemFont,
            "SF Pro Display",
            "SF Pro Text",
            "Helvetica Neue",
            Arial,
            sans-serif;

        -webkit-font-smoothing:
            antialiased;
    }


    @media (prefers-color-scheme: dark) {

        :host,
        #${ROOT_ID} {

            --bk-text:
                #f5f5f7;

            --bk-secondary:
                #a1a1a6;

            --bk-blue:
                #2997ff;

            --bk-blue-hover:
                #3da3ff;

            --bk-surface:
                rgba(38,38,40,.94);

            --bk-card:
                rgba(255,255,255,.075);

            --bk-card-solid:
                #2c2c2e;

            --bk-border:
                rgba(255,255,255,.11);

            --bk-fill:
                rgba(120,120,128,.24);

            --bk-shadow:
                0 30px 80px rgba(0,0,0,.58);
        }
    }


    *,
    *::before,
    *::after {

        box-sizing:
            border-box;

        -webkit-tap-highlight-color:
            transparent;
    }


    button,
    input {

        font:
            inherit;

        color:
            inherit;
    }


    button {

        border:
            0;

        outline:
            0;
    }


    button:focus-visible,
    input:focus-visible {

        outline:
            2px solid var(--bk-blue);

        outline-offset:
            2px;
    }


    /* ======================================================
       LAUNCHER
       ====================================================== */

    #bk-material-btn.bk-v2-launcher {

        display:
            inline-flex;

        align-items:
            center;

        gap:
            6px;

        padding:
            5px 13px;

        border-radius:
            999px;

        border:
            0;

        background:
            linear-gradient(
                180deg,
                #0a84ff,
                #0071e3
            );

        color:
            white;

        font-size:
            12px;

        font-weight:
            600;

        cursor:
            pointer;

        box-shadow:
            0 2px 5px rgba(0,0,0,.2);

        transition:
            transform .25s cubic-bezier(.34,1.45,.4,1),
            filter .15s,
            box-shadow .2s;
    }


    #bk-material-btn.bk-v2-launcher:hover {

        filter:
            brightness(1.08);

        box-shadow:
            0 5px 16px rgba(0,113,227,.35);
    }


    #bk-material-btn.bk-v2-launcher:active {

        transform:
            scale(.94);
    }


    /* ======================================================
       OVERLAY
       ====================================================== */

    .bk-overlay {

        position:
            fixed;

        inset:
            0;

        z-index:
            999999;

        display:
            flex;

        align-items:
            center;

        justify-content:
            center;

        padding:
            20px;

        background:
            rgba(0,0,0,.28);

        backdrop-filter:
            blur(14px)
            saturate(140%);

        -webkit-backdrop-filter:
            blur(14px)
            saturate(140%);

        opacity:
            0;

        pointer-events:
            none;

        transition:
            opacity .22s ease;
    }


    .bk-overlay.open {

        opacity:
            1;

        pointer-events:
            auto;
    }


    /* ======================================================
       WINDOW
       ====================================================== */

    .bk-window {

        width:
            470px;

        max-width:
            100%;

        max-height:
            min(760px, 88vh);

        overflow:
            hidden;

        display:
            flex;

        flex-direction:
            column;

        color:
            var(--bk-text);

        background:
            var(--bk-surface);

        border:
            1px solid var(--bk-border);

        border-radius:
            var(--bk-radius);

        box-shadow:
            var(--bk-shadow);

        backdrop-filter:
            blur(40px)
            saturate(180%);

        -webkit-backdrop-filter:
            blur(40px)
            saturate(180%);

        transform:
            translateY(14px)
            scale(.96);

        opacity:
            0;

        transition:
            transform .45s cubic-bezier(.34,1.45,.4,1),
            opacity .2s ease;
    }


    .bk-overlay.open .bk-window {

        transform:
            none;

        opacity:
            1;
    }


    /* ======================================================
       HEADER
       ====================================================== */

    .bk-header {

        flex:
            none;

        display:
            grid;

        grid-template-columns:
            80px 1fr 80px;

        align-items:
            center;

        min-height:
            64px;

        padding:
            10px 14px;

        border-bottom:
            1px solid var(--bk-border);
    }


    .bk-header-left {

        display:
            flex;

        align-items:
            center;

        justify-content:
            flex-start;
    }


    .bk-header-right {

        display:
            flex;

        justify-content:
            flex-end;
    }


    .bk-header-center {

        text-align:
            center;

        min-width:
            0;
    }


    .bk-title {

        font-size:
            17px;

        line-height:
            1.2;

        font-weight:
            650;

        letter-spacing:
            -.02em;
    }


    .bk-subtitle {

        margin-top:
            3px;

        color:
            var(--bk-secondary);

        font-size:
            11.5px;

        white-space:
            nowrap;

        overflow:
            hidden;

        text-overflow:
            ellipsis;
    }


    .bk-close {

        width:
            30px;

        height:
            30px;

        display:
            grid;

        place-items:
            center;

        border-radius:
            50%;

        background:
            var(--bk-fill);

        color:
            var(--bk-secondary);

        cursor:
            pointer;

        transition:
            transform .25s cubic-bezier(.34,1.45,.4,1),
            background .15s;
    }


    .bk-close:hover {

        background:
            rgba(120,120,128,.25);

        transform:
            rotate(90deg);
    }


    .bk-back {

        display:
            inline-flex;

        align-items:
            center;

        gap:
            1px;

        padding:
            5px 8px 5px 2px;

        border-radius:
            8px;

        background:
            transparent;

        color:
            var(--bk-blue);

        font-size:
            14px;

        cursor:
            pointer;

        transition:
            background .15s,
            transform .2s;
    }


    .bk-back:hover {

        background:
            var(--bk-fill);
    }


    .bk-back:active {

        transform:
            translateX(-2px);
    }


    /* ======================================================
       CONTENT
       ====================================================== */

    .bk-content {

        overflow:
            auto;

        padding:
            18px;

        scrollbar-width:
            thin;
    }


    .bk-content::-webkit-scrollbar {

        width:
            7px;
    }


    .bk-content::-webkit-scrollbar-thumb {

        background:
            rgba(120,120,128,.3);

        border-radius:
            10px;
    }


    /* ======================================================
       HERO
       ====================================================== */

    .bk-hero {

        margin:
            2px 2px 18px;
    }


    .bk-hero-title {

        font-size:
            25px;

        font-weight:
            700;

        letter-spacing:
            -.035em;
    }


    .bk-hero-sub {

        margin-top:
            5px;

        color:
            var(--bk-secondary);

        font-size:
            13px;

        line-height:
            1.45;
    }


    .bk-brand {

        display:
            inline-flex;

        align-items:
            center;

        margin-top:
            11px;

        padding:
            5px 9px;

        border-radius:
            999px;

        background:
            var(--bk-fill);

        color:
            var(--bk-secondary);

        font-size:
            11px;

        font-weight:
            500;
    }


    /* ======================================================
       CATEGORY CARDS
       ====================================================== */

    .bk-categories {

        display:
            grid;

        grid-template-columns:
            1fr 1fr;

        gap:
            11px;
    }


    .bk-category {

        position:
            relative;

        min-height:
            178px;

        padding:
            18px;

        text-align:
            left;

        border:
            1px solid var(--bk-border);

        border-radius:
            20px;

        background:
            var(--bk-card);

        cursor:
            pointer;

        overflow:
            hidden;

        transition:
            transform .3s cubic-bezier(.34,1.45,.4,1),
            box-shadow .25s,
            border-color .2s;
    }


    .bk-category::after {

        content:
            "";

        position:
            absolute;

        width:
            100px;

        height:
            100px;

        right:
            -35px;

        bottom:
            -40px;

        border-radius:
            50%;

        opacity:
            .14;

        background:
            currentColor;
    }


    .bk-category:hover {

        transform:
            translateY(-3px);

        box-shadow:
            0 12px 30px rgba(0,0,0,.12);
    }


    .bk-category:active {

        transform:
            scale(.97);
    }


    .bk-category.sticker {

        color:
            #007aff;
    }


    .bk-category.label {

        color:
            #28a745;
    }


    .bk-category-icon {

        width:
            54px;

        height:
            54px;

        display:
            grid;

        place-items:
            center;

        margin-bottom:
            22px;

        border-radius:
            15px;

        color:
            white;

        box-shadow:
            inset 0 1px rgba(255,255,255,.4),
            0 5px 14px rgba(0,0,0,.15);
    }


    .bk-category.sticker
    .bk-category-icon {

        background:
            linear-gradient(
                145deg,
                #64d2ff,
                #007aff
            );
    }


    .bk-category.label
    .bk-category-icon {

        background:
            linear-gradient(
                145deg,
                #63e68b,
                #28a745
            );
    }


    .bk-category-name {

        color:
            var(--bk-text);

        font-size:
            15px;

        font-weight:
            650;
    }


    .bk-category-desc {

        margin-top:
            3px;

        color:
            var(--bk-secondary);

        font-size:
            11.5px;
    }


    .bk-home-footer {

        margin:
            16px 2px 0;

        color:
            var(--bk-secondary);

        font-size:
            11px;

        text-align:
            center;
    }


    /* ======================================================
       STATUS CARD
       ====================================================== */

    .bk-status {

        padding:
            15px;

        margin-bottom:
            14px;

        border:
            1px solid var(--bk-border);

        border-radius:
            17px;

        background:
            var(--bk-card);
    }


    .bk-status-top {

        display:
            flex;

        align-items:
            center;

        justify-content:
            space-between;
    }


    .bk-status-label {

        color:
            var(--bk-secondary);

        font-size:
            12px;
    }


    .bk-status-count {

        font-size:
            16px;

        font-weight:
            650;
    }


    .bk-progress {

        height:
            6px;

        margin-top:
            10px;

        overflow:
            hidden;

        border-radius:
            999px;

        background:
            var(--bk-fill);
    }


    .bk-progress > i {

        display:
            block;

        height:
            100%;

        width:
            0;

        border-radius:
            inherit;

        background:
            linear-gradient(
                90deg,
                #30d158,
                #34c759
            );

        transition:
            width .65s cubic-bezier(.22,1,.36,1);
    }


    .bk-status-detail {

        display:
            flex;

        gap:
            12px;

        margin-top:
            9px;

        font-size:
            11px;

        color:
            var(--bk-secondary);
    }


    .bk-status-detail span {

        display:
            inline-flex;

        align-items:
            center;

        gap:
            4px;
    }


    .bk-status-dot {

        width:
            6px;

        height:
            6px;

        border-radius:
            50%;
    }


    .bk-status-dot.green {

        background:
            var(--bk-green);
    }


    .bk-status-dot.red {

        background:
            var(--bk-red);
    }


    .bk-status-dot.orange {

        background:
            var(--bk-orange);
    }


    /* ======================================================
       COLOR SELECTOR
       ====================================================== */

    .bk-section-label {

        margin:
            0 0 8px 3px;

        color:
            var(--bk-secondary);

        font-size:
            11px;

        font-weight:
            600;

        letter-spacing:
            .05em;
    }


    .bk-colors {

        display:
            flex;

        flex-wrap:
            wrap;

        gap:
            7px;

        margin-bottom:
            15px;
    }


    .bk-color {

        display:
            inline-flex;

        align-items:
            center;

        gap:
            7px;

        height:
            34px;

        padding:
            0 12px 0 8px;

        border:
            1px solid var(--bk-border);

        border-radius:
            999px;

        background:
            var(--bk-card);

        cursor:
            pointer;

        font-size:
            12.5px;

        transition:
            transform .25s cubic-bezier(.34,1.45,.4,1),
            background .15s,
            border-color .15s;
    }


    .bk-color:hover {

        background:
            var(--bk-fill);
    }


    .bk-color:active {

        transform:
            scale(.94);
    }


    .bk-color.selected {

        color:
            white;

        border-color:
            transparent;

        background:
            var(--bk-blue);

        box-shadow:
            0 4px 12px rgba(0,113,227,.28);
    }


    .bk-color-swatch {

        width:
            17px;

        height:
            17px;

        flex:
            none;

        border-radius:
            50%;

        border:
            1px solid rgba(0,0,0,.16);

        background:
            linear-gradient(
                135deg,
                #f5f5f7,
                #bbb
            );
    }


    /* ======================================================
       SEARCH
       ====================================================== */

    .bk-search {

        position:
            relative;

        margin-bottom:
            11px;
    }


    .bk-search .bk-icon {

        position:
            absolute;

        left:
            11px;

        top:
            50%;

        transform:
            translateY(-50%);

        color:
            var(--bk-secondary);

        pointer-events:
            none;
    }


    .bk-search input {

        width:
            100%;

        height:
            38px;

        padding:
            0 12px 0 34px;

        border:
            0;

        border-radius:
            11px;

        background:
            var(--bk-fill);

        color:
            var(--bk-text);

        outline:
            none;

        font-size:
            13px;
    }


    .bk-search input:focus {

        box-shadow:
            0 0 0 3px rgba(0,113,227,.18);
    }


    /* ======================================================
       MATERIAL LIST
       ====================================================== */

    .bk-list {

        overflow:
            hidden;

        border:
            1px solid var(--bk-border);

        border-radius:
            17px;

        background:
            var(--bk-card);
    }


    .bk-material {

        position:
            relative;

        display:
            flex;

        align-items:
            center;

        gap:
            11px;

        min-height:
            58px;

        padding:
            9px 13px;
    }


    .bk-material + .bk-material::before {

        content:
            "";

        position:
            absolute;

        top:
            0;

        left:
            55px;

        right:
            0;

        height:
            1px;

        background:
            var(--bk-border);
    }


    .bk-material-status {

        width:
            29px;

        height:
            29px;

        display:
            grid;

        place-items:
            center;

        flex:
            none;

        border-radius:
            50%;

        color:
            white;
    }


    .bk-material.present
    .bk-material-status {

        background:
            var(--bk-green);
    }


    .bk-material.missing
    .bk-material-status {

        background:
            var(--bk-red);
    }


    .bk-material.pending
    .bk-material-status {

        background:
            var(--bk-orange);
    }


    .bk-material-info {

        min-width:
            0;

        flex:
            1;
    }


    .bk-material-name {

        font-size:
            13px;

        line-height:
            1.35;

        overflow-wrap:
            anywhere;
    }


    .bk-material-type {

        margin-top:
            2px;

        color:
            var(--bk-secondary);

        font-size:
            10.5px;
    }


    .bk-material-state {

        flex:
            none;

        font-size:
            11px;

        font-weight:
            500;
    }


    .present
    .bk-material-state {

        color:
            var(--bk-green);
    }


    .missing
    .bk-material-state {

        color:
            var(--bk-red);
    }


    .pending
    .bk-material-state {

        color:
            var(--bk-orange);
    }


    .bk-material.hidden {

        display:
            none;
    }


    /* ======================================================
       ACTION
       ====================================================== */

    .bk-actions {

        margin-top:
            14px;
    }


    .bk-primary {

        width:
            100%;

        min-height:
            45px;

        display:
            flex;

        align-items:
            center;

        justify-content:
            center;

        gap:
            8px;

        border-radius:
            999px;

        background:
            var(--bk-blue);

        color:
            white;

        font-size:
            14px;

        font-weight:
            650;

        cursor:
            pointer;

        transition:
            transform .25s cubic-bezier(.34,1.45,.4,1),
            filter .15s,
            opacity .2s;
    }


    .bk-primary:hover:not(:disabled) {

        filter:
            brightness(1.08);
    }


    .bk-primary:active:not(:disabled) {

        transform:
            scale(.97);
    }


    .bk-primary:disabled {

        opacity:
            .45;

        cursor:
            default;
    }


    .bk-primary.complete {

        background:
            var(--bk-green);

        opacity:
            .92;
    }


    /* ======================================================
       EMPTY
       ====================================================== */

    .bk-empty {

        padding:
            38px 20px;

        text-align:
            center;

        color:
            var(--bk-secondary);

        font-size:
            13px;
    }


    .bk-empty-icon {

        width:
            42px;

        height:
            42px;

        margin:
            0 auto 10px;

        display:
            grid;

        place-items:
            center;

        border-radius:
            50%;

        background:
            var(--bk-fill);
    }


    /* ======================================================
       LOADING
       ====================================================== */

    .bk-spinner {

        width:
            17px;

        height:
            17px;

        border:
            2px solid rgba(255,255,255,.35);

        border-top-color:
            white;

        border-radius:
            50%;

        animation:
            bk-spin .7s linear infinite;
    }


    @keyframes bk-spin {

        to {
            transform:
                rotate(360deg);
        }
    }


    /* ======================================================
       TOAST
       ====================================================== */

    .bk-toast-container {

        position:
            fixed;

        z-index:
            1000000;

        left:
            50%;

        bottom:
            30px;

        transform:
            translateX(-50%);

        display:
            flex;

        flex-direction:
            column;

        gap:
            8px;

        pointer-events:
            none;
    }


    .bk-toast {

        display:
            flex;

        align-items:
            center;

        gap:
            9px;

        min-width:
            220px;

        max-width:
            min(90vw, 430px);

        padding:
            11px 15px;

        border-radius:
            15px;

        color:
            white;

        background:
            rgba(29,29,31,.94);

        box-shadow:
            0 12px 35px rgba(0,0,0,.3);

        backdrop-filter:
            blur(20px);

        -webkit-backdrop-filter:
            blur(20px);

        font-size:
            13px;

        opacity:
            0;

        transform:
            translateY(15px)
            scale(.95);

        transition:
            opacity .2s ease,
            transform .4s cubic-bezier(.34,1.45,.4,1);
    }


    .bk-toast.show {

        opacity:
            1;

        transform:
            none;
    }


    .bk-toast-icon {

        width:
            20px;

        height:
            20px;

        display:
            grid;

        place-items:
            center;

        border-radius:
            50%;
    }


    .bk-toast.success
    .bk-toast-icon {

        background:
            var(--bk-green);
    }


    .bk-toast.error
    .bk-toast-icon {

        background:
            var(--bk-red);
    }


    /* ======================================================
       MOBILE
       ====================================================== */

    @media (max-width: 520px) {

        .bk-overlay {

            align-items:
                flex-end;

            padding:
                0;
        }


        .bk-window {

            width:
                100%;

            max-height:
                92vh;

            border-radius:
                24px 24px 0 0;

            transform:
                translateY(100%);
        }


        .bk-overlay.open .bk-window {

            transform:
                translateY(0);
        }


        .bk-content {

            padding:
                16px;
        }


        .bk-categories {

            grid-template-columns:
                1fr 1fr;
        }


        .bk-category {

            min-height:
                155px;

            padding:
                15px;
        }


        .bk-category-icon {

            width:
                48px;

            height:
                48px;

            margin-bottom:
                17px;
        }
    }


    @media (max-width: 360px) {

        .bk-categories {

            grid-template-columns:
                1fr;
        }
    }


    @media (prefers-reduced-motion: reduce) {

        *,
        *::before,
        *::after {

            animation:
                none !important;

            transition:
                none !important;
        }
    }

    `;


    // ========================================================
    // STYLE INJECTION
    // ========================================================

    const style =
        document.createElement("style");

    style.id =
        `${ROOT_ID}-style`;

    style.textContent =
        CSS;

    document.head.appendChild(
        style
    );


    // ========================================================
    // ROOT
    // ========================================================

    const root =
        document.createElement("div");

    root.id =
        ROOT_ID;


    document.body.appendChild(
        root
    );


    // ========================================================
    // OVERLAY
    // ========================================================

    const overlay =
        el(
            "div",
            "bk-overlay"
        );


    const windowEl =
        el(
            "div",
            "bk-window"
        );


    windowEl.setAttribute(
        "role",
        "dialog"
    );

    windowEl.setAttribute(
        "aria-modal",
        "true"
    );

    windowEl.tabIndex =
        -1;


    const header =
        el(
            "div",
            "bk-header"
        );


    const headerLeft =
        el(
            "div",
            "bk-header-left"
        );


    const headerCenter =
        el(
            "div",
            "bk-header-center"
        );


    const headerRight =
        el(
            "div",
            "bk-header-right"
        );


    const content =
        el(
            "div",
            "bk-content"
        );


    header.appendChild(
        headerLeft
    );

    header.appendChild(
        headerCenter
    );

    header.appendChild(
        headerRight
    );


    windowEl.appendChild(
        header
    );

    windowEl.appendChild(
        content
    );

    overlay.appendChild(
        windowEl
    );


    root.appendChild(
        overlay
    );


    // ========================================================
    // TOAST
    // ========================================================

    const toastContainer =
        el(
            "div",
            "bk-toast-container"
        );


    root.appendChild(
        toastContainer
    );


    // ========================================================
    // STATE
    // ========================================================

    let currentView =
        "home";


    let currentCategory =
        null;


    let currentItems =
        [];


    let selectedColor =
        null;


    let lastFocus =
        null;


    let renderToken =
        0;


    // ========================================================
    // CLOSE
    // ========================================================

    function close() {

        overlay.classList.remove(
            "open"
        );

        currentView =
            "home";

        currentCategory =
            null;

        selectedColor =
            null;


        if (
            lastFocus &&
            typeof lastFocus.focus ===
            "function"
        ) {

            try {

                lastFocus.focus({
                    preventScroll:
                        true
                });

            } catch (_) {}
        }
    }


    // ========================================================
    // HEADER
    // ========================================================

    function setHeader(
        title,
        subtitle,
        back
    ) {

        clear(headerLeft);
        clear(headerCenter);
        clear(headerRight);


        if (back) {

            const backBtn =
                el(
                    "button",
                    "bk-back"
                );


            backBtn.appendChild(
                icon(
                    "back",
                    18
                )
            );


            backBtn.appendChild(
                document.createTextNode(
                    "Back"
                )
            );


            backBtn.onclick =
                showHome;


            headerLeft.appendChild(
                backBtn
            );
        }


        const titleEl =
            el(
                "div",
                "bk-title",
                title
            );


        headerCenter.appendChild(
            titleEl
        );


        if (subtitle) {

            headerCenter.appendChild(
                el(
                    "div",
                    "bk-subtitle",
                    subtitle
                )
            );
        }


        const closeBtn =
            el(
                "button",
                "bk-close"
            );


        closeBtn.setAttribute(
            "aria-label",
            "Close"
        );


        closeBtn.appendChild(
            icon(
                "close",
                15
            )
        );


        closeBtn.onclick =
            close;


        headerRight.appendChild(
            closeBtn
        );
    }


    // ========================================================
    // OPEN
    // ========================================================

    function open() {

        lastFocus =
            document.activeElement;


        overlay.classList.add(
            "open"
        );


        requestAnimationFrame(
            () => {

                windowEl.focus();
            }
        );
    }


    // ========================================================
    // HOME
    // ========================================================

    function showHome() {

        currentView =
            "home";


        setHeader(
            "Material Assistant",
            "BOM Material Manager",
            false
        );


        clear(content);


        const hero =
            el(
                "div",
                "bk-hero"
            );


        hero.appendChild(
            el(
                "div",
                "bk-hero-title",
                "Materials"
            )
        );


        hero.appendChild(
            el(
                "div",
                "bk-hero-sub",
                "Choose a material category to check your BOM."
            )
        );


        const brand =
            CORE.getBuyerBrand?.();


        if (brand) {

            hero.appendChild(
                el(
                    "div",
                    "bk-brand",
                    `Buyer · ${brand}`
                )
            );
        }


        content.appendChild(
            hero
        );


        const categories =
            el(
                "div",
                "bk-categories"
            );


        categories.appendChild(
            createCategory(
                "Sticker",
                "Sticker materials",
                "sticker",
                "stickers",
                "STICKER"
            )
        );


        categories.appendChild(
            createCategory(
                "Labels",
                "Label materials",
                "label",
                "labels",
                "LABEL"
            )
        );


        content.appendChild(
            categories
        );


        content.appendChild(
            el(
                "div",
                "bk-home-footer",
                "Material configuration is managed centrally."
            )
        );


        currentView =
            "home";
    }


    // ========================================================
    // CATEGORY
    // ========================================================

    function createCategory(
        title,
        description,
        iconName,
        materialType,
        category
    ) {

        const button =
            el(
                "button",
                `bk-category ${iconName}`
            );


        const iconBox =
            el(
                "div",
                "bk-category-icon"
            );


        iconBox.appendChild(
            icon(
                iconName,
                27
            )
        );


        button.appendChild(
            iconBox
        );


        button.appendChild(
            el(
                "div",
                "bk-category-name",
                title
            )
        );


        button.appendChild(
            el(
                "div",
                "bk-category-desc",
                description
            )
        );


        button.onclick =
            () => {

                const items =
                    CORE.getMaterialList(
                        materialType
                    ) || [];


                showMaterials(
                    title,
                    items,
                    category
                );
            };


        return button;
    }


    // ========================================================
    // MATERIAL VIEW
    // ========================================================

    function showMaterials(
        title,
        items,
        category
    ) {

        currentView =
            "materials";

        currentCategory =
            category;

        currentItems =
            items || [];

        selectedColor =
            null;


        renderMaterials(
            title
        );
    }


    // ========================================================
    // MATERIAL RENDER
    // ========================================================

    function renderMaterials(
        title
    ) {

        const token =
            ++renderToken;


        setHeader(
            title,
            "BOM material status",
            true
        );


        clear(content);


        // ----------------------------------------------------
        // COLOR
        // ----------------------------------------------------

        const needsColor =
            currentItems.some(
                item =>
                    item.needsColor
            );


        if (needsColor) {

            renderColors(
                content
            );
        }


        // ----------------------------------------------------
        // RESOLVE
        // ----------------------------------------------------

        const resolved =
            currentItems.map(
                raw => {

                    const item =
                        CORE.resolveItem(
                            raw,
                            selectedColor
                        );


                    if (!item) {

                        return {
                            raw,
                            item: null,
                            state:
                                "pending"
                        };
                    }


                    const exists =
                        CORE.isItemInBom(
                            item
                        );


                    return {
                        raw,
                        item,
                        state:
                            exists
                                ? "present"
                                : "missing"
                    };
                }
            );


        // ----------------------------------------------------
        // COUNTS
        // ----------------------------------------------------

        const total =
            resolved.length;


        const present =
            resolved.filter(
                x =>
                    x.state ===
                    "present"
            ).length;


        const missing =
            resolved.filter(
                x =>
                    x.state ===
                    "missing"
            ).length;


        const pending =
            resolved.filter(
                x =>
                    x.state ===
                    "pending"
            ).length;


        // ----------------------------------------------------
        // STATUS
        // ----------------------------------------------------

        content.appendChild(
            createStatus(
                total,
                present,
                missing,
                pending
            )
        );


        // ----------------------------------------------------
        // SEARCH
        // ----------------------------------------------------

        let searchInput =
            null;


        if (
            currentItems.length >= 5
        ) {

            const search =
                el(
                    "div",
                    "bk-search"
                );


            search.appendChild(
                icon(
                    "search",
                    16
                )
            );


            searchInput =
                document.createElement(
                    "input"
                );


            searchInput.type =
                "search";

            searchInput.placeholder =
                "Search materials...";

            searchInput.autocomplete =
                "off";


            search.appendChild(
                searchInput
            );


            content.appendChild(
                search
            );
        }


        // ----------------------------------------------------
        // LIST
        // ----------------------------------------------------

        const list =
            el(
                "div",
                "bk-list"
            );


        if (!resolved.length) {

            list.appendChild(
                createEmpty()
            );

        } else {

            resolved.forEach(
                (entry, index) => {

                    list.appendChild(
                        createMaterial(
                            entry,
                            index
                        )
                    );
                }
            );
        }


        content.appendChild(
            list
        );


        // ----------------------------------------------------
        // ACTION
        // ----------------------------------------------------

        const action =
            createAction(
                resolved,
                category
            );


        content.appendChild(
            action
        );


        // ----------------------------------------------------
        // SEARCH
        // ----------------------------------------------------

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                () => {

                    const query =
                        searchInput.value
                            .trim()
                            .toUpperCase();


                    list
                        .querySelectorAll(
                            ".bk-material"
                        )
                        .forEach(
                            row => {

                                const name =
                                    row.dataset.name ||
                                    "";


                                row.classList.toggle(
                                    "hidden",
                                    Boolean(
                                        query &&
                                        !name.includes(
                                            query
                                        )
                                    )
                                );
                            }
                        );
                }
            );
        }


        // Prevent stale async UI updates.
        if (token !== renderToken) {
            return;
        }
    }


    // ========================================================
    // COLORS
    // ========================================================

    function renderColors(
        parent
    ) {

        const colors =
            CORE.collectAvailableColors(
                currentItems
            ) || [];


        const section =
            el(
                "div",
                ""
            );


        section.appendChild(
            el(
                "div",
                "bk-section-label",
                "COLOR"
            )
        );


        const colorsWrap =
            el(
                "div",
                "bk-colors"
            );


        colors.forEach(
            color => {

                const button =
                    el(
                        "button",
                        "bk-color"
                    );


                if (
                    selectedColor ===
                    color
                ) {

                    button.classList.add(
                        "selected"
                    );
                }


                const swatch =
                    el(
                        "span",
                        "bk-color-swatch"
                    );


                swatch.style.background =
                    getColorGradient(
                        color
                    );


                button.appendChild(
                    swatch
                );


                button.appendChild(
                    document.createTextNode(
                        color
                    )
                );


                button.onclick =
                    () => {

                        selectedColor =
                            color;

                        renderMaterials(
                            currentCategory ===
                            "STICKER"
                                ? "Sticker"
                                : "Labels"
                        );
                    };


                colorsWrap.appendChild(
                    button
                );
            }
        );


        if (!colors.length) {

            section.appendChild(
                el(
                    "div",
                    "bk-empty",
                    "No colors are configured."
                )
            );

        } else {

            section.appendChild(
                colorsWrap
            );
        }


        parent.appendChild(
            section
        );
    }


    // ========================================================
    // COLOR VISUAL
    // ========================================================

    function getColorGradient(
        color
    ) {

        const c =
            String(color)
                .toLowerCase();


        const known = {

            black:
                "#1c1c1e",

            white:
                "#f5f5f7",

            red:
                "#ff3b30",

            blue:
                "#007aff",

            green:
                "#34c759",

            yellow:
                "#ffd60a",

            orange:
                "#ff9f0a",

            purple:
                "#af52de",

            pink:
                "#ff2d55",

            grey:
                "#8e8e93",

            gray:
                "#8e8e93"
        };


        if (known[c]) {

            return known[c];
        }


        return `
            linear-gradient(
                135deg,
                #f5f5f7,
                #8e8e93
            )
        `;
    }


    // ========================================================
    // STATUS
    // ========================================================

    function createStatus(
        total,
        present,
        missing,
        pending
    ) {

        const card =
            el(
                "div",
                "bk-status"
            );


        const top =
            el(
                "div",
                "bk-status-top"
            );


        top.appendChild(
            el(
                "span",
                "bk-status-label",
                "BOM status"
            )
        );


        top.appendChild(
            el(
                "span",
                "bk-status-count",
                `${present} / ${total}`
            )
        );


        card.appendChild(
            top
        );


        const progress =
            el(
                "div",
                "bk-progress"
            );


        const fill =
            el(
                "i"
            );


        const percent =
            total
                ? Math.round(
                    present /
                    total *
                    100
                )
                : 0;


        fill.style.width =
            `${percent}%`;


        progress.appendChild(
            fill
        );


        card.appendChild(
            progress
        );


        const detail =
            el(
                "div",
                "bk-status-detail"
            );


        const presentText =
            el(
                "span"
            );


        const presentDot =
            el(
                "i",
                "bk-status-dot green"
            );


        presentText.appendChild(
            presentDot
        );


        presentText.appendChild(
            document.createTextNode(
                `${present} present`
            )
        );


        detail.appendChild(
            presentText
        );


        if (missing) {

            const missingText =
                el(
                    "span"
                );


            missingText.appendChild(
                el(
                    "i",
                    "bk-status-dot red"
                )
            );


            missingText.appendChild(
                document.createTextNode(
                    `${missing} missing`
                )
            );


            detail.appendChild(
                missingText
            );
        }


        if (pending) {

            const pendingText =
                el(
                    "span"
                );


            pendingText.appendChild(
                el(
                    "i",
                    "bk-status-dot orange"
                )
            );


            pendingText.appendChild(
                document.createTextNode(
                    `${pending} waiting`
                )
            );


            detail.appendChild(
                pendingText
            );
        }


        card.appendChild(
            detail
        );


        return card;
    }


    // ========================================================
    // MATERIAL ROW
    // ========================================================

    function createMaterial(
        entry,
        index
    ) {

        const row =
            el(
                "div",
                `bk-material ${entry.state}`
            );


        const name =
            entry.item
                ?.item_name ||
            entry.raw
                ?.type ||
            "Material";


        row.dataset.name =
            String(name)
                .toUpperCase();


        const status =
            el(
                "div",
                "bk-material-status"
            );


        if (
            entry.state ===
            "present"
        ) {

            status.appendChild(
                icon(
                    "check",
                    15
                )
            );

        } else if (
            entry.state ===
            "missing"
        ) {

            status.appendChild(
                icon(
                    "x",
                    15
                )
            );

        } else {

            status.appendChild(
                icon(
                    "alert",
                    15
                )
            );
        }


        const info =
            el(
                "div",
                "bk-material-info"
            );


        info.appendChild(
            el(
                "div",
                "bk-material-name",
                name
            )
        );


        const meta =
            entry.item
                ?.color
                ? `${entry.item.type || ""} · ${entry.item.color}`
                : entry.raw?.type || "";


        if (meta) {

            info.appendChild(
                el(
                    "div",
                    "bk-material-type",
                    meta
                )
            );
        }


        const state =
            el(
                "div",
                "bk-material-state"
            );


        state.textContent =
            entry.state ===
                "present"
                ? "Present"
                : entry.state ===
                    "missing"
                    ? "Missing"
                    : "Select color";


        row.appendChild(
            status
        );

        row.appendChild(
            info
        );

        row.appendChild(
            state
        );


        return row;
    }


    // ========================================================
    // EMPTY
    // ========================================================

    function createEmpty() {

        const empty =
            el(
                "div",
                "bk-empty"
            );


        const emptyIcon =
            el(
                "div",
                "bk-empty-icon"
            );


        emptyIcon.appendChild(
            icon(
                "clipboard",
                20
            )
        );


        empty.appendChild(
            emptyIcon
        );


        empty.appendChild(
            document.createTextNode(
                "No materials configured for this category."
            )
        );


        return empty;
    }


    // ========================================================
    // ACTION BUTTON
    // ========================================================

    function createAction(
        resolved,
        category
    ) {

        const pending =
            resolved.filter(
                x =>
                    x.state ===
                    "pending"
            );


        const missing =
            resolved.filter(
                x =>
                    x.state ===
                    "missing"
            );


        const actions =
            el(
                "div",
                "bk-actions"
            );


        const button =
            el(
                "button",
                "bk-primary"
            );


        if (pending.length) {

            button.disabled =
                true;


            button.appendChild(
                icon(
                    "alert",
                    16
                )
            );


            button.appendChild(
                document.createTextNode(
                    "Select a Color First"
                )
            );

        } else if (!missing.length) {

            button.disabled =
                true;

            button.classList.add(
                "complete"
            );


            button.appendChild(
                icon(
                    "check",
                    16
                )
            );


            button.appendChild(
                document.createTextNode(
                    "All Materials Present"
                )
            );

        } else {

            button.appendChild(
                icon(
                    "plus",
                    16
                )
            );


            const materialName =
                category === "STICKER"
                    ? "Sticker"
                    : "Label";


            button.appendChild(
                document.createTextNode(
                    `Add ${missing.length} ` +
                    materialName +
                    (
                        missing.length === 1
                            ? ""
                            : "s"
                    )
                )
            );


            button.onclick =
                () =>
                    startAutomation(
                        missing,
                        category,
                        button
                    );
        }


        actions.appendChild(
            button
        );


        return actions;
    }


    // ========================================================
    // AUTOMATION
    // ========================================================

    async function startAutomation(
        missing,
        category,
        button
    ) {

        const brand =
            CORE.getBuyerBrand?.();


        if (!brand) {

            notify(
                "Unable to resolve buyer brand.",
                "error"
            );

            return;
        }


        const invalidRate =
            missing.filter(
                item =>
                    item.rate == null
            );


        if (invalidRate.length) {

            notify(
                `${invalidRate.length} material(s) have no configured rate.`,
                "error"
            );

            return;
        }


        const payload =
            missing.map(
                item => ({

                    filterText:
                        category,

                    type:
                        item.type,

                    brand:
                        brand,

                    color:
                        item.color ??
                        null,

                    rate:
                        item.rate,

                    excess:
                        item.excess ??
                        5,

                    item_id:
                        item.item_id,

                    item_name:
                        item.item_name
                })
            );


        button.disabled =
            true;


        clear(button);


        button.appendChild(
            el(
                "span",
                "bk-spinner"
            )
        );


        button.appendChild(
            document.createTextNode(
                "Starting..."
            )
        );


        try {

            await CORE.runAutomation(
                category,
                payload
            );


            clear(button);

            button.classList.add(
                "complete"
            );


            button.appendChild(
                icon(
                    "check",
                    16
                )
            );


            button.appendChild(
                document.createTextNode(
                    "Automation Started"
                )
            );


        } catch (error) {

            console.error(
                "Material automation failed:",
                error
            );


            button.disabled =
                false;


            clear(button);


            button.appendChild(
                icon(
                    "refresh",
                    16
                )
            );


            button.appendChild(
                document.createTextNode(
                    "Try Again"
                );


            notify(
                error?.message ||
                "Automation failed.",
                "error"
            );
        }
    }


    // ========================================================
    // TOAST
    // ========================================================

    function notify(
        message,
        type = "success"
    ) {

        const toast =
            el(
                "div",
                `bk-toast ${type}`
            );


        const toastIcon =
            el(
                "span",
                "bk-toast-icon"
            );


        toastIcon.appendChild(
            icon(
                type === "error"
                    ? "alert"
                    : "check",
                13
            )
        );


        toast.appendChild(
            toastIcon
        );


        toast.appendChild(
            el(
                "span",
                "",
                message
            )
        );


        toastContainer.appendChild(
            toast
        );


        requestAnimationFrame(
            () => {

                requestAnimationFrame(
                    () => {

                        toast.classList.add(
                            "show"
                        );
                    }
                );
            }
        );


        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );


                setTimeout(
                    () =>
                        toast.remove(),
                    400
                );

            },
            type === "error"
                ? 4500
                : 3000
        );


        return {

            update(
                nextMessage,
                nextType = "success"
            ) {

                toast.className =
                    `bk-toast ${nextType} show`;


                const text =
                    toast.querySelector(
                        "span:last-child"
                    );


                if (text) {

                    text.textContent =
                        nextMessage;
                }
            }
        };
    }


    // ========================================================
    // KEYBOARD
    // ========================================================

    function handleKeydown(
        event
    ) {

        if (
            event.key ===
            "Escape" &&
            overlay.classList.contains(
                "open"
            )
        ) {

            event.preventDefault();

            close();

            return;
        }


        if (
            event.key !==
            "Tab"
        ) {

            return;
        }


        if (
            !overlay.classList.contains(
                "open"
            )
        ) {

            return;
        }


        const focusable = [
            ...windowEl.querySelectorAll(
                `
                button:not(:disabled),
                input:not(:disabled),
                [tabindex]:not([tabindex="-1"])
                `
            )
        ];


        if (!focusable.length) {
            return;
        }


        const first =
            focusable[0];

        const last =
            focusable[
                focusable.length - 1
            ];


        if (
            event.shiftKey &&
            document.activeElement === first
        ) {

            event.preventDefault();

            last.focus();

        } else if (
            !event.shiftKey &&
            document.activeElement === last
        ) {

            event.preventDefault();

            first.focus();
        }
    }


    document.addEventListener(
        "keydown",
        handleKeydown
    );


    // ========================================================
    // BACKDROP CLICK
    // ========================================================

    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                overlay
            ) {

                close();
            }
        }
    );


    // ========================================================
    // LAUNCHER
    // ========================================================

    function installLauncher() {

        const launcher =
            document.getElementById(
                LAUNCHER_ID
            );


        if (!launcher) {

            console.warn(
                "BK Material Assistant launcher not found."
            );

            return;
        }


        launcher.classList.add(
            "bk-v2-launcher"
        );


        launcher.onclick =
            () => {

                showHome();

                open();
            };
    }


    // ========================================================
    // INITIALIZE
    // ========================================================

    installLauncher();


    // ========================================================
    // CORE UI REGISTRATION
    // ========================================================

    if (
        typeof CORE.registerUI ===
        "function"
    ) {

        CORE.registerUI({

            version:
                UI_VERSION,

            mount() {

                installLauncher();

            },

            destroy() {

                close();

                document.removeEventListener(
                    "keydown",
                    handleKeydown
                );


                root.remove();


                style.remove();
            },

            notify

        });
    }


    // ========================================================
    // READY
    // ========================================================

    console.log(
        `✅ BK Material Assistant ${UI_VERSION} mounted.`
    );


})();
