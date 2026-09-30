// ============================================================
// BK MATERIAL ASSISTANT  ·  UI THEME (all CSS lives here)
// Edit this file for look & feel only. No logic, no data.
// ============================================================
(function () {
    const BK = (window.BKAssist = window.BKAssist || {});

    // Styles injected inside the Shadow DOM (popup, tiles, toasts...)
    BK.THEME_CSS = `

    :host {
        all: initial;

        --ic-text: #1d1d1f;
        --ic-sub: #6e6e73;
        --ic-accent: #0071e3;

        --ic-surface: rgba(246,246,248,.82);
        --ic-group: #ffffff;

        --ic-line: rgba(0,0,0,.09);
        --ic-fill: rgba(120,120,128,.12);

        --ic-border: rgba(255,255,255,.55);

        --ic-ok: #34c759;
        --ic-bad: #ff3b30;
        --ic-warn: #ff9f0a;

        --ic-toast: rgba(29,29,31,.92);
        --ic-toast-text: #fff;

        --spring:
            cubic-bezier(.34,1.45,.4,1);

        --ease:
            cubic-bezier(.22,1,.36,1);

        font-family:
            -apple-system,
            BlinkMacSystemFont,
            "SF Pro Text",
            "Helvetica Neue",
            Arial,
            sans-serif;

        -webkit-font-smoothing:
            antialiased;
    }


    @media (prefers-color-scheme: dark) {

        :host {

            --ic-text: #f5f5f7;
            --ic-sub: #a1a1a6;
            --ic-accent: #2997ff;

            --ic-surface:
                rgba(38,38,40,.82);

            --ic-group:
                rgba(255,255,255,.07);

            --ic-line:
                rgba(255,255,255,.11);

            --ic-fill:
                rgba(120,120,128,.30);

            --ic-border:
                rgba(255,255,255,.12);

            --ic-toast:
                rgba(70,70,74,.94);
        }
    }


    *,
    *::before,
    *::after {
        box-sizing: border-box;
        -webkit-tap-highlight-color: transparent;
    }


    button,
    input {
        font: inherit;
        color: inherit;
    }


    button {
        -webkit-appearance: none;
        appearance: none;
    }


    .ico {
        display: inline-flex;
        line-height: 0;
        flex: none;
    }


    :focus-visible {
        outline:
            2px solid var(--ic-accent);

        outline-offset:
            2px;
    }


    /* ======================================================
       BACKDROP
       ====================================================== */

    .backdrop {

        position: absolute;
        inset: 0;

        display: flex;

        align-items: center;
        justify-content: center;

        background:
            rgba(0,0,0,.32);

        -webkit-backdrop-filter:
            blur(12px) saturate(140%);

        backdrop-filter:
            blur(12px) saturate(140%);

        opacity: 0;

        pointer-events: none;

        transition:
            opacity .25s ease;
    }


    .backdrop.open {

        opacity: 1;

        pointer-events: auto;
    }


    /* ======================================================
       WINDOW
       ====================================================== */

    .box {

        position: relative;

        width: 430px;

        max-width:
            calc(100vw - 24px);

        max-height:
            min(86vh, 740px);

        overflow-x: hidden;
        overflow-y: auto;

        overscroll-behavior:
            contain;

        scrollbar-width:
            thin;

        color:
            var(--ic-text);

        background:
            var(--ic-surface);

        border:
            .5px solid var(--ic-border);

        border-radius:
            22px;

        outline:
            none;

        -webkit-backdrop-filter:
            saturate(180%) blur(40px);

        backdrop-filter:
            saturate(180%) blur(40px);

        box-shadow:
            0 30px 80px rgba(0,0,0,.35),
            0 2px 10px rgba(0,0,0,.1);

        opacity:
            0;

        transform:
            translateY(16px) scale(.94);

        transition:
            opacity .18s ease,
            transform .22s ease-in,
            height .38s var(--ease);
    }


    .backdrop.open .box {

        opacity: 1;

        transform: none;

        transition:
            opacity .22s ease,
            transform .55s var(--spring),
            height .38s var(--ease);
    }


    .view {

        padding:
            16px 18px 18px;
    }


    .view.enter-push {

        animation:
            bk-push .45s var(--ease) backwards;
    }


    .view.enter-pop {

        animation:
            bk-pop .45s var(--ease) backwards;
    }


    @keyframes bk-push {

        from {
            opacity: 0;
            transform:
                translateX(32px);
        }
    }


    @keyframes bk-pop {

        from {
            opacity: 0;
            transform:
                translateX(-32px);
        }
    }


    .stagger .st {

        animation:
            bk-rise .5s var(--ease) backwards;

        animation-delay:
            calc(var(--i, 0) * 45ms + 70ms);
    }


    @keyframes bk-rise {

        from {
            opacity: 0;
            transform:
                translateY(12px);
        }
    }


    /* ======================================================
       HEADER
       ====================================================== */

    .head {

        display: grid;

        grid-template-columns:
            84px 1fr 84px;

        align-items: center;

        margin-bottom:
            16px;

        min-height:
            34px;
    }


    .head .l {
        justify-self: start;
    }


    .head .r {
        justify-self: end;
    }


    .mid {

        text-align:
            center;

        min-width:
            0;
    }


    .title {

        font-size:
            17px;

        font-weight:
            600;

        letter-spacing:
            -.022em;
    }


    .sub {

        margin-top:
            2px;

        font-size:
            12px;

        color:
            var(--ic-sub);
    }


    .navbtn {

        display:
            inline-flex;

        align-items:
            center;

        border:
            0;

        background:
            none;

        cursor:
            pointer;

        color:
            var(--ic-accent);

        font-size:
            15px;

        padding:
            5px 6px 5px 0;

        border-radius:
            8px;

        transition:
            opacity .15s,
            transform .2s var(--spring);
    }


    .navbtn:hover {
        opacity:
            .7;
    }


    .navbtn:active {

        transform:
            translateX(-2px);

        opacity:
            .5;
    }


    .x {

        width:
            28px;

        height:
            28px;

        display:
            grid;

        place-items:
            center;

        border:
            0;

        border-radius:
            50%;

        cursor:
            pointer;

        background:
            var(--ic-fill);

        color:
            var(--ic-sub);

        transition:
            background .15s,
            transform .25s var(--spring);
    }


    .x:hover {

        background:
            rgba(120,120,128,.28);

        transform:
            rotate(90deg);
    }


    .x:active {

        transform:
            rotate(90deg) scale(.88);
    }


    /* ======================================================
       HOME
       ====================================================== */

    .welcome {

        margin:
            4px 4px 16px;

        text-align:
            center;
    }


    .welcome-title {

        font-size:
            14px;

        font-weight:
            600;
    }


    .welcome-sub {

        margin-top:
            4px;

        font-size:
            12px;

        color:
            var(--ic-sub);
    }


    .tiles {

        display:
            grid;

        grid-template-columns:
            1fr 1fr;

        gap:
            10px;
    }


    .tile {

        position:
            relative;

        padding:
            18px 8px 16px;

        text-align:
            center;

        cursor:
            pointer;

        background:
            var(--ic-group);

        border:
            .5px solid var(--ic-line);

        border-radius:
            18px;

        transition:
            transform .3s var(--spring),
            box-shadow .3s,
            background .15s;
    }


    .tile:hover {

        transform:
            translateY(-3px);

        box-shadow:
            0 10px 24px rgba(0,0,0,.14);
    }


    .tile:hover .appicon {

        transform:
            scale(1.05);
    }


    .tile:active {

        transform:
            scale(.96);

        box-shadow:
            none;
    }


    .appicon {

        width:
            68px;

        height:
            68px;

        margin:
            0 auto 10px;

        border-radius:
            16px;

        display:
            grid;

        place-items:
            center;

        color:
            #fff;

        box-shadow:
            0 3px 10px rgba(0,0,0,.22),
            inset 0 1px 0 rgba(255,255,255,.4),
            inset 0 -1px 0 rgba(0,0,0,.08);

        transition:
            transform .3s var(--spring);
    }


    .appicon svg {

        filter:
            drop-shadow(
                0 1px 1px rgba(0,0,0,.25)
            );
    }


    .appicon.sticker {

        background:
            linear-gradient(
                160deg,
                #64d2ff,
                #0a84ff
            );
    }


    .appicon.label {

        background:
            linear-gradient(
                160deg,
                #7ee08f,
                #28b446
            );
    }


    .tile-name {

        font-size:
            14px;

        font-weight:
            600;
    }


    .tile-meta {

        margin-top:
            2px;

        font-size:
            11.5px;

        color:
            var(--ic-sub);
    }


    .hint {

        margin:
            14px 4px 0;

        text-align:
            center;

        font-size:
            12px;

        color:
            var(--ic-sub);
    }


    /* ======================================================
       SUMMARY
       ====================================================== */

    .summary {

        margin-bottom:
            12px;

        padding:
            12px 14px;

        background:
            var(--ic-group);

        border:
            .5px solid var(--ic-line);

        border-radius:
            14px;
    }


    .sum-top {

        display:
            flex;

        justify-content:
            space-between;

        align-items:
            baseline;

        font-size:
            12.5px;

        color:
            var(--ic-sub);
    }


    .sum-top b {

        font-size:
            15px;

        font-weight:
            600;

        color:
            var(--ic-text);
    }


    .bar {

        height:
            6px;

        margin-top:
            9px;

        overflow:
            hidden;

        border-radius:
            3px;

        background:
            var(--ic-fill);
    }


    .bar > i {

        display:
            block;

        width:
            0;

        height:
            100%;

        border-radius:
            3px;

        background:
            linear-gradient(
                90deg,
                #30d158,
                #34c759
            );

        transition:
            width .8s var(--ease) .15s;
    }


    /* ======================================================
       COLOR
       ====================================================== */

    .field {

        margin-bottom:
            12px;
    }


    .field-label {

        margin:
            0 0 7px 4px;

        font-size:
            12px;

        font-weight:
            500;

        color:
            var(--ic-sub);
    }


    .chips {

        display:
            flex;

        flex-wrap:
            wrap;

        gap:
            7px;
    }


    .chip {

        display:
            inline-flex;

        align-items:
            center;

        gap:
            7px;

        height:
            32px;

        padding:
            0 13px 0 9px;

        cursor:
            pointer;

        background:
            var(--ic-group);

        border:
            .5px solid var(--ic-line);

        border-radius:
            16px;

        font-size:
            13px;

        transition:
            transform .3s var(--spring),
            background .2s,
            color .2s,
            box-shadow .2s;
    }


    .chip:hover {

        background:
            var(--ic-fill);
    }


    .chip:active {

        transform:
            scale(.93);
    }


    .chip[aria-checked="true"] {

        background:
            var(--ic-accent);

        color:
            #fff;

        border-color:
            transparent;

        box-shadow:
            0 3px 10px rgba(0,113,227,.4);

        transform:
            scale(1.03);
    }


    .sw {

        width:
            15px;

        height:
            15px;

        border-radius:
            50%;

        box-shadow:
            inset 0 0 0 1px rgba(0,0,0,.22);

        background:
            conic-gradient(
                #ff5f57,
                #febc2e,
                #28c840,
                #0a84ff,
                #bf5af2,
                #ff5f57
            );
    }


    /* ======================================================
       SEARCH
       ====================================================== */

    .search {

        position:
            relative;

        margin-bottom:
            10px;
    }


    .search .ico {

        position:
            absolute;

        left:
            10px;

        top:
            50%;

        transform:
            translateY(-50%);

        color:
            var(--ic-sub);

        pointer-events:
            none;
    }


    .search input {

        width:
            100%;

        height:
            36px;

        padding:
            0 12px 0 32px;

        border:
            0;

        border-radius:
            10px;

        outline:
            none;

        background:
            var(--ic-fill);

        color:
            var(--ic-text);

        font-size:
            14px;

        transition:
            box-shadow .2s;
    }


    .search input::placeholder {

        color:
            var(--ic-sub);
    }


    .search input:focus {

        box-shadow:
            0 0 0 3px rgba(0,113,227,.3);
    }


    /* ======================================================
       LIST
       ====================================================== */

    .list {

        overflow:
            hidden;

        background:
            var(--ic-group);

        border:
            .5px solid var(--ic-line);

        border-radius:
            14px;
    }


    .row {

        position:
            relative;

        display:
            flex;

        align-items:
            center;

        gap:
            12px;

        width:
            100%;

        padding:
            11px 14px;

        border:
            0;

        background:
            none;

        text-align:
            left;

        cursor:
            pointer;

        transition:
            background .12s;
    }


    .row[hidden] {

        display:
            none;
    }


    .row + .row::before {

        content:
            "";

        position:
            absolute;

        top:
            0;

        left:
            50px;

        right:
            0;

        height:
            .5px;

        background:
            var(--ic-line);
    }


    .row:hover:not(:disabled) {

        background:
            var(--ic-fill);
    }


    .row:active:not(:disabled) {

        background:
            rgba(120,120,128,.26);
    }


    .row:disabled {

        cursor:
            default;
    }


    .dot {

        flex:
            none;

        width:
            24px;

        height:
            24px;

        display:
            grid;

        place-items:
            center;

        border-radius:
            50%;

        color:
            #fff;
    }


    .dot svg {

        stroke-width:
            3;
    }


    .ok .dot {

        background:
            var(--ic-ok);
    }


    .missing .dot {

        background:
            var(--ic-bad);
    }


    .pending .dot {

        background:
            var(--ic-warn);
    }


    .name {

        flex:
            1;

        min-width:
            0;

        font-size:
            14px;

        line-height:
            1.3;

        overflow-wrap:
            anywhere;
    }


    .pending .name {

        color:
            var(--ic-sub);
    }


    .tag {

        flex:
            none;

        font-size:
            12px;

        color:
            var(--ic-sub);

        white-space:
            nowrap;
    }


    .ok .tag {

        color:
            var(--ic-ok);
    }


    .missing .tag {

        color:
            var(--ic-bad);

        font-weight:
            500;
    }


    .pending .tag {

        color:
            var(--ic-warn);
    }


    .empty {

        padding:
            30px 12px;

        text-align:
            center;

        font-size:
            13px;

        color:
            var(--ic-sub);
    }


    .empty .ico {

        display:
            flex;

        justify-content:
            center;

        margin-bottom:
            8px;

        opacity:
            .5;
    }


    /* ======================================================
       ACTIONS
       ====================================================== */

    .actions {

        display:
            flex;

        flex-direction:
            column;

        gap:
            8px;

        margin-top:
            14px;
    }


    .btn {

        display:
            flex;

        align-items:
            center;

        justify-content:
            center;

        gap:
            8px;

        height:
            44px;

        border:
            0;

        border-radius:
            980px;

        font-size:
            15px;

        font-weight:
            600;

        cursor:
            pointer;

        transition:
            transform .3s var(--spring),
            filter .15s,
            opacity .2s,
            background .3s;
    }


    .btn.primary {

        background:
            var(--ic-accent);

        color:
            #fff;
    }


    .btn.primary:hover:not(:disabled) {

        filter:
            brightness(1.1);
    }


    .btn:active:not(:disabled) {

        transform:
            scale(.97);
    }


    .btn:disabled {

        opacity:
            .4;

        cursor:
            not-allowed;
    }


    .btn.done {

        background:
            var(--ic-ok);
    }


    .btn.done:disabled {

        opacity:
            .9;
    }


    .spin {

        width:
            16px;

        height:
            16px;

        border-radius:
            50%;

        border:
            2px solid rgba(255,255,255,.35);

        border-top-color:
            #fff;

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

    .toast-wrap {

        position:
            absolute;

        left:
            0;

        right:
            0;

        bottom:
            calc(
                26px +
                env(safe-area-inset-bottom, 0px)
            );

        display:
            flex;

        flex-direction:
            column;

        align-items:
            center;

        gap:
            8px;

        pointer-events:
            none;
    }


    .toast {

        display:
            flex;

        align-items:
            center;

        gap:
            10px;

        max-width:
            min(92vw, 440px);

        padding:
            11px 16px;

        border-radius:
            16px;

        background:
            var(--ic-toast);

        color:
            var(--ic-toast-text);

        font-size:
            14px;

        line-height:
            1.3;

        -webkit-backdrop-filter:
            blur(20px) saturate(180%);

        backdrop-filter:
            blur(20px) saturate(180%);

        box-shadow:
            0 12px 32px rgba(0,0,0,.28);

        opacity:
            0;

        transform:
            translateY(22px) scale(.95);

        transition:
            opacity .25s ease,
            transform .5s var(--spring);
    }


    .toast.in {

        opacity:
            1;

        transform:
            none;
    }


    .ti {

        flex:
            none;

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

        color:
            #fff;
    }


    .ti svg {

        stroke-width:
            3;
    }


    .toast.success .ti {

        background:
            var(--ic-ok);
    }


    .toast.error .ti {

        background:
            var(--ic-bad);
    }


    /* ======================================================
       MOBILE
       ====================================================== */

    @media (max-width: 520px) {

        .backdrop {

            align-items:
                flex-end;
        }


        .box {

            width:
                100%;

            max-width:
                100%;

            border-radius:
                22px 22px 0 0;

            transform:
                translateY(100%);
        }


        .backdrop.open .box {

            transform:
                none;
        }


        .view {

            padding-bottom:
                calc(
                    18px +
                    env(safe-area-inset-bottom, 0px)
                );
        }
    }


    @media (prefers-reduced-motion: reduce) {

        *,
        *::before,
        *::after {

            animation:
                none !important;

            transition-duration:
                .01ms !important;
        }
    }

    `;

    // Styles for the launcher button placed in the page header
    BK.LAUNCHER_CSS = `

        #bk-material-btn.bk-ic-launch {

            border:
                0;

            border-radius:
                980px;

            padding:
                4px 14px;

            font-size:
                12px;

            font-weight:
                500;

            line-height:
                1.6;

            font-family:
                -apple-system,
                BlinkMacSystemFont,
                "SF Pro Text",
                "Helvetica Neue",
                Arial,
                sans-serif;

            color:
                #fff;

            background:
                #0071e3;

            cursor:
                pointer;

            box-shadow:
                0 1px 3px rgba(0,0,0,.2);

            transition:
                filter .15s,
                transform .25s cubic-bezier(.34,1.45,.4,1),
                box-shadow .2s;
        }


        #bk-material-btn.bk-ic-launch:hover {

            filter:
                brightness(1.1);

            box-shadow:
                0 4px 12px rgba(0,113,227,.4);
        }


        #bk-material-btn.bk-ic-launch:active {

            transform:
                scale(.94);
        }


        #bk-material-btn.bk-ic-launch:focus-visible {

            outline:
                2px solid #0071e3;

            outline-offset:
                2px;
        }

        `;
})();
