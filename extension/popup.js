// ===============================
// CONFIG
// ===============================
const API_URL = 'https://cognify-gxaa.onrender.com/api';

// ===============================
// LOAD STATS & FOCUS
// ===============================
async function loadStats() {
  try {
    const { userId } = await chrome.storage.local.get(["userId"]);
    if (!userId) return;

    // Display user ID
    const userIdElement = document.getElementById("userId");
    if (userIdElement) {
      userIdElement.textContent = userId;
    }

    // 1. Fetch Focus Mode Active Session
    try {
      const focusRes = await fetch(`${API_URL}/focus/active/${userId}`);
      if (focusRes.ok) {
        const focusData = await focusRes.json();
        if (focusData.active && focusData.session) {
          const focusActiveBlock = document.getElementById('focusActive');
          const focusTimer = document.getElementById('focusTimer');
          
          if (focusActiveBlock && focusTimer) {
            focusActiveBlock.classList.remove('hidden');
            
            const endTime = new Date(focusData.session.endTime).getTime();
            
            const updateTimer = () => {
              const now = new Date().getTime();
              const diff = endTime - now;
              
              if (diff <= 0) {
                focusTimer.textContent = '00:00';
                focusActiveBlock.classList.add('hidden');
                return;
              }
              
              const minutes = Math.floor(diff / 60000);
              const seconds = Math.floor((diff % 60000) / 1000);
              focusTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            };
            
            updateTimer();
            setInterval(updateTimer, 1000);
          }
        }
      }
    } catch (focusError) {
      console.error("Error fetching focus mode:", focusError);
    }

    // 2. Fetch Daily Tracking Stats
    const response = await fetch(`${API_URL}/tracking/stats/${userId}?period=day`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();

    // Total time
    const totalSeconds = data.totalTime || 0;
    const totalMinutes = Math.floor(totalSeconds / 60);

    const todayTimeElement = document.getElementById("todayTime");
    if (todayTimeElement) {
      todayTimeElement.textContent = totalMinutes >= 60
        ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
        : `${totalMinutes}m`;
    }

    // Sites count
    const sitesCountElement = document.getElementById("sitesCount");
    if (sitesCountElement) {
      sitesCountElement.textContent = Array.isArray(data.stats) ? data.stats.length : 0;
    }

    // Current site
    const currentSiteElement = document.getElementById("currentSite");
    if (currentSiteElement) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.url && !isIgnorableUrl(tab.url)) {
        currentSiteElement.textContent = new URL(tab.url).hostname;
      } else {
        currentSiteElement.textContent = "—";
      }
    }
  } catch (error) {
    console.error("Popup load error:", error);
    const todayTimeElement = document.getElementById("todayTime");
    if (todayTimeElement && todayTimeElement.textContent === "Loading...") {
      todayTimeElement.textContent = "0m";
    }
  }
}

// ===============================
// COPY USER ID
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  const copyBtn = document.getElementById('copyBtn');

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const userIdText = document.getElementById('userId').textContent;

      try {
        await navigator.clipboard.writeText(userIdText);
        copyBtn.textContent = '✓ Copied';
        copyBtn.classList.add('copied');

        setTimeout(() => {
          copyBtn.textContent = 'Copy';
          copyBtn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
  }
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
loadStats();
