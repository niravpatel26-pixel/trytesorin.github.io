(function () {
  const btn = document.querySelector(".menu-btn");
  const overlay = document.getElementById("menu-overlay");

  if (btn && overlay) {
    const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    let lastFocus = null;

    function setOpen(open) {
      overlay.dataset.open = open ? "true" : "false";
      overlay.setAttribute("aria-hidden", open ? "false" : "true");
      btn.setAttribute("aria-expanded", open ? "true" : "false");

      document.documentElement.classList.toggle("menu-open", open);
      document.body.classList.toggle("menu-open", open);

      try { overlay.inert = !open; } catch (e) {}

      if (open) {
        lastFocus = document.activeElement;
        const first = overlay.querySelector(focusableSelector);
        if (first) setTimeout(() => first.focus(), 0);
      } else {
        if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
        lastFocus = null;
      }
    }

    function isOpen() {
      return overlay.dataset.open === "true";
    }

    // Init closed
    try { overlay.inert = true; } catch (e) {}

    btn.addEventListener("click", () => setOpen(!isOpen()));

    overlay.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.getAttribute && t.getAttribute("data-close") === "true") setOpen(false);
    });

    overlay.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("keydown", (e) => {
      if (!isOpen()) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }

      if (e.key === "Tab") {
        const nodes = Array.from(overlay.querySelectorAll(focusableSelector))
          .filter((el) => el.offsetParent !== null);

        if (!nodes.length) return;

        const first = nodes[0];
        const last = nodes[nodes.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 880 && isOpen()) setOpen(false);
    });
  }

  // Optional: auto-active desktop nav link
  const primaryNav = document.querySelector('nav[aria-label="Primary"]');
  if (primaryNav) {
    const path = (window.location.pathname || "/").replace(/\/+$/, "") || "/";
    primaryNav.querySelectorAll("a").forEach((a) => {
      if (a.classList.contains("highlight")) return;
      const href = (a.getAttribute("href") || "").split("?")[0].replace(/\/+$/, "");
      if (!href) return;
      if (href === path) a.classList.add("is-active");
    });
  }

  // Waitlist focus helper (safe on non-index pages)
  const params = new URLSearchParams(window.location.search);
  if (params.get("focus") === "waitlist") {
    setTimeout(() => {
      const el = document.getElementById("waitlist-form-email");
      if (el) el.focus();
    }, 50);
  }
})();
