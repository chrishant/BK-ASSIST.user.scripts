(function (global) {

    function detectTechStack() {

        const score = {};
        const add = (name, value = 1) => {
            score[name] = (score[name] || 0) + value;
        };

        // -------------------------------
        // DETECTION LOGIC (same as before)
        // -------------------------------

        if (window.angular) add("AngularJS", 3);
        if (window.getAllAngularRootElements) add("Angular", 3);
        if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) add("React", 2);
        if (window.Vue) add("Vue", 2);
        if (window.$ || window.jQuery) add("jQuery", 1);

        const html = document.documentElement.innerHTML;

        if (html.includes("ng-app") || html.includes("ng-controller")) add("AngularJS", 2);
        if (html.includes("_ngcontent") || document.querySelector("app-root")) add("Angular", 2);
        if (html.includes("data-reactroot")) add("React", 2);
        if (html.includes("data-v-")) add("Vue", 2);

        Array.from(document.scripts).forEach(s => {
            const src = s.src || "";
            if (src.includes("angular")) add("AngularJS", 2);
            if (src.includes("react")) add("React", 2);
            if (src.includes("vue")) add("Vue", 2);
            if (src.includes("next")) add("Next.js", 3);
            if (src.includes("nuxt")) add("Nuxt.js", 3);
            if (src.includes("webpack") || src.includes("bundle") || src.includes("chunk")) {
                add("Modern Build", 1);
            }
        });

        if (window.__NEXT_DATA__) add("Next.js", 5);
        if (window.__NUXT__) add("Nuxt.js", 5);

        // -------------------------------
        // DECISION ENGINE
        // -------------------------------

        const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]);
        const top = sorted[0]?.[0];

        const verdictMap = {
            "Angular": "Modern Angular (TypeScript SPA)",
            "AngularJS": "AngularJS (Legacy v1)",
            "React": "React Application",
            "Vue": "Vue.js Application",
            "Next.js": "Next.js (React Framework)",
            "Nuxt.js": "Nuxt.js (Vue Framework)"
        };

        const verdict = verdictMap[top] || "Vanilla JavaScript / Server-rendered HTML";

        // -------------------------------
        // 🎨 STYLED CONSOLE OUTPUT
        // -------------------------------

        console.groupCollapsed(
            "%c🧠 Tech Stack Detector",
            "color: #4CAF50; font-weight: bold; font-size: 14px;"
        );

        console.log(
            "%c📌 Final Verdict:",
            "color: #2196F3; font-weight: bold;"
        );
        console.log(
            `%c${verdict}`,
            "color: #ffffff; background: #4CAF50; padding: 2px 6px; border-radius: 4px;"
        );

        console.log("");

        if (sorted.length) {
            console.log(
                "%c📊 Detection Scores:",
                "color: #FF9800; font-weight: bold;"
            );

            sorted.forEach(([name, val]) => {
                console.log(
                    `%c${name.padEnd(15)} → ${val}`,
                    "color: #ddd;"
                );
            });
        } else {
            console.log("%cNo strong signals detected", "color: red;");
        }

        console.log("");

        console.log(
            "%c🧾 Raw Data:",
            "color: #9C27B0; font-weight: bold;"
        );
        console.table(score);

        console.groupEnd();

        // -------------------------------
        // RETURN OBJECT
        // -------------------------------

        return {
            verdict,
            scores: sorted,
            raw: score
        };
    }

    global.detectTechStack = detectTechStack;

})(window);
