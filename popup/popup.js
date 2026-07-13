// popup.js - ETA All-in-One by MMM

const DEFAULTS = {
  toggle_credentials: true,
  toggle_copy_paste: true,
  toggle_password_eye: true,
  toggle_nat_number: true,
  toggle_signature: true,
  toggle_vat_download: true,
  toggle_invoice_export: true
};

document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll("[data-toggle]");

  chrome.storage.sync.get(DEFAULTS, (data) => {
    toggles.forEach((el) => {
      const key = el.getAttribute("data-toggle");
      el.checked = data[key] !== false;
    });
  });

  toggles.forEach((el) => {
    el.addEventListener("change", () => {
      const key = el.getAttribute("data-toggle");
      const obj = {};
      obj[key] = el.checked;
      chrome.storage.sync.set(obj);
    });
  });
});
