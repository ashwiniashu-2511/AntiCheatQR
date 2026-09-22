(function () {
    "use strict";

    /* =========================================================
       CRYPTEX 2K26 - ANTI CHEAT
       Anti-Cheat starts ONLY after Question page is fully loaded
       and remains active/visible for the activation period.
       ========================================================= */

    const CONFIG = {
        activationDelay: 2000,

        detectBlur: true,
        detectVisibility: true,
        detectNavigation: true,
        detectRefresh: true,

        disableRightClick: true,
        disableSelection: true,
        disableClipboard: true,
        disableShortcuts: true,
        disableDrag: true
    };

    let antiCheatReady = false;
    let disqualified = false;
    let allowedNavigation = false;
    let activationTimer = null;

    /* =========================================================
       ONLY QUESTION PAGES
       ========================================================= */

    function isQuestionPage() {
        const path = window.location.pathname;

        return (
            path.endsWith("/QuestionServlet") ||
            path.endsWith("/Question2Servlet") ||
            path.endsWith("/Question3Servlet") ||
            path.endsWith("/Question4Servlet") ||
            path.endsWith("/Question5Servlet")
        );
    }

    /* =========================================================
       DO NOTHING ON REGISTRATION / QR / RESULT PAGES
       ========================================================= */

    if (!isQuestionPage()) {
        return;
    }

    /* =========================================================
       CHECK IF ALREADY DISQUALIFIED
       ========================================================= */

    if (sessionStorage.getItem("cryptexDisqualified") === "true") {
        showDisqualifiedPage(
            sessionStorage.getItem("cryptexDisqualifyReason") ||
            "Anti-cheat violation detected"
        );
        return;
    }

    /* =========================================================
       DISQUALIFICATION
       ========================================================= */

    function disqualify(reason) {

        /* Anti-cheat MUST be active first */
        if (!antiCheatReady) {
            return;
        }

        if (disqualified) {
            return;
        }

        if (allowedNavigation) {
            return;
        }

        disqualified = true;

        reason = reason || "Anti-cheat violation detected";

        sessionStorage.setItem(
            "cryptexDisqualified",
            "true"
        );

        sessionStorage.setItem(
            "cryptexDisqualifyReason",
            reason
        );

        /* Notify server */
        notifyServer(reason);

        /* Show disqualified screen */
        showDisqualifiedPage(reason);
    }

    /* =========================================================
       SEND DISQUALIFICATION TO SERVER
       ========================================================= */

    function notifyServer(reason) {

        try {

            const body =
                "reason=" +
                encodeURIComponent(reason);

            fetch("AntiCheatServlet", {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                },
                body: body,
                credentials: "same-origin",
                keepalive: true
            }).catch(function () {
                /* Ignore network error */
            });

        } catch (e) {
            console.error(e);
        }
    }

    /* =========================================================
       DISQUALIFIED PAGE
       ========================================================= */

    function showDisqualifiedPage(reason) {

        document.documentElement.innerHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>CRYPTEX - Disqualified</title>

    <style>

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            min-height: 100vh;

            display: flex;
            align-items: center;
            justify-content: center;

            background:
                radial-gradient(
                    circle at top,
                    #1a1020,
                    #080B16 60%
                );

            color: #F8FAFC;

            font-family:
                Arial,
                Helvetica,
                sans-serif;

            text-align: center;

            padding: 20px;
        }

        .box {
            width: 100%;
            max-width: 430px;

            background: #111827;

            border: 1px solid #F43F5E;

            border-radius: 20px;

            padding: 35px 25px;

            box-shadow:
                0 0 30px
                rgba(244, 63, 94, 0.25);

            animation: appear 0.5s ease-out;
        }

        .icon {
            width: 80px;
            height: 80px;

            margin: 0 auto 20px;

            border-radius: 50%;

            display: flex;
            align-items: center;
            justify-content: center;

            background: rgba(244, 63, 94, 0.12);

            border: 2px solid #F43F5E;

            font-size: 40px;
        }

        h1 {
            margin: 0 0 12px;

            color: #F43F5E;

            font-size: 27px;

            letter-spacing: 1px;
        }

        p {
            margin: 8px 0;

            color: #CBD5E1;

            line-height: 1.6;
        }

        .event {
            margin-top: 22px;

            color: #00F5D4;

            font-weight: bold;

            letter-spacing: 2px;
        }

        @keyframes appear {

            from {
                opacity: 0;
                transform: scale(0.92);
            }

            to {
                opacity: 1;
                transform: scale(1);
            }

        }

    </style>
</head>

<body>

    <div class="box">

        <div class="icon">
            ⚠️
        </div>

        <h1>DISQUALIFIED</h1>

        <p>
            Anti-cheat violation detected.
        </p>

        <p>
            You cannot continue this round.
        </p>

        <div class="event">
            CRYPTEX 2K26
        </div>

    </div>

</body>
</html>
        `;

        /* Stop everything */
        document
            .querySelectorAll("script")
            .forEach(function (script) {
                if (script !== document.currentScript) {
                    script.remove();
                }
            });
    }

    /* =========================================================
       RIGHT CLICK
       ========================================================= */

    function setupRightClick() {

        if (!CONFIG.disableRightClick) {
            return;
        }

        document.addEventListener(
            "contextmenu",
            function (event) {

                if (!antiCheatReady) {
                    return;
                }

                event.preventDefault();

                disqualify(
                    "Right-click detected"
                );

            },
            true
        );
    }

    /* =========================================================
       TEXT SELECTION
       ========================================================= */

    function setupSelection() {

        if (!CONFIG.disableSelection) {
            return;
        }

        document.addEventListener(
            "selectstart",
            function (event) {

                if (!antiCheatReady) {
                    return;
                }

                event.preventDefault();

            },
            true
        );
    }

    /* =========================================================
       CLIPBOARD
       ========================================================= */

    function setupClipboard() {

        if (!CONFIG.disableClipboard) {
            return;
        }

        ["copy", "cut", "paste"].forEach(
            function (eventName) {

                document.addEventListener(
                    eventName,
                    function (event) {

                        if (!antiCheatReady) {
                            return;
                        }

                        event.preventDefault();

                        disqualify(
                            eventName.toUpperCase() +
                            " action detected"
                        );

                    },
                    true
                );

            }
        );
    }

    /* =========================================================
       KEYBOARD SHORTCUTS
       ========================================================= */

    function setupShortcuts() {

        if (!CONFIG.disableShortcuts) {
            return;
        }

        document.addEventListener(
            "keydown",
            function (event) {

                if (!antiCheatReady) {
                    return;
                }

                const key =
                    event.key.toLowerCase();

                /* F12 */
                if (event.key === "F12") {

                    event.preventDefault();

                    disqualify(
                        "Developer tools shortcut detected"
                    );

                    return;
                }

                /* Ctrl + R */
                if (
                    event.ctrlKey &&
                    key === "r"
                ) {

                    event.preventDefault();

                    disqualify(
                        "Refresh shortcut detected"
                    );

                    return;
                }

                /* F5 */
                if (event.key === "F5") {

                    event.preventDefault();

                    disqualify(
                        "Refresh shortcut detected"
                    );

                    return;
                }

                /* Alt + Left */
                if (
                    event.altKey &&
                    event.key === "ArrowLeft"
                ) {

                    event.preventDefault();

                    disqualify(
                        "Back navigation detected"
                    );

                    return;
                }

                /* Alt + Right */
                if (
                    event.altKey &&
                    event.key === "ArrowRight"
                ) {

                    event.preventDefault();

                    disqualify(
                        "Forward navigation detected"
                    );

                    return;
                }

                /* Ctrl + U */
                if (
                    event.ctrlKey &&
                    key === "u"
                ) {

                    event.preventDefault();

                    disqualify(
                        "View-source shortcut detected"
                    );

                    return;
                }

                /* Ctrl + S */
                if (
                    event.ctrlKey &&
                    key === "s"
                ) {

                    event.preventDefault();

                    disqualify(
                        "Save shortcut detected"
                    );

                    return;
                }

            },
            true
        );
    }

    /* =========================================================
       BLUR
       IMPORTANT:
       THIS LISTENER IS ADDED ONLY AFTER ACTIVATION.
       ========================================================= */

    function setupBlur() {

        if (!CONFIG.detectBlur) {
            return;
        }

        window.addEventListener(
            "blur",
            function () {

                if (!antiCheatReady) {
                    return;
                }

                if (allowedNavigation) {
                    return;
                }

                disqualify(
                    "Browser/app focus lost"
                );

            },
            true
        );
    }

    /* =========================================================
       VISIBILITY
       IMPORTANT:
       THIS LISTENER IS ADDED ONLY AFTER ACTIVATION.
       ========================================================= */

    function setupVisibility() {

        if (!CONFIG.detectVisibility) {
            return;
        }

        document.addEventListener(
            "visibilitychange",
            function () {

                if (!antiCheatReady) {
                    return;
                }

                if (allowedNavigation) {
                    return;
                }

                if (
                    document.visibilityState ===
                    "hidden"
                ) {

                    disqualify(
                        "Question page left"
                    );

                }

            },
            true
        );
    }

    /* =========================================================
       BACK / FORWARD NAVIGATION
       ========================================================= */

    function setupNavigation() {

        if (!CONFIG.detectNavigation) {
            return;
        }

        history.pushState(
            null,
            "",
            window.location.href
        );

        window.addEventListener(
            "popstate",
            function () {

                if (!antiCheatReady) {
                    return;
                }

                if (allowedNavigation) {
                    return;
                }

                disqualify(
                    "Back/forward navigation detected"
                );

            },
            true
        );
    }

    /* =========================================================
       LINK CLICK
       ========================================================= */

    function setupLinks() {

        document.addEventListener(
            "click",
            function (event) {

                if (!antiCheatReady) {
                    return;
                }

                const link =
                    event.target.closest("a");

                if (!link) {
                    return;
                }

                if (allowedNavigation) {
                    return;
                }

                const href =
                    link.getAttribute("href");

                if (!href) {
                    return;
                }

                /*
                 * Internal navigation is allowed only when
                 * explicitly enabled by the application.
                 */
                if (
                    href.includes("ResultServlet")
                ) {
                    allowedNavigation = true;
                    return;
                }

                event.preventDefault();

                disqualify(
                    "Unauthorized page navigation"
                );

            },
            true
        );
    }

    /* =========================================================
       FORM SUBMISSION
       ========================================================= */

    function setupForms() {

        document.addEventListener(
            "submit",
            function () {

                if (!antiCheatReady) {
                    return;
                }

                /*
                 * Question answer submission is allowed.
                 */
                allowedNavigation = true;

            },
            true
        );
    }

    /* =========================================================
       DRAG
       ========================================================= */

    function setupDrag() {

        if (!CONFIG.disableDrag) {
            return;
        }

        document.addEventListener(
            "dragstart",
            function (event) {

                if (!antiCheatReady) {
                    return;
                }

                event.preventDefault();

            },
            true
        );
    }

    /* =========================================================
       REFRESH DETECTION
       IMPORTANT:
       CHECK ONLY AFTER ANTI-CHEAT ACTIVATES.
       ========================================================= */

    function setupRefreshProtection() {

        if (!CONFIG.detectRefresh) {
            return;
        }

        const navigationEntries =
            performance.getEntriesByType(
                "navigation"
            );

        if (
            navigationEntries.length > 0 &&
            navigationEntries[0].type === "reload"
        ) {

            disqualify(
                "Page refresh detected"
            );

        }

    }

    /* =========================================================
       ACTIVATE ANTI-CHEAT
       ========================================================= */

    function activateAntiCheat() {

        /*
         * Do not activate if page is not visible.
         */
        if (
            document.visibilityState !==
            "visible"
        ) {
            waitForStableActivation();
            return;
        }

        /*
         * Mobile browsers can report focus slightly late.
         * Therefore visibility is the primary requirement.
         */

        antiCheatReady = true;

        /*
         * ONLY NOW attach blur / visibility listeners.
         * This is the important fix.
         */

        setupBlur();
        setupVisibility();

        setupNavigation();
        setupLinks();
        setupForms();

        setupRefreshProtection();

        console.log(
            "CRYPTEX Anti-Cheat ACTIVATED"
        );
    }

    /* =========================================================
       WAIT UNTIL QUESTION PAGE IS STABLE
       ========================================================= */

    function waitForStableActivation() {

        clearTimeout(activationTimer);

        activationTimer = setTimeout(
            function () {

                if (
                    document.visibilityState ===
                    "visible"
                ) {

                    activateAntiCheat();

                } else {

                    waitForStableActivation();

                }

            },
            CONFIG.activationDelay
        );
    }

    /* =========================================================
       INITIALIZATION
       ========================================================= */

    function initialize() {

        /*
         * These protections are safe to install immediately
         * because they NEVER disqualify before activation.
         */

        setupRightClick();
        setupSelection();
        setupClipboard();
        setupShortcuts();
        setupDrag();

        /*
         * IMPORTANT:
         * Do NOT install blur or visibility here.
         */

        waitForStableActivation();
    }

    /* =========================================================
       PAGE LOAD
       ========================================================= */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            { once: true }
        );

    } else {

        initialize();

    }

})();