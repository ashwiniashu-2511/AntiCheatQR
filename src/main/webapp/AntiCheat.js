/*
 * ============================================================
 * CRYPTEX - ANTI CHEAT SYSTEM
 * INFOFEZ 2K26
 * A.V.V.M. Sri Pushpam College
 * ============================================================
 *
 * This file provides common client-side anti-cheat protection
 * for QR pages and Question pages.
 *
 * IMPORTANT:
 * Client-side protection alone is not enough.
 * Server-side validation will also be added later.
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
    // Configuration
    // ---------------------------------------------------------

    const CONFIG = {

        // Set to true only on pages where anti-cheat is required
        enabled: true,

        // Number of visibility changes allowed before
        // disqualification.
        //
        // 1 means the first tab switch/background event
        // will disqualify the participant.
        maxVisibilityChanges: 0,

        // Detect window losing focus.
        detectBlur: true,

        // Detect browser back/forward navigation.
        detectNavigation: true,

        // Disable right click.
        disableRightClick: true,

        // Disable text selection.
        disableSelection: true,

        // Disable copy/cut/paste.
        disableClipboard: true,

        // Disable common keyboard shortcuts.
        disableShortcuts: true
    };


    // ---------------------------------------------------------
    // Internal state
    // ---------------------------------------------------------

    let visibilityChanges = 0;
    let disqualified = false;


    // ---------------------------------------------------------
    // Utility
    // ---------------------------------------------------------

    function isEnabled() {

        return CONFIG.enabled &&
               !disqualified;

    }


    // ---------------------------------------------------------
    // Disqualification
    // ---------------------------------------------------------

    function disqualify(reason) {

        if (disqualified) {
            return;
        }

        disqualified = true;

        /*
         * Store the reason locally.
         * This will later also be sent to the servlet/database.
         */

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
        // Stop further interaction
        // -----------------------------------------------------

        document.body.innerHTML = "";

        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.background = "#080B16";
        document.body.style.color = "#F8FAFC";
        document.body.style.fontFamily =
            "Arial, sans-serif";


        const container = document.createElement("div");

        container.style.minHeight = "100vh";
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.justifyContent = "center";
        container.style.textAlign = "center";
        container.style.padding = "25px";
        container.style.boxSizing = "border-box";


        const box = document.createElement("div");

        box.style.width = "100%";
        box.style.maxWidth = "520px";
        box.style.padding = "35px 25px";
        box.style.boxSizing = "border-box";
        box.style.background = "#111827";
        box.style.border = "1px solid #F43F5E";
        box.style.borderRadius = "18px";
        box.style.boxShadow =
            "0 0 35px rgba(244,63,94,0.25)";


        const logo = document.createElement("div");

        logo.textContent = "CRYPTEX";

        logo.style.fontSize = "34px";
        logo.style.fontWeight = "800";
        logo.style.letterSpacing = "5px";
        logo.style.color = "#00F5D4";
        logo.style.marginBottom = "10px";


        const event = document.createElement("div");

        event.textContent = "INFOFEZ 2K26";

        event.style.fontSize = "14px";
        event.style.letterSpacing = "3px";
        event.style.color = "#94A3B8";
        event.style.marginBottom = "25px";


        const icon = document.createElement("div");

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


        const title = document.createElement("h1");

        title.textContent = "DISQUALIFIED";

        title.style.margin = "10px 0";
        title.style.fontSize = "30px";
        title.style.color = "#F43F5E";


        const message = document.createElement("p");

        message.textContent =
            "An invalid activity was detected. " +
            "Your CRYPTEX Round 1 attempt has been terminated.";

        message.style.color = "#F8FAFC";
        message.style.fontSize = "16px";
        message.style.lineHeight = "1.6";


        const reasonText = document.createElement("p");

        reasonText.textContent =
            "Reason: " + (reason || "Anti-cheat violation");

        reasonText.style.color = "#94A3B8";
        reasonText.style.fontSize = "13px";
        reasonText.style.marginTop = "20px";


        const footer = document.createElement("p");

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
    // Notify Register/Question servlet
    // ---------------------------------------------------------

    function notifyServer(reason) {

        try {

            const data = new URLSearchParams();

            data.append(
                "reason",
                reason || "Anti-cheat violation"
            );


            /*
             * AntiCheatServlet will be created later.
             *
             * If it does not exist yet, this request simply
             * fails silently.
             */

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


        // F12
        if (event.key === "F12") {

            event.preventDefault();

            disqualify(
                "Developer tools shortcut detected"
            );

            return;
        }


        // Ctrl / Cmd + U
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


        // Ctrl / Cmd + Shift + I
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


        // Ctrl / Cmd + Shift + J
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


        // Ctrl / Cmd + Shift + C
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


        // Ctrl / Cmd + C
        if (
            (event.ctrlKey || event.metaKey) &&
            key === "c"
        ) {

            event.preventDefault();

            return false;
        }


        // Ctrl / Cmd + X
        if (
            (event.ctrlKey || event.metaKey) &&
            key === "x"
        ) {

            event.preventDefault();

            return false;
        }


        // Ctrl / Cmd + V
        if (
            (event.ctrlKey || event.metaKey) &&
            key === "v"
        ) {

            event.preventDefault();

            return false;
        }


        // Ctrl / Cmd + P
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


        // Ctrl / Cmd + S
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


        // Alt + Left / Right
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

                    disqualify(
                        "Browser back/forward navigation detected"
                    );

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
    // Prevent drag
    // ---------------------------------------------------------

    function handleDragStart(event) {

        if (!isEnabled()) {
            return;
        }

        event.preventDefault();

        return false;
    }


    // ---------------------------------------------------------
    // Register event listeners
    // ---------------------------------------------------------

    function initialize() {

        if (!CONFIG.enabled) {
            return;
        }


        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );


        if (CONFIG.detectBlur) {

            window.addEventListener(
                "blur",
                handleBlur
            );
        }


        if (CONFIG.disableRightClick) {

            document.addEventListener(
                "contextmenu",
                handleContextMenu
            );
        }


        if (CONFIG.disableSelection) {

            document.addEventListener(
                "selectstart",
                handleSelectStart
            );
        }


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


        if (CONFIG.disableShortcuts) {

            document.addEventListener(
                "keydown",
                handleKeyDown
            );
        }


        document.addEventListener(
            "dragstart",
            handleDragStart
        );


        setupNavigationProtection();

        checkPreviousDisqualification();
    }


    // ---------------------------------------------------------
    // Start
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
    // Public API
    // ---------------------------------------------------------

    window.CRYPTEXAntiCheat = {

        disqualify: disqualify,

        isDisqualified: function () {
            return disqualified;
        },

        getVisibilityChanges: function () {
            return visibilityChanges;
        }

    };

})();