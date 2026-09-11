/*
 * ============================================================
 * CRYPTEX - ANTI CHEAT SYSTEM
 * INFOFEZ 2K26
 * A.V.V.M. Sri Pushpam College
 * ============================================================
 *
 * Anti-cheat is ACTIVE ONLY on Question pages.
 *
 * QR scanning / QR station pages are NOT protected.
 *
 * Flow:
 * QR -> Question -> Submit -> QR -> Question
 *
 * ============================================================
 */

(function () {

    "use strict";

    // ---------------------------------------------------------
    // Prevent duplicate initialization
    // ---------------------------------------------------------

    if (window.__CRYPTEX_ANTICHEAT_INITIALIZED__) {
        return;
    }

    window.__CRYPTEX_ANTICHEAT_INITIALIZED__ = true;


    // ---------------------------------------------------------
    // Detect whether this is a Question page
    // ---------------------------------------------------------

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


    // ---------------------------------------------------------
    // IMPORTANT
    //
    // If this is QR page / Registration / Result page,
    // DO NOT activate anti-cheat.
    // ---------------------------------------------------------

    if (!isQuestionPage()) {

        console.log(
            "CRYPTEX Anti-Cheat: OFF - QR/normal page"
        );

        return;
    }


    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const CONFIG = {

        // Anti-cheat is enabled on Question pages
        enabled: true,

        // First tab switch / background event = disqualification
        maxVisibilityChanges: 0,

        // Detect leaving the question window
        detectBlur: true,

        // Detect browser back/forward
        detectNavigation: true,

        // Disable right click
        disableRightClick: true,

        // Disable text selection
        disableSelection: true,

        // Disable copy/cut/paste
        disableClipboard: true,

        // Keyboard shortcut protection
        disableShortcuts: true,

        // Prevent dragging content
        disableDrag: true
    };


    // ---------------------------------------------------------
    // Internal state
    // ---------------------------------------------------------

    let visibilityChanges = 0;
    let disqualified = false;

    // Becomes true when participant submits the question.
    //
    // This prevents the submit -> next QR transition
    // from being treated as cheating.
    let allowedNavigation = false;


    // ---------------------------------------------------------
    // Utility
    // ---------------------------------------------------------

    function isEnabled() {

        return (
            CONFIG.enabled &&
            !disqualified
        );
    }


    // ---------------------------------------------------------
    // Mark legitimate question submission
    // ---------------------------------------------------------

    function allowNavigation() {

        allowedNavigation = true;

        console.log(
            "CRYPTEX: Legitimate question submission detected."
        );
    }


    // ---------------------------------------------------------
    // Disqualification
    // ---------------------------------------------------------

    function disqualify(reason) {

        if (disqualified) {
            return;
        }

        // If participant is legitimately submitting the question,
        // do not disqualify.
        if (allowedNavigation) {
            return;
        }

        disqualified = true;


        // -----------------------------------------------------
        // Store disqualification state
        // -----------------------------------------------------

        try {

            sessionStorage.setItem(
                "cryptexDisqualified",
                "true"
            );

            sessionStorage.setItem(
                "cryptexDisqualifyReason",
                reason || "Anti-cheat violation"
            );

        } catch (error) {

            console.warn(
                "Could not save disqualification state.",
                error
            );
        }


        // -----------------------------------------------------
        // Show disqualified screen
        // -----------------------------------------------------

        document.body.innerHTML = "";

        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.background = "#080B16";
        document.body.style.color = "#F8FAFC";
        document.body.style.fontFamily =
            "Arial, sans-serif";


        const container =
            document.createElement("div");

        container.style.minHeight = "100vh";
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.justifyContent = "center";
        container.style.textAlign = "center";
        container.style.padding = "25px";
        container.style.boxSizing = "border-box";


        const box =
            document.createElement("div");

        box.style.width = "100%";
        box.style.maxWidth = "520px";
        box.style.padding = "35px 25px";
        box.style.boxSizing = "border-box";
        box.style.background = "#111827";
        box.style.border = "1px solid #F43F5E";
        box.style.borderRadius = "18px";
        box.style.boxShadow =
            "0 0 35px rgba(244,63,94,0.25)";


        const logo =
            document.createElement("div");

        logo.textContent = "CRYPTEX";

        logo.style.fontSize = "34px";
        logo.style.fontWeight = "800";
        logo.style.letterSpacing = "5px";
        logo.style.color = "#00F5D4";
        logo.style.marginBottom = "10px";


        const event =
            document.createElement("div");

        event.textContent = "INFOFEZ 2K26";

        event.style.fontSize = "14px";
        event.style.letterSpacing = "3px";
        event.style.color = "#94A3B8";
        event.style.marginBottom = "25px";


        const icon =
            document.createElement("div");

        icon.textContent = "✕";

        icon.style.width = "70px";
        icon.style.height = "70px";
        icon.style.margin = "0 auto 20px";
        icon.style.borderRadius = "50%";
        icon.style.display = "flex";
        icon.style.alignItems = "center";
        icon.style.justifyContent = "center";
        icon.style.fontSize = "38px";
        icon.style.fontWeight = "bold";
        icon.style.color = "#F43F5E";
        icon.style.border = "2px solid #F43F5E";


        const title =
            document.createElement("h1");

        title.textContent = "DISQUALIFIED";

        title.style.margin = "10px 0";
        title.style.fontSize = "30px";
        title.style.color = "#F43F5E";


        const message =
            document.createElement("p");

        message.textContent =
            "An invalid activity was detected. " +
            "Your CRYPTEX Round 1 attempt has been terminated.";

        message.style.color = "#F8FAFC";
        message.style.fontSize = "16px";
        message.style.lineHeight = "1.6";


        const reasonText =
            document.createElement("p");

        reasonText.textContent =
            "Reason: " +
            (reason || "Anti-cheat violation");

        reasonText.style.color = "#94A3B8";
        reasonText.style.fontSize = "13px";
        reasonText.style.marginTop = "20px";


        const footer =
            document.createElement("p");

        footer.textContent =
            "A.V.V.M. Sri Pushpam College";

        footer.style.color = "#64748B";
        footer.style.fontSize = "12px";
        footer.style.marginTop = "30px";


        box.appendChild(logo);
        box.appendChild(event);
        box.appendChild(icon);
        box.appendChild(title);
        box.appendChild(message);
        box.appendChild(reasonText);
        box.appendChild(footer);

        container.appendChild(box);

        document.body.appendChild(container);


        // -----------------------------------------------------
        // Notify server
        // -----------------------------------------------------

        notifyServer(reason);
    }


    // ---------------------------------------------------------
    // Notify server / database
    // ---------------------------------------------------------

    function notifyServer(reason) {

        try {

            const data =
                new URLSearchParams();

            data.append(
                "reason",
                reason || "Anti-cheat violation"
            );


            fetch("AntiCheatServlet", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                },

                body: data.toString(),

                credentials: "same-origin",

                keepalive: true

            }).catch(function (error) {

                console.warn(
                    "Anti-cheat server notification failed.",
                    error
                );

            });

        } catch (error) {

            console.warn(
                "Could not notify anti-cheat servlet.",
                error
            );
        }
    }


    // ---------------------------------------------------------
    // Check previous disqualification
    // ---------------------------------------------------------

    function checkPreviousDisqualification() {

        try {

            const previousState =
                sessionStorage.getItem(
                    "cryptexDisqualified"
                );


            if (previousState === "true") {

                const previousReason =
                    sessionStorage.getItem(
                        "cryptexDisqualifyReason"
                    );


                disqualify(
                    previousReason ||
                    "Previous anti-cheat violation"
                );
            }

        } catch (error) {

            console.warn(
                "Could not check previous state.",
                error
            );
        }
    }


    // ---------------------------------------------------------
    // TAB SWITCH / APP BACKGROUND DETECTION
    // ---------------------------------------------------------

    function handleVisibilityChange() {

        if (!isEnabled()) {
            return;
        }


        if (document.hidden) {

            visibilityChanges++;


            if (
                visibilityChanges >
                CONFIG.maxVisibilityChanges
            ) {

                disqualify(
                    "Leaving the CRYPTEX challenge page"
                );
            }
        }
    }


    // ---------------------------------------------------------
    // WINDOW BLUR
    // ---------------------------------------------------------

    function handleBlur() {

        if (!isEnabled()) {
            return;
        }


        if (CONFIG.detectBlur) {

            disqualify(
                "Leaving the CRYPTEX challenge window"
            );
        }
    }


    // ---------------------------------------------------------
    // RIGHT CLICK
    // ---------------------------------------------------------

    function handleContextMenu(event) {

        if (!isEnabled()) {
            return;
        }


        if (CONFIG.disableRightClick) {

            event.preventDefault();

            return false;
        }
    }


    // ---------------------------------------------------------
    // TEXT SELECTION
    // ---------------------------------------------------------

    function handleSelectStart(event) {

        if (!isEnabled()) {
            return;
        }


        if (CONFIG.disableSelection) {

            event.preventDefault();

            return false;
        }
    }


    // ---------------------------------------------------------
    // COPY / CUT / PASTE
    // ---------------------------------------------------------

    function handleClipboard(event) {

        if (!isEnabled()) {
            return;
        }


        if (CONFIG.disableClipboard) {

            event.preventDefault();

            return false;
        }
    }


    // ---------------------------------------------------------
    // KEYBOARD SHORTCUTS
    // ---------------------------------------------------------

    function handleKeyDown(event) {

        if (!isEnabled()) {
            return;
        }


        if (!CONFIG.disableShortcuts) {
            return;
        }


        const key =
            event.key.toLowerCase();


        // -----------------------------------------------------
        // F12
        // -----------------------------------------------------

        if (event.key === "F12") {

            event.preventDefault();

            disqualify(
                "Developer tools shortcut detected"
            );

            return;
        }


        // -----------------------------------------------------
        // Ctrl / Cmd + U
        // -----------------------------------------------------

        if (
            (event.ctrlKey || event.metaKey) &&
            key === "u"
        ) {

            event.preventDefault();

            disqualify(
                "Page source shortcut detected"
            );

            return;
        }


        // -----------------------------------------------------
        // Ctrl / Cmd + Shift + I
        // -----------------------------------------------------

        if (
            (event.ctrlKey || event.metaKey) &&
            event.shiftKey &&
            key === "i"
        ) {

            event.preventDefault();

            disqualify(
                "Developer tools shortcut detected"
            );

            return;
        }


        // -----------------------------------------------------
        // Ctrl / Cmd + Shift + J
        // -----------------------------------------------------

        if (
            (event.ctrlKey || event.metaKey) &&
            event.shiftKey &&
            key === "j"
        ) {

            event.preventDefault();

            disqualify(
                "Developer console shortcut detected"
            );

            return;
        }


        // -----------------------------------------------------
        // Ctrl / Cmd + Shift + C
        // -----------------------------------------------------

        if (
            (event.ctrlKey || event.metaKey) &&
            event.shiftKey &&
            key === "c"
        ) {

            event.preventDefault();

            disqualify(
                "Developer tools shortcut detected"
            );

            return;
        }


        // -----------------------------------------------------
        // Ctrl / Cmd + C
        // -----------------------------------------------------

        if (
            (event.ctrlKey || event.metaKey) &&
            key === "c"
        ) {

            event.preventDefault();

            return false;
        }


        // -----------------------------------------------------
        // Ctrl / Cmd + X
        // -----------------------------------------------------

        if (
            (event.ctrlKey || event.metaKey) &&
            key === "x"
        ) {

            event.preventDefault();

            return false;
        }


        // -----------------------------------------------------
        // Ctrl / Cmd + V
        // -----------------------------------------------------

        if (
            (event.ctrlKey || event.metaKey) &&
            key === "v"
        ) {

            event.preventDefault();

            return false;
        }


        // -----------------------------------------------------
        // Ctrl / Cmd + P
        // -----------------------------------------------------

        if (
            (event.ctrlKey || event.metaKey) &&
            key === "p"
        ) {

            event.preventDefault();

            disqualify(
                "Print shortcut detected"
            );

            return;
        }


        // -----------------------------------------------------
        // Ctrl / Cmd + S
        // -----------------------------------------------------

        if (
            (event.ctrlKey || event.metaKey) &&
            key === "s"
        ) {

            event.preventDefault();

            disqualify(
                "Save page shortcut detected"
            );

            return;
        }


        // -----------------------------------------------------
        // Alt + Left / Right
        // -----------------------------------------------------

        if (
            event.altKey &&
            (
                event.key === "ArrowLeft" ||
                event.key === "ArrowRight"
            )
        ) {

            event.preventDefault();

            disqualify(
                "Browser navigation attempt detected"
            );

            return;
        }
    }


    // ---------------------------------------------------------
    // BROWSER BACK / FORWARD
    // ---------------------------------------------------------

    function setupNavigationProtection() {

        if (!CONFIG.detectNavigation) {
            return;
        }


        try {

            history.pushState(
                null,
                "",
                window.location.href
            );


            window.addEventListener(
                "popstate",
                function () {

                    if (!allowedNavigation) {

                        disqualify(
                            "Browser back/forward navigation detected"
                        );
                    }

                }
            );

        } catch (error) {

            console.warn(
                "Navigation protection unavailable.",
                error
            );
        }
    }


    // ---------------------------------------------------------
    // PAGE REFRESH DETECTION
    // ---------------------------------------------------------

    function setupRefreshProtection() {

        try {

            const navigation =
                performance.getEntriesByType(
                    "navigation"
                )[0];


            if (
                navigation &&
                navigation.type === "reload"
            ) {

                disqualify(
                    "Page refresh detected"
                );
            }

        } catch (error) {

            console.warn(
                "Refresh detection unavailable.",
                error
            );
        }
    }


    // ---------------------------------------------------------
    // FORM SUBMISSION
    //
    // Question submission is legitimate.
    // Therefore allow navigation before submit.
    // ---------------------------------------------------------

    function setupFormProtection() {

        document.addEventListener(
            "submit",
            function () {

                allowNavigation();

            },
            true
        );
    }


    // ---------------------------------------------------------
    // LINK NAVIGATION
    //
    // If participant manually clicks another page while
    // answering, treat it as leaving the challenge.
    //
    // Question form submission is already marked as allowed.
    // ---------------------------------------------------------

    function setupLinkProtection() {

        document.addEventListener(
            "click",
            function (event) {

                if (!isEnabled()) {
                    return;
                }


                const link =
                    event.target.closest("a");


                if (!link) {
                    return;
                }


                const href =
                    link.getAttribute("href");


                if (!href) {
                    return;
                }


                if (
                    href.startsWith("#") ||
                    href.startsWith("javascript:")
                ) {
                    return;
                }


                disqualify(
                    "Leaving the CRYPTEX challenge page"
                );

            },
            true
        );
    }


    // ---------------------------------------------------------
    // PREVENT DRAG
    // ---------------------------------------------------------

    function handleDragStart(event) {

        if (!isEnabled()) {
            return;
        }


        if (CONFIG.disableDrag) {

            event.preventDefault();

            return false;
        }
    }


    // ---------------------------------------------------------
    // REGISTER EVENT LISTENERS
    // ---------------------------------------------------------

    function initialize() {

        if (!CONFIG.enabled) {
            return;
        }


        // Check whether already disqualified
        checkPreviousDisqualification();


        // Detect refresh
        setupRefreshProtection();


        // Detect tab/app switching
        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );


        // Detect losing browser focus
        if (CONFIG.detectBlur) {

            window.addEventListener(
                "blur",
                handleBlur
            );
        }


        // Right click
        if (CONFIG.disableRightClick) {

            document.addEventListener(
                "contextmenu",
                handleContextMenu
            );
        }


        // Selection
        if (CONFIG.disableSelection) {

            document.addEventListener(
                "selectstart",
                handleSelectStart
            );
        }


        // Clipboard
        if (CONFIG.disableClipboard) {

            document.addEventListener(
                "copy",
                handleClipboard
            );

            document.addEventListener(
                "cut",
                handleClipboard
            );

            document.addEventListener(
                "paste",
                handleClipboard
            );
        }


        // Keyboard shortcuts
        if (CONFIG.disableShortcuts) {

            document.addEventListener(
                "keydown",
                handleKeyDown
            );
        }


        // Drag
        document.addEventListener(
            "dragstart",
            handleDragStart
        );


        // Browser back/forward
        setupNavigationProtection();


        // Question form
        setupFormProtection();


        // Links
        setupLinkProtection();


        console.log(
            "CRYPTEX Anti-Cheat: ACTIVE - Question page"
        );
    }


    // ---------------------------------------------------------
    // START
    // ---------------------------------------------------------

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();
    }


    // ---------------------------------------------------------
    // PUBLIC API
    // ---------------------------------------------------------

    window.CRYPTEXAntiCheat = {

        disqualify: disqualify,

        isDisqualified: function () {
            return disqualified;
        },

        getVisibilityChanges: function () {
            return visibilityChanges;
        },

        allowNavigation: allowNavigation

    };

})();