// ETA All-in-One - Content Script Injector
// Bridges page-level scripts to the background service worker
// From: creds only extension

window.addEventListener("ETA_HELPER_REQUEST", async (event) => {
    const { action, data, requestId } = event.detail;

    try {
        const response = await chrome.runtime.sendMessage({ action, data });

        window.dispatchEvent(new CustomEvent("ETA_HELPER_RESPONSE", {
            detail: {
                requestId,
                success: true,
                response: response
            }
        }));
    } catch (error) {
        window.dispatchEvent(new CustomEvent("ETA_HELPER_RESPONSE", {
            detail: {
                requestId,
                success: false,
                error: error.message
            }
        }));
    }
});

function addScript(src, callback) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = chrome.runtime.getURL(src);

    if (callback) {
        script.onload = callback;
    }

    (document.body || document.head || document.documentElement).appendChild(script);
}

const ESERVISE_TOGGLES = {
    toggle_credentials: true,
    toggle_vat_download: true,
    toggle_invoice_export: true
};

addScript("libs/FileSaver.min.js");

addScript("libs/exceljs.min.js", function() {
    chrome.storage.sync.get(ESERVISE_TOGGLES, (toggles) => {
        window.__ETA_AIO_TOGGLES__ = {
            credentials: toggles.toggle_credentials !== false,
            vatDownload: toggles.toggle_vat_download !== false,
            invoiceExport: toggles.toggle_invoice_export !== false
        };

        const anyEnabled = window.__ETA_AIO_TOGGLES__.credentials ||
                          window.__ETA_AIO_TOGGLES__.vatDownload ||
                          window.__ETA_AIO_TOGGLES__.invoiceExport;

        if (anyEnabled) {
            addScript("content/eservise.js");
        }
    });
});
