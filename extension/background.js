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
let isTrackingPaused = false;
let pausedAt = null;
let accumulatedTime = 0; // Track accumulated active time

// ===============================
// KEEP SERVICE WORKER ALIVE
// ===============================
// Keep service worker alive with multiple strategies
chrome.alarms.create('keepAlive', { periodInMinutes: 0.25 }); // Every 15 seconds
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keepAlive') {
    console.log('⏰ Service worker keepalive ping');
    // Force a check on the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && !isIgnorableUrl(tabs[0].url)) {
        console.log('🔍 Keepalive checking active tab:', tabs[0].url);
      }
    });
  }
});

// Wake up on any tab activation
chrome.tabs.onActivated.addListener(() => {
  console.log('🔔 Service worker woken by tab activation');
});

// Wake up on any tab update
chrome.tabs.onUpdated.addListener(() => {
  console.log('🔔 Service worker woken by tab update');
});

// Wake up on window focus change
chrome.windows.onFocusChanged.addListener(() => {
  console.log('🔔 Service worker woken by window focus change');
});

// ===============================
// USER ID INITIALIZATION
// ===============================
// Initialize on startup
chrome.runtime.onStartup.addListener(() => {
  console.log('🚀 Extension started');
  initializeUserId();
  setupKeepalive();
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('📦 Extension installed/updated');
  initializeUserId();
  setupKeepalive();
});

// Initialize immediately
initializeUserId();
setupKeepalive();

function setupKeepalive() {
  // Ensure alarm is set
  chrome.alarms.get('keepAlive', (alarm) => {
    if (!alarm) {
      console.log('⚙️ Setting up keepalive alarm');
      chrome.alarms.create('keepAlive', { periodInMinutes: 0.25 });
    }
  });
}

function initializeUserId() {
  chrome.storage.local.get(["userId"], (result) => {
    if (!result.userId) {
      userId = "user_" + Math.random().toString(36).substr(2, 9);
      chrome.storage.local.set({ userId });
      console.log("✨ Created new user ID:", userId);
    } else {
      userId = result.userId;
      console.log("👤 Loaded existing user ID:", userId);
    }
  });
}

// ===============================
// MESSAGE LISTENER (for pause/resume from content script)
// ===============================
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'pauseTracking') {
    pauseTracking();
  } else if (message.action === 'resumeTracking') {
    resumeTracking();
  }
});

function pauseTracking() {
  if (!isTrackingPaused && startTime) {
    // Calculate time accumulated so far
    const currentDuration = Math.floor((Date.now() - startTime) / 1000);
    accumulatedTime += currentDuration;
    isTrackingPaused = true;
    pausedAt = Date.now();
    console.log('Tracking paused. Accumulated time:', accumulatedTime);
  }
}

function resumeTracking() {
  if (isTrackingPaused) {
    // Resume tracking - reset startTime to now
    startTime = Date.now();
    isTrackingPaused = false;
    pausedAt = null;
    console.log('Tracking resumed. Accumulated time:', accumulatedTime);
  }
}

// ===============================
// TAB EVENTS
// ===============================
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log('Tab activated:', activeInfo.tabId);
  await logCurrentTab();
  const tab = await chrome.tabs.get(activeInfo.tabId);

  // Check for blocking immediately
  if (tab.url && !isIgnorableUrl(tab.url)) {
    await checkAndBlock(tab.id, tab.url);
  }

  await startTracking(tab);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if ((changeInfo.url || changeInfo.status === "complete") && tab.active) {
    console.log('Tab updated:', tabId, changeInfo.url || changeInfo.status);

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
    accumulatedTime = 0; // Reset accumulated time for new tab
    isTrackingPaused = false;
  } catch (err) {
    console.error("startTracking error:", err);
  }
}

async function logCurrentTab() {
  if (!activeTab || !startTime || !userId) return;

  // Calculate duration based on whether tracking is paused
  let duration;
  if (isTrackingPaused) {
    // Use only accumulated time (don't count paused time)
    duration = accumulatedTime;
  } else {
    // Add current session time to accumulated time
    const currentSessionTime = Math.floor((Date.now() - startTime) / 1000);
    duration = accumulatedTime + currentSessionTime;
  }

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

    console.log(`Logged ${duration}s for ${activeTab.domain}`);
  } catch (err) {
    console.error("logCurrentTab error:", err);
  }

  // Reset tracking for next interval
  if (!isTrackingPaused) {
    startTime = Date.now();
    accumulatedTime = 0;
  } else {
    // If paused, keep accumulated time but reset it after logging
    accumulatedTime = 0;
  }
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
    if (!userId) {
      console.log('No userId available for blocking check');
      return;
    }

    const domain = new URL(url).hostname;
    console.log(`Checking if ${domain} should be blocked for user ${userId}`);

    const focusCheck = await fetch(`${API_URL}/focus/check/${userId}/${domain}`)
      .then((r) => {
        if (!r.ok) {
          console.error(`API returned status ${r.status}`);
          return { blocked: false };
        }
        return r.json();
      })
      .catch((err) => {
        console.error('Focus check API error:', err);
        return { blocked: false };
      });

    console.log(`Block check result for ${domain}:`, focusCheck);

    if (focusCheck.blocked) {
      console.log(`🚫 BLOCKING ${domain}`);
      blockTab(tabId, domain);
    } else {
      console.log(`✅ ${domain} is not blocked`);
    }
  } catch (err) {
    console.error("checkAndBlock error:", err);
  }
}

function blockTab(tabId, domain) {
  console.log(`🔒 Redirecting tab ${tabId} to blocked page for ${domain}`);
  const blockedPageUrl = chrome.runtime.getURL(
    `blocked.html?url=${encodeURIComponent(domain)}`
  );
  chrome.tabs.update(tabId, { url: blockedPageUrl }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error blocking tab:', chrome.runtime.lastError);
    } else {
      console.log(`✅ Successfully blocked ${domain}`);
    }
  });
}
