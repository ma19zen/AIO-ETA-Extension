// ETA All-in-One - Background Service Worker

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  if (msg.action === "saveCredentials") {
    chrome.storage.sync.get(null, (allData) => {
      const toggles = {};
      for (const [key, value] of Object.entries(allData || {})) {
        if (key.startsWith("toggle_")) toggles[key] = value;
      }
      chrome.storage.sync.clear(() => {
        if (chrome.runtime.lastError) {
          sendResponse({ success: false, error: "Failed to clear old data: " + chrome.runtime.lastError.message });
          return;
        }
        const merged = { ...toggles, ...msg.data };
        chrome.storage.sync.set(merged, () => {
          if (chrome.runtime.lastError) {
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else {
            sendResponse({ success: true });
          }
        });
      });
    });
    return true;
  }

  if (msg.action === "loadCredentials") {
    chrome.storage.sync.get(null, (data) => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        const credentials = {};
        for (const [key, value] of Object.entries(data || {})) {
          if (!key.startsWith("toggle_")) {
            credentials[key] = value;
          }
        }
        sendResponse({ success: true, data: credentials });
      }
    });
    return true;
  }

  sendResponse({ ok: true });
  return true;
});
