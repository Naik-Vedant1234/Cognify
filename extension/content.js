let timerElement = null;
let startTime = Date.now();
let timerInterval = null;
let isPaused = false;
let pausedTime = 0;

function createTimer() {
  // Don't show timer on blocked page or dashboard
  if (window.location.href.includes('blocked.html') ||
    window.location.href.includes('cognify-theta.vercel.app')) {
    return;
  }

  if (timerElement) return;

  timerElement = document.createElement('div');
  timerElement.id = 'cognify-timer';
  timerElement.innerHTML = `
    <div class="cognify-timer-content">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      <span class="cognify-time">0:00</span>
    </div>
  `;

  document.body.appendChild(timerElement);

  timerInterval = setInterval(updateTimer, 1000);

  // Listen for visibility changes
  setupVisibilityTracking();
}

function setupVisibilityTracking() {
  // Handle page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Page is hidden - notify background to pause tracking
      pauseTimer();
      chrome.runtime.sendMessage({ action: 'pauseTracking' });
    } else {
      // Page is visible - notify background to resume tracking
      resumeTimer();
      chrome.runtime.sendMessage({ action: 'resumeTracking' });
    }
  });

  // Handle window blur/focus (when switching to another app)
  window.addEventListener('blur', () => {
    pauseTimer();
    chrome.runtime.sendMessage({ action: 'pauseTracking' });
  });

  window.addEventListener('focus', () => {
    if (!document.hidden) {
      resumeTimer();
      chrome.runtime.sendMessage({ action: 'resumeTracking' });
    }
  });
}

function pauseTimer() {
  if (!isPaused) {
    isPaused = true;
    pausedTime = Date.now();
    if (timerElement) {
      timerElement.style.opacity = '0.5';
    }
  }
}

function resumeTimer() {
  if (isPaused) {
    isPaused = false;
    // Adjust startTime to account for paused duration
    const pauseDuration = Date.now() - pausedTime;
    startTime += pauseDuration;
    if (timerElement) {
      timerElement.style.opacity = '1';
    }
  }
}

function updateTimer() {
  if (!timerElement || isPaused) return;

  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  const timeSpan = timerElement.querySelector('.cognify-time');
  if (timeSpan) {
    timeSpan.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

function removeTimer() {
  if (timerElement) {
    timerElement.remove();
    timerElement = null;
  }
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createTimer);
} else {
  createTimer();
}

window.addEventListener('beforeunload', removeTimer);
