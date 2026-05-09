const App = (() => {
    const encodedData = {
        cGhvbmVEYXRh: "KzQxJTIwNzglMjA2NDklMjA3OSUyMDQ1",
        ZW1haWxEYXRh: "dGFtYXMuZGFydmFzQGdtYWlsLmNvbQ==",
        "YWRkcmVzc0RhdGE=": "ODEzNCUyMEFkbGlzd2lsJTJDJTIwU3dpdHplcmxhbmQ="
    };

    const state = {};

    function init() {
        cacheDom();
        initNavigation();
        initScrollTop();
        initRevealAnimations();
        initContactReveal();
    }

    function cacheDom() {
        state.body = document.body;
        state.navToggle = document.querySelector(".nav-toggle");
        state.siteNav = document.querySelector(".site-nav");
        state.navLinks = document.querySelectorAll(".site-nav a");
        state.navOverlay = document.getElementById("nav-overlay");
        state.scrollTopButton = document.getElementById("scroll-to-top");
        state.revealItems = document.querySelectorAll("[data-reveal]");
        state.contactButtons = document.querySelectorAll(".reveal-contact");
    }

    function initNavigation() {
        if (!state.navToggle || !state.siteNav) {
            return;
        }

        state.navToggle.addEventListener("click", () => {
            const isOpen = state.siteNav.classList.toggle("is-open");
            state.navToggle.classList.toggle("is-open", isOpen);
            state.navToggle.setAttribute("aria-expanded", String(isOpen));
            state.navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
            state.body.classList.toggle("nav-open", isOpen);
        });

        state.navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                closeNavigation();
            });
        });

        if (state.navOverlay) {
            state.navOverlay.addEventListener("click", () => {
                closeNavigation();
            });
        }

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeNavigation();
                closeModal();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 900 && state.siteNav.classList.contains("is-open")) {
                closeNavigation();
            }
        });

        const sections = Array.from(state.navLinks)
            .map((link) => {
                const href = link.getAttribute("href");

                if (!href || !href.startsWith("#") || href.length === 1) {
                    return null;
                }

                return document.getElementById(href.slice(1));
            })
            .filter(Boolean);

        const observer = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (!visible) {
                return;
            }

            const activeId = `#${visible.target.id}`;
            state.navLinks.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === activeId);
            });
        }, {
            rootMargin: "-34% 0px -56% 0px",
            threshold: [0, 0.2, 0.45, 0.7]
        });

        sections.forEach((section) => observer.observe(section));
    }

    function closeNavigation() {
        if (!state.navToggle || !state.siteNav) {
            return;
        }

        state.siteNav.classList.remove("is-open");
        state.navToggle.classList.remove("is-open");
        state.navToggle.setAttribute("aria-expanded", "false");
        state.navToggle.setAttribute("aria-label", "Open navigation");
        state.body.classList.remove("nav-open");
    }

    function initScrollTop() {
        if (!state.scrollTopButton) {
            return;
        }

        window.addEventListener("scroll", () => {
            state.scrollTopButton.classList.toggle("visible", window.scrollY > 520);
        }, { passive: true });

        state.scrollTopButton.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    function initRevealAnimations() {
        if (!state.revealItems.length) {
            return;
        }

        if (!("IntersectionObserver" in window)) {
            state.revealItems.forEach((item) => item.classList.add("is-visible"));
            return;
        }

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: "0px 0px -12% 0px",
            threshold: 0.12
        });

        state.revealItems.forEach((item, index) => {
            item.style.transitionDelay = `${Math.min(index * 35, 180)}ms`;
            revealObserver.observe(item);
        });
    }

    function initContactReveal() {
        state.contactButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const dataKey = button.getAttribute("data-key");
                const label = button.querySelector("span")?.textContent || "Contact";
                const value = decodeContactValue(dataKey);
                showModal(label, value, button);
            });
        });

        document.addEventListener("click", (event) => {
            const modal = document.querySelector(".contact-modal");
            if (modal && event.target === modal) {
                closeModal();
            }
        });
    }

    function decodeContactValue(dataKey) {
        const encodedValue = encodedData[dataKey];

        if (!encodedValue) {
            return "Unavailable";
        }

        try {
            return decodeURIComponent(atob(encodedValue));
        } catch (error) {
            return "Unavailable";
        }
    }

    function showModal(title, content, triggerElement) {
        closeModal();

        const modal = document.createElement("div");
        modal.className = "contact-modal";
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");
        modal.setAttribute("aria-labelledby", "modal-title");

        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        const modalHeader = document.createElement("div");
        modalHeader.className = "modal-header";

        const heading = document.createElement("h3");
        heading.id = "modal-title";
        heading.textContent = title;

        const closeButton = document.createElement("button");
        closeButton.className = "modal-close";
        closeButton.type = "button";
        closeButton.setAttribute("aria-label", "Close contact dialog");
        closeButton.textContent = "x";
        closeButton.addEventListener("click", closeModal);

        const modalBody = document.createElement("div");
        modalBody.className = "modal-body";
        modalBody.tabIndex = 0;
        modalBody.textContent = content;

        modalHeader.append(heading, closeButton);
        modalContent.append(modalHeader, modalBody);
        modal.append(modalContent);
        document.body.append(modal);

        modal.dataset.triggerClass = triggerElement ? "set" : "";

        setTimeout(() => {
            modalContent.classList.add("show");
            closeButton.focus();
        }, 20);
    }

    function closeModal() {
        const modal = document.querySelector(".contact-modal");
        if (!modal) {
            return;
        }

        const content = modal.querySelector(".modal-content");
        content?.classList.remove("show");

        setTimeout(() => {
            modal.remove();
        }, 180);
    }

    return { init };
})();

document.addEventListener("DOMContentLoaded", App.init);
