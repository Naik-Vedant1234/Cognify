// ===============================
// CONFIG
// ===============================
const API_URL = 'https://cognify-gxaa.onrender.com/api';

// ===============================
// CHECK AUTH
// ===============================
async function checkAuth() {
  const { authToken } = await chrome.storage.local.get(['authToken']);

  if (!authToken) {
    window.location.href = 'auth.html';
    return false;
  }

  return true;
}

// ===============================
// LOAD STATS
// ===============================
async function loadStats() {
  try {
    const { userId, userName } = await chrome.storage.local.get(['userId', 'userName']);
    if (!userId) return;

    // Display user greeting
    if (userName) {
      document.getElementById('userGreeting').textContent = `Hello, ${userName}!`;
    }

    const response = await fetch(
      `${API_URL}/tracking/stats/${userId}?period=day`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Total time
    const totalSeconds = data.totalTime || 0;
    const totalMinutes = Math.floor(totalSeconds / 60);

    document.getElementById("todayTime").textContent =
      totalMinutes >= 60
        ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
        : `${totalMinutes}m`;

    // Sites count
    document.getElementById("sitesCount").textContent =
      Array.isArray(data.stats) ? data.stats.length : 0;

    // Current site
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (tab?.url && !isIgnorableUrl(tab.url)) {
      document.getElementById("currentSite").textContent =
        new URL(tab.url).hostname;
    } else {
      document.getElementById("currentSite").textContent = "—";
    }
  } catch (error) {
    console.error("Popup load error:", error);
  }
}

// ===============================
// LOGOUT
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');

  logoutBtn.addEventListener('click', async () => {
    if (confirm('Are you sure you want to logout?')) {
      await chrome.storage.local.remove(['authToken', 'userId', 'userEmail', 'userName']);
      window.location.href = 'auth.html';
    }
  });
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

// ===============================
// INIT
// ===============================
checkAuth().then(isAuthenticated => {
  if (isAuthenticated) {
    loadStats();
  }
});
