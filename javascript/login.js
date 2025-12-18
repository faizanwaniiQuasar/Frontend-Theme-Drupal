// scripts/auth-modal.js
(function () {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else init();

  function init() {
    const modal = document.getElementById("authModal");
    if (!modal) return;

    const modalCard = modal.querySelector(".modal-card");
    const closeBtn = document.getElementById("authClose");
    const titleEl = document.getElementById("authTitle");
    const signupCheckbox = document.getElementById("signupCheckbox");
    const forgotLink = document.getElementById("forgotLink");
    const footerEl = document.getElementById("authFooter");
    const emailInput = document.getElementById("authEmail");
    const passwordInput = document.getElementById("authPassword");
    const pwToggle = document.getElementById("authPwToggle");
    const loginBtn = document.querySelector(".btn1.btn-outline"); // header login
    const signupBtn = document.querySelector(".btn1.btn-primary"); // header signup

    // helpers
    function openModal(mode = "login") {
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      if (mode === "signup") {
        titleEl.textContent = "Create your account";
        signupCheckbox.style.display = "block";
        if (forgotLink) forgotLink.style.display = "none";
        footerEl.innerHTML =
          'Already have an account? <a href="#" id="switchToSignin">Sign in</a> instead.<br>By proceeding you acknowledge and agree to our <a href="#">Privacy Policy</a> and <a href="#">Terms of Use</a>.';
      } else {
        titleEl.textContent = "Sign in to Niche";
        signupCheckbox.style.display = "none";
        if (forgotLink) forgotLink.style.display = "inline-block";
        footerEl.innerHTML =
          'Don\'t have an account yet? <a href="#" id="switchToSignup">Sign up</a> instead.<br>By proceeding you acknowledge and agree to our <a href="#">Privacy Policy</a> and <a href="#">Terms of Use</a>.';
      }

      // rebind switch links inside footer
      bindFooterSwitchLinks();

      // focus email
      setTimeout(() => {
        emailInput && emailInput.focus();
      }, 40);
    }

    function closeModal() {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      // restore focus to main signup/login in header
      if (document.activeElement === closeBtn) {
        // put focus back to signup if it exists, otherwise login
        (signupBtn || loginBtn) && (signupBtn || loginBtn).focus();
      }
    }

    // wire header buttons
    if (loginBtn) {
      loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openModal("login");
      });
    }
    if (signupBtn) {
      signupBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openModal("signup");
      });
    }

    // close actions
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    // footer-switch links rebinder
    function bindFooterSwitchLinks() {
      const sUp = footerEl.querySelector("#switchToSignup");
      if (sUp) {
        sUp.addEventListener("click", (ev) => {
          ev.preventDefault();
          openModal("signup");
        });
      }
      const sIn = footerEl.querySelector("#switchToSignin");
      if (sIn) {
        sIn.addEventListener("click", (ev) => {
          ev.preventDefault();
          openModal("login");
        });
      }
    }

    bindFooterSwitchLinks();

    // Password toggle (SVG swap via aria-pressed)
    if (pwToggle && passwordInput) {
      pwToggle.addEventListener("click", (e) => {
        e.preventDefault();
        const show = passwordInput.type === "password";
        passwordInput.type = show ? "text" : "password";
        pwToggle.setAttribute("aria-pressed", String(show));
        pwToggle.setAttribute(
          "aria-label",
          show ? "Hide password" : "Show password"
        );
      });
    }

    // prevent form default submit for demo (remove/replace with real submit)
    const form = document.getElementById("authForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        // handle signin/signup logic here or forward to server
        // For demo, we'll just close and log values
        console.log("Auth submit", {
          email: emailInput.value,
          password: passwordInput.value,
          signupOptIn: document.getElementById("signupOptIn")?.checked,
        });
        // closeModal(); // uncomment if you want to close after submit
      });
    }
  }
})();
