const API_URL = 'http://localhost:5000/api';

async function loadStats() {
  try {
    const { userId } = await chrome.storage.local.get(['userId']);
    if (!userId) return;

    const response = await fetch(`${API_URL}/tracking/stats/${userId}?period=day`);
    const data = await response.json();

    const totalMinutes = Math.floor(data.totalTime / 60);
    document.getElementById('todayTime').textContent = 
      totalMinutes > 60 ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m` : `${totalMinutes}m`;
    
    document.getElementById('sitesCount').textContent = data.stats.length;

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url && !tab.url.startsWith('chrome://')) {
      const domain = new URL(tab.url).hostname;
      document.getElementById('currentSite').textContent = domain;
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

loadStats();
