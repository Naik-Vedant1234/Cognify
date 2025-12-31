// ===============================
// CONFIG
// ===============================
const API_URL = 'https://cognify-gxaa.onrender.com/api';

// ===============================
// LOAD STATS
// ===============================
async function loadStats() {
  try {
    const { userId } = await chrome.storage.local.get(["userId"]);
    if (!userId) return;

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
loadStats();
