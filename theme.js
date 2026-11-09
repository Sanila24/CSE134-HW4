"use strict";

(() => {
    const button = document.getElementById("theme-toggle");
    if (!button) return;

    const root = document.documentElement;
    const storageKey = "portfolio-theme";

    let currentTheme = "light";
    let switching = false;

    function applyTheme(theme) {
        currentTheme = theme;
        root.dataset.theme = theme;

        button.textContent = theme === "dark"
            ? "Switch to light theme"
            : "Switch to dark theme";
    }


    try {
        const savedTheme = localStorage.getItem(storageKey);

        if (savedTheme === "light" || savedTheme === "dark") {
            currentTheme = savedTheme;
        }
    } catch {

    }

    applyTheme(currentTheme);

    button.addEventListener("click", async () => {
        if (switching) return;
        switching = true;

        const nextTheme = currentTheme === "light" ? "dark" : "light";

        const update = () => {
            
            applyTheme(nextTheme);

            try {
                localStorage.setItem(storageKey, nextTheme);
            } catch {
                
            }
        };

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        try {
            if (
                typeof document.startViewTransition === "function" &&
                !reduceMotion
            ) {
                const transition = document.startViewTransition(update);

                transition.ready.catch(() => {});

                await transition.finished;
            } else {
                update();
            }
        } catch {
            update();
        } finally {
            switching = false;
        }
    });

    button.hidden = false;
})();