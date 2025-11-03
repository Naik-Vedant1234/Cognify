const API_URL = 'http://localhost:5000/api';
let activeTab = null;
let startTime = null;
let userId = null;

// Initialize userId
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['userId'], (result) => {
    if (!result.userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      chrome.storage.local.set({ userId });
      console.log('Created new user ID:', userId);
    } else {
      userId = result.userId;
      console.log('Loaded existing user ID:', userId);
    }
  });
});

// Load userId on startup
chrome.storage.local.get(['userId'], (result) => {
  if (result.userId) {
    userId = result.userId;
    console.log('User ID loaded:', userId);
  } else {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    chrome.storage.local.set({ userId });
    console.log('Created user ID on startup:', userId);
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log('Tab activated:', activeInfo.tabId);
  await logCurrentTab();
  const tab = await chrome.tabs.get(activeInfo.tabId);
  await startTracking(tab);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Check on URL change or when page loads
  if ((changeInfo.url || changeInfo.status === 'complete') && tab.active) {
    console.log('Tab updated:', { tabId, url: changeInfo.url || tab.url, status: changeInfo.status });

    // Check if blocked immediately on URL change
    if (changeInfo.url && !changeInfo.url.startsWith('chrome://') && !changeInfo.url.startsWith('chrome-extension://')) {
      try {
        const domain = new URL(changeInfo.url).hostname;
        const focusCheck = await fetch(`${API_URL}/focus/check/${userId}/${domain}`)
          .then(r => r.json())
          .catch(() => ({ blocked: false }));

        if (focusCheck.blocked) {
          console.log('Blocking site on navigation:', domain);
          const blockedPageUrl = chrome.runtime.getURL(`blocked.html?url=${encodeURIComponent(domain)}`);
          chrome.tabs.update(tabId, { url: blockedPageUrl });
          return;
        }
      } catch (error) {
        console.error('Error checking on URL change:', error);
      }
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

async function startTracking(tab) {
  if (!tab.url ||
    tab.url.startsWith('chrome://') ||
    tab.url.startsWith('chrome-extension://') ||
    tab.url.startsWith('edge://') ||
    tab.url.startsWith('about:') ||
    tab.url.startsWith('http://localhost') ||
    tab.url.startsWith('https://localhost') ||
    tab.url.startsWith('http://127.0.0.1') ||
    tab.url.startsWith('file://')) {
    console.log('Skipping tracking for:', tab.url);
    return;
  }

  try {
    const domain = new URL(tab.url).hostname;

    // Skip if domain looks invalid (extension IDs, etc.)
    if (!domain || domain.length > 50 || !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain)) {
      console.log('Skipping invalid domain:', domain);
      return;
    }

    console.log('Starting to track:', domain);

    const focusCheck = await fetch(`${API_URL}/focus/check/${userId}/${domain}`)
      .then(r => r.json())
      .catch(() => ({ blocked: false }));

    if (focusCheck.blocked) {
      console.log('Site is blocked:', domain);
      const blockedPageUrl = chrome.runtime.getURL(`blocked.html?url=${encodeURIComponent(domain)}`);
      chrome.tabs.update(tab.id, { url: blockedPageUrl });
      return;
    }

    activeTab = {
      url: tab.url,
      domain,
      title: tab.title,
      favicon: tab.favIconUrl
    };
    startTime = Date.now();
    console.log('Now tracking:', activeTab);
  } catch (error) {
    console.error('Error in startTracking:', error);
  }
}

async function logCurrentTab() {
  if (!activeTab || !startTime || !userId) {
    console.log('Skipping log - missing data:', { activeTab: !!activeTab, startTime: !!startTime, userId: !!userId });
    return;
  }

  const duration = Math.floor((Date.now() - startTime) / 1000);
  if (duration < 1) {
    console.log('Skipping log - duration too short:', duration);
    return;
  }

  try {
    console.log('Logging time:', { userId, domain: activeTab.domain, duration });
    const response = await fetch(`${API_URL}/tracking/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        ...activeTab,
        duration
      })
    });

    const result = await response.json();
    console.log('Log response:', result);
  } catch (error) {
    console.error('Error logging time:', error);
  }

  // Don't reset activeTab and startTime here - let it continue tracking
  startTime = Date.now(); // Reset start time for next interval
}

// Log time every 10 seconds for more frequent updates
setInterval(async () => {
  await logCurrentTab();
}, 10000);

// Check for blocked sites every 2 seconds when browsing
setInterval(async () => {
  if (!userId) return;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('http://localhost:5173')) return;

    const domain = new URL(tab.url).hostname;
    const focusCheck = await fetch(`${API_URL}/focus/check/${userId}/${domain}`)
      .then(r => r.json())
      .catch(() => ({ blocked: false }));

    if (focusCheck.blocked) {
      console.log('Periodic check: Site is blocked:', domain);
      const blockedPageUrl = chrome.runtime.getURL(`blocked.html?url=${encodeURIComponent(domain)}`);
      chrome.tabs.update(tab.id, { url: blockedPageUrl });
    }
  } catch (error) {
    console.error('Error checking focus mode:', error);
  }
}, 2000);

// Listen for navigation events to block immediately
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (!userId || details.frameId !== 0) return; // Only main frame

  try {
    const url = details.url;
    if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('http://localhost:5173')) return;

    const domain = new URL(url).hostname;
    console.log('Navigation detected to:', domain);

    const focusCheck = await fetch(`${API_URL}/focus/check/${userId}/${domain}`)
      .then(r => r.json())
      .catch(() => ({ blocked: false }));

    if (focusCheck.blocked) {
      console.log('Blocking navigation to:', domain);
      const blockedPageUrl = chrome.runtime.getURL(`blocked.html?url=${encodeURIComponent(domain)}`);
      chrome.tabs.update(details.tabId, { url: blockedPageUrl });
    }
  } catch (error) {
    console.error('Error in navigation listener:', error);
  }
});
