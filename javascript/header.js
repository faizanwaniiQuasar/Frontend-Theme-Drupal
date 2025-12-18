// scripts/header.js 
(function () {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    const body = document.body;
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".nav-toggle");
    const navList = document.querySelector(".nav-list");
    const navItems = Array.from(document.querySelectorAll(".nav-item"));
    const primaryMega =
      document.querySelector(".nav-list .mega") ||
      document.querySelector(".mega");

    if (!navList) {
      console.warn("header.js: .nav-list not found");
    }

    // Desktop / Tablet desktop mega logic
    let hideTimer = null;
    let activeMega = null;

    function computeHeaderTop() {
      const h = document.querySelector(".site-header");
      if (!h) return 0;
      const rect = h.getBoundingClientRect();
      return Math.ceil(rect.bottom);
    }

    function showPrimaryMega() {
      if (!primaryMega || window.matchMedia("(max-width:1024px)").matches)
        return;
      clearTimeout(hideTimer);
      primaryMega.style.top = `${computeHeaderTop()}px`;
      primaryMega.classList.add("mega--visible");
      activeMega = primaryMega;
    }

    function hidePrimaryMegaDelayed() {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        if (activeMega) {
          activeMega.classList.remove("mega--visible");
          activeMega.style.top = "";
          activeMega = null;
        }
        navItems.forEach((i) => i.classList.remove("hovered"));
      }, 140);
    }

    // show mega when pointer enters nav-list (desktop only)
    if (navList) {
      navList.addEventListener("mouseenter", () => {
        if (window.matchMedia("(max-width:1024px)").matches) return;
        showPrimaryMega();
      });

      navList.addEventListener("mouseleave", () => {
        if (window.matchMedia("(max-width:1024px)").matches) return;
        hidePrimaryMegaDelayed();
      });

      navList.addEventListener("mousemove", (ev) => {
        if (window.matchMedia("(max-width:1024px)").matches) return;
        const item = ev.target.closest(".nav-item");
        if (!item || !navList.contains(item)) {
          navItems.forEach((i) => i.classList.remove("hovered"));
          return;
        }
        navItems.forEach((i) => i.classList.remove("hovered"));
        item.classList.add("hovered");
      });
    }

    // keep mega open when hovering over it
    if (primaryMega) {
      primaryMega.addEventListener("mouseenter", () => clearTimeout(hideTimer));
      primaryMega.addEventListener("mouseleave", () =>
        hidePrimaryMegaDelayed()
      );
    }

    // keyboard focus support for nav items
    navItems.forEach((item) => {
      item.addEventListener("focusin", () => {
        navItems.forEach((i) => i.classList.remove("hovered"));
        item.classList.add("hovered");
        showPrimaryMega();
      });
      item.addEventListener("focusout", (ev) => {
        const related = ev.relatedTarget;
        if (primaryMega && related && primaryMega.contains(related)) return;
        item.classList.remove("hovered");
        hidePrimaryMegaDelayed();
      });

      // touch first-tap opens mega on desktop sizes
      const link = item.querySelector("a");
      if ("ontouchstart" in window && link) {
        let tapped = false;
        link.addEventListener(
          "click",
          (e) => {
            if (window.matchMedia("(max-width:1024px)").matches) return;
            if (!primaryMega) return;
            if (!tapped) {
              e.preventDefault();
              navItems.forEach((i) => i.classList.remove("hovered"));
              item.classList.add("hovered");
              showPrimaryMega();
              tapped = true;
              setTimeout(() => (tapped = false), 600);
            }
          },
          { passive: false }
        );
      }
    });

    // ESC closes desktop mega
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (activeMega) {
          activeMega.classList.remove("mega--visible");
          activeMega.style.top = "";
          activeMega = null;
        }
        navItems.forEach((i) => i.classList.remove("hovered"));
      }
    });

    // ---------- Mobile overlay (hamburger opens overlay at <=1024px) ----------
    // Build overlay only once and append to body
    let overlay = document.querySelector(".mobile-overlay");
    function getLogoSrc() {
      const logo = document.querySelector(".brand-logo");
      return logo ? logo.getAttribute("src") : "";
    }

    function createOverlayIfNeeded() {
      if (overlay) return overlay;
      overlay = document.createElement("div");
      overlay.className = "mobile-overlay";
      overlay.innerHTML = `
        <div class="overlay-top">
          <button class="close-btn" aria-label="Close menu">✕</button>
          <div class="overlay-logo"><a href="#" aria-label="Home"><img src="${getLogoSrc()}" alt="logo"></a></div>
          <div class="overlay-signup"><a class="btn1 btn-primary" href="#">Sign Up</a></div>
        </div>

        <div class="overlay-search">
          <div class="find-input">
            <input type="search" placeholder="Find a college or university ..." aria-label="Find">
            <button class="overlay-search-btn" aria-label="Search">🔍</button>
          </div>
        </div>

        <div class="overlay-location">
          <input type="text" placeholder="America" aria-label="Location">
          <button class="loc-btn" aria-label="Select location">📍</button>
        </div>

        <nav class="overlay-nav" aria-label="Mobile navigation"></nav>
      `;
      document.body.appendChild(overlay);

      // close button
      overlay.querySelector(".close-btn").addEventListener("click", () => {
        body.classList.remove("menu-open-mobile");
      });

      // clicking the overlay background closes
      overlay.addEventListener("click", (ev) => {
        if (ev.target === overlay) body.classList.remove("menu-open-mobile");
      });

      // ESC closes overlay
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          body.classList.remove("menu-open-mobile");
        }
      });
      return overlay;
    }

    function buildOverlayNav() {
      const ov = createOverlayIfNeeded();
      const container = ov.querySelector(".overlay-nav");
      container.innerHTML = "";

      if (primaryMega) {
        const cols = Array.from(primaryMega.querySelectorAll(".mega-col"));
        cols.forEach((col) => {
          const titleEl = col.querySelector("h4");
          const title = titleEl ? titleEl.textContent.trim() : "Menu";
          const ul = col.querySelector("ul")
            ? col.querySelector("ul").cloneNode(true)
            : null;

          const acc = document.createElement("div");
          acc.className = "accordion-item";
          acc.innerHTML = `
            <div class="accordion-header" role="button" aria-expanded="false" tabindex="0">
              <span>${escapeHtml(title)}</span>
              <span class="chev">▾</span>
            </div>
            <div class="accordion-panel"></div>
          `;
          container.appendChild(acc);
          const panel = acc.querySelector(".accordion-panel");
          if (ul) panel.appendChild(ul);

          // ensure panel starts closed and aria is false (default)
          acc
            .querySelector(".accordion-header")
            .setAttribute("aria-expanded", "false");
          // make sure ul inside has no bullets (CSS covers it, but also clear list-style)
          panel.querySelectorAll("ul").forEach((u) => {
            u.style.listStyle = "none";
            u.style.margin = "0";
            u.style.padding = "0";
          });
        });
      } else if (navList) {
        // fallback: build an accordion for the whole list but closed by default
        const acc = document.createElement("div");
        acc.className = "accordion-item";
        acc.innerHTML = `
          <div class="accordion-header" role="button" aria-expanded="false" tabindex="0">
            <span>Menu</span>
            <span class="chev">▾</span>
          </div>
          <div class="accordion-panel"></div>
        `;
        container.appendChild(acc);
        const panel = acc.querySelector(".accordion-panel");
        const clone = navList.cloneNode(true);
        // remove any nested mega from clone
        clone.querySelectorAll(".mega").forEach((m) => m.remove());
        panel.appendChild(clone);
        // ensure no bullets
        panel.querySelectorAll("ul").forEach((u) => {
          u.style.listStyle = "none";
          u.style.margin = "0";
          u.style.padding = "0";
        });
      }

      // attach accordion toggles
      const headers = container.querySelectorAll(".accordion-header");
      headers.forEach((h) => {
        h.addEventListener("click", () => {
          const expanded = h.getAttribute("aria-expanded") === "true";
          h.setAttribute("aria-expanded", String(!expanded));
          const panel = h.nextElementSibling;
          if (!expanded) panel.classList.add("open");
          else panel.classList.remove("open");
        });
        // keyboard support
        h.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            h.click();
          }
        });
      });
    }

    function escapeHtml(str) {
      return String(str).replace(/[&<>"']/g, function (m) {
        return {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[m];
      });
    }

    function openOverlay() {
      buildOverlayNav();
      body.classList.add("menu-open-mobile");
      // focus find input
      const firstInput = document.querySelector(
        '.mobile-overlay input[type="search"]'
      );
      if (firstInput) firstInput.focus();
    }
    function closeOverlay() {
      body.classList.remove("menu-open-mobile");
    }

    // hamburger toggle
    if (toggle) {
      toggle.addEventListener("click", (e) => {
        if (window.matchMedia("(max-width:1024px)").matches) {
          openOverlay();
        } else {
          const expanded = toggle.getAttribute("aria-expanded") === "true";
          toggle.setAttribute("aria-expanded", String(!expanded));
          document.body.classList.toggle("menu-open");
        }
      });
    }

    // header search forwards to overlay search on small screens
    const headerSearchBtn = document.querySelector(".search-btn");
    if (headerSearchBtn) {
      headerSearchBtn.addEventListener("click", (e) => {
        if (window.matchMedia("(max-width:1024px)").matches) {
          openOverlay();
        } else {
          // desktop behaviour unchanged
        }
      });
    }

    // cleanup: close overlay on resize to desktop
    window.addEventListener(
      "resize",
      () => {
        if (window.matchMedia("(min-width:1025px)").matches) {
          closeOverlay();
        }
        if (activeMega) activeMega.style.top = `${computeHeaderTop()}px`;
      },
      { passive: true }
    );
  } // init end
})();
// ===== Desktop Header Search Logic 
(function () {
  const header = document.querySelector(".site-header");
  const searchBtn = document.querySelector(".search-btn");
  const desktopSearch = document.querySelector(".desktop-search");
  const closeBtn = document.querySelector(".desktop-search__close");
  const findInput = document.querySelector(
    ".desktop-search__field--find input"
  );
  const suggestions = document.querySelector(".desktop-search__suggestions");

  if (!searchBtn || !desktopSearch) return;

  // Open search (desktop only)
  searchBtn.addEventListener("click", (e) => {
    if (window.matchMedia("(max-width:1024px)").matches) return;
    e.preventDefault();

    header.classList.add("search-open");
    desktopSearch.setAttribute("aria-hidden", "false");
    findInput.focus();
  });

  // Close search
  closeBtn.addEventListener("click", closeSearch);

  function closeSearch() {
    header.classList.remove("search-open");
    desktopSearch.setAttribute("aria-hidden", "true");
    suggestions.style.display = "none";
  }

  // ESC closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSearch();
  });

  // Show suggestions on focus
  findInput.addEventListener("focus", () => {
    suggestions.style.display = "block";
  });

  // Hide suggestions on outside click
  document.addEventListener("click", (e) => {
    if (!desktopSearch.contains(e.target) && !searchBtn.contains(e.target)) {
      closeSearch();
    }
  });

  // Select suggestion
  suggestions.querySelectorAll("li").forEach((item) => {
    item.addEventListener("click", () => {
      findInput.value = item.textContent;
      suggestions.style.display = "none";
    });
  });
})();
