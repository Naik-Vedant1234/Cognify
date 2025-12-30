// ===============================
// CONFIG
// ===============================
import API_URL from './config.js';

// ===============================
// STATE
// ===============================
let activeTab = null;
let startTime = null;
let userId = null;

// ===============================
// USER ID INITIALIZATION
// ===============================
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["userId"], (result) => {
    if (!result.userId) {
      userId = "user_" + Math.random().toString(36).substr(2, 9);
      chrome.storage.local.set({ userId });
      console.log("Created new user ID:", userId);
    } else {
      userId = result.userId;
      console.log("Loaded existing user ID:", userId);
    }
  });
});

chrome.storage.local.get(["userId"], (result) => {
  if (result.userId) {
    userId = result.userId;
    console.log("User ID loaded:", userId);
  } else {
    userId = "user_" + Math.random().toString(36).substr(2, 9);
    chrome.storage.local.set({ userId });
    console.log("Created user ID on startup:", userId);
  }
});

// ===============================
// TAB EVENTS
// ===============================
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await logCurrentTab();
  const tab = await chrome.tabs.get(activeInfo.tabId);
  await startTracking(tab);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if ((changeInfo.url || changeInfo.status === "complete") && tab.active) {

    if (changeInfo.url && !isIgnorableUrl(changeInfo.url)) {
      await checkAndBlock(tabId, changeInfo.url);
    }

    await logCurrentTab();
    await startTracking(tab);
  }
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    await logCurrentTab();
    activeTab = null;
    startTime = null;
  } else {
    const [tab] = await chrome.tabs.query({ active: true, windowId });
    if (tab) await startTracking(tab);
  }
});

// ===============================
// TRACKING LOGIC
// ===============================
async function startTracking(tab) {
  if (!tab.url || isIgnorableUrl(tab.url)) return;

  try {
    const domain = new URL(tab.url).hostname;

    if (!isValidDomain(domain)) return;

    const focusCheck = await fetch(`${API_URL}/focus/check/${userId}/${domain}`)
      .then((r) => r.json())
      .catch(() => ({ blocked: false }));

    if (focusCheck.blocked) {
      blockTab(tab.id, domain);
      return;
    }

    activeTab = {
      url: tab.url,
      domain,
      title: tab.title,
      favicon: tab.favIconUrl,
    };

    startTime = Date.now();
  } catch (err) {
    console.error("startTracking error:", err);
  }
}

async function logCurrentTab() {
  if (!activeTab || !startTime || !userId) return;

  const duration = Math.floor((Date.now() - startTime) / 1000);
  if (duration < 1) return;

  try {
    await fetch(`${API_URL}/tracking/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        ...activeTab,
        duration,
      }),
    });
  } catch (err) {
    console.error("logCurrentTab error:", err);
  }

  startTime = Date.now();
}

// ===============================
// INTERVALS
// ===============================
setInterval(logCurrentTab, 10000);

setInterval(async () => {
  if (!userId) return;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url || isIgnorableUrl(tab.url)) return;

  await checkAndBlock(tab.id, tab.url);
}, 2000);

// ===============================
// NAVIGATION BLOCKING
// ===============================
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (!userId || details.frameId !== 0) return;
  if (isIgnorableUrl(details.url)) return;

  await checkAndBlock(details.tabId, details.url);
});

// ===============================
// HELPERS
// ===============================
function isIgnorableUrl(url) {
  return (
    url.startsWith("chrome://") ||
    url.startsWith("chrome-extension://") ||
    url.startsWith("edge://") ||
    url.startsWith("about:") ||
    url.startsWith("file://")
  );
}

function isValidDomain(domain) {
  return (
    domain &&
    domain.length <= 50 &&
    /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain)
  );
}

async function checkAndBlock(tabId, url) {
  try {
    const domain = new URL(url).hostname;

    const focusCheck = await fetch(`${API_URL}/focus/check/${userId}/${domain}`)
      .then((r) => r.json())
      .catch(() => ({ blocked: false }));

    if (focusCheck.blocked) {
      blockTab(tabId, domain);
    }
  } catch (err) {
    console.error("checkAndBlock error:", err);
  }
}

function blockTab(tabId, domain) {
  const blockedPageUrl = chrome.runtime.getURL(
    `blocked.html?url=${encodeURIComponent(domain)}`
  );
  chrome.tabs.update(tabId, { url: blockedPageUrl });
}
