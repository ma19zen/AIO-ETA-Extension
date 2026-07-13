// ETA All-in-One - Copy/Paste Bypass
// Merged from: MMM eta copy extension + Tampermonkey scripts + enable-copy

(() => {
  if (window.__ETA_AIO_COPY_BYPASS__) return;
  window.__ETA_AIO_COPY_BYPASS__ = true;

  const TOGGLE_DEFAULTS = {
    toggle_copy_paste: true,
    toggle_password_eye: true,
    toggle_nat_number: true
  };

  // ── 1. Global CSS: Force user-select text everywhere ──

  function injectGlobalCSS() {
    if (document.querySelector('style[data-eta-aio-copy="true"]')) return;
    const style = document.createElement("style");
    style.setAttribute("data-eta-aio-copy", "true");
    style.textContent = `
      * {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
      input, textarea, [contenteditable="true"] {
        -webkit-user-select: text !important;
        user-select: text !important;
      }
      input#userPwdInput {
        color: black !important;
        text-shadow: none !important;
        -webkit-text-fill-color: black !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  // ── 2. Fix user-select on all elements ──

  function fixUserSelect(el) {
    if (!el || !el.style) return;
    const s = el.style;
    if (s.userSelect === "none") s.userSelect = "auto";
    if (s.webkitUserSelect === "none") s.webkitUserSelect = "auto";
    if (s.MozUserSelect === "none") s.MozUserSelect = "auto";
    if (s.msUserSelect === "none") s.msUserSelect = "auto";
  }

  // ── 3. Unlock input/textarea fields (from MMM) ──

  function unlockFields() {
    document.querySelectorAll("input, textarea").forEach((el) => {
      el.onpaste = null;
      el.oncontextmenu = null;
      el.oncopy = null;
      el.oncut = null;
      el.style.userSelect = "text";

      // Unblur password field
      if (el.id === "userPwdInput" || el.name === "pwd") {
        el.style.setProperty("color", "black", "important");
        el.style.setProperty("text-shadow", "none", "important");
        el.style.setProperty("-webkit-text-fill-color", "black", "important");
      }
    });
  }

  // ── 4. Keyboard bypass (Ctrl+C, Ctrl+V, Ctrl+X) ──

  function keyboardBypass(e) {
    if (e.ctrlKey && ["v", "V", "c", "C", "x", "X"].includes(e.key)) {
      e.stopPropagation();
      return true;
    }
  }

  // ── 5. Mouse/event bypass (paste, copy, contextmenu, etc.) ──

  function eventBypass(e) {
    if (["paste", "contextmenu", "copy", "selectstart", "cut"].includes(e.type)) {
      e.stopPropagation();
    }
    return true;
  }

  // ── 6. Enable clipboard on specific inputs ──

  function enableClipboard(input) {
    ["copy", "paste", "cut"].forEach((type) => {
      input.addEventListener(
        type,
        (e) => {
          e.stopImmediatePropagation();
        },
        true
      );
    });
  }

  // ── 7. Password field eye toggle (from tampermonkey script 2) ──

  let passwordVisible = false;

  function setupPasswordField() {
    const input = document.getElementById("userPwdInput");
    if (!input) return;

    // Wrapper
    if (!input.parentElement.classList.contains("pwd-wrapper")) {
      const wrapper = document.createElement("div");
      wrapper.className = "pwd-wrapper";
      wrapper.style.position = "relative";
      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);
    }

    // Input fix
    input.type = passwordVisible ? "text" : "password";
    input.autocomplete = "current-password";
    input.onfocus = null;
    input.onkeypress = null;
    input.onclick = null;
    input.onblur = null;
    input.style.color = "black";
    input.style.textShadow = "none";
    input.style.webkitTextFillColor = "black";
    input.style.paddingLeft = "38px";

    enableClipboard(input);

    // Eye button
    if (!document.getElementById("pwdEyeBtn")) {
      const eye = document.createElement("span");
      eye.id = "pwdEyeBtn";
      eye.textContent = "\u{1F441}\u{FE0F}";
      eye.style.position = "absolute";
      eye.style.left = "10px";
      eye.style.top = "50%";
      eye.style.transform = "translateY(-50%)";
      eye.style.cursor = "pointer";
      eye.style.userSelect = "none";
      eye.style.fontSize = "18px";
      eye.style.opacity = "0.7";

      eye.addEventListener("click", () => {
        passwordVisible = !passwordVisible;
        input.type = passwordVisible ? "text" : "password";
        eye.textContent = passwordVisible ? "\u{1F648}" : "\u{1F441}\u{FE0F}";
      });

      input.parentElement.appendChild(eye);
    }
  }

  // ── 8. natNumber field paste fix (from tampermonkey script 1) ──

  function setupNatNumberField() {
    const natInput = document.getElementById("natNumber");
    if (!natInput) return;

    natInput.onpaste = null;

    if (!natInput.dataset.etaAioListener) {
      natInput.addEventListener("paste", function (e) {
        const text = (e.clipboardData || window.clipboardData).getData("text");
        setTimeout(() => {
          this.value = text;
          this.dispatchEvent(new Event("input", { bubbles: true }));
          this.dispatchEvent(new Event("change", { bubbles: true }));
        }, 1);
      }, true);
      natInput.dataset.etaAioListener = "true";
    }
  }

  // ── 9. Bypass inline event handlers ──

  function bypassInlineHandlers() {
    ["copy", "cut", "paste", "select", "selectstart", "contextmenu"].forEach((ev) => {
      [document, document.body].forEach((target) => {
        if (!target) return;
        try { target["on" + ev] = null; } catch {}
      });
    });
  }

  // ── 10. Bypass on new elements via MutationObserver ──

  function setupObserver() {
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === "childList") {
          m.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              fixUserSelect(node);
              if (node.querySelectorAll) node.querySelectorAll("*").forEach(fixUserSelect);
              ["oncopy", "oncut", "onpaste", "onselectstart", "oncontextmenu"].forEach((k) => {
                if (k in node) try { node[k] = null; } catch {}
              });
            }
          });
        } else if (m.type === "attributes" && /user-select/i.test(m.attributeName)) {
          fixUserSelect(m.target);
        }
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["style"] });
  }

  // ── Init with toggle support ──

  chrome.storage.sync.get(TOGGLE_DEFAULTS, (toggles) => {
    const copyPasteOn = toggles.toggle_copy_paste !== false;
    const passwordEyeOn = toggles.toggle_password_eye !== false;
    const natNumberOn = toggles.toggle_nat_number !== false;

    if (!copyPasteOn && !passwordEyeOn && !natNumberOn) return;

    function init() {
      if (copyPasteOn) {
        injectGlobalCSS();
        bypassInlineHandlers();
        unlockFields();
        setupObserver();

        document.addEventListener("keydown", keyboardBypass, true);
        document.addEventListener("paste", eventBypass, true);
        document.addEventListener("copy", eventBypass, true);
        document.addEventListener("contextmenu", eventBypass, true);
        document.addEventListener("selectstart", eventBypass, true);
        document.addEventListener("cut", eventBypass, true);

        setTimeout(() => {
          try { document.querySelectorAll("*").forEach(fixUserSelect); } catch {}
        }, 800);
      }

      if (passwordEyeOn) {
        setupPasswordField();
      }

      if (natNumberOn) {
        setupNatNumberField();
      }
    }

    // ── URL change watcher ──
    let lastHref = location.href;
    setInterval(() => {
      if (location.href !== lastHref) {
        lastHref = location.href;
        if (copyPasteOn) unlockFields();
        if (passwordEyeOn) setupPasswordField();
        if (natNumberOn) setupNatNumberField();
      }
    }, 800);

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  });
})();
