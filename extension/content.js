let timerElement = null;
let startTime = Date.now();
let timerInterval = null;
let isPaused = false;
let pausedTime = 0;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

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

  // Get saved position or use default
  chrome.storage.local.get(['timerPosition'], (result) => {
    if (result.timerPosition) {
      timerElement.style.top = result.timerPosition.top;
      timerElement.style.right = result.timerPosition.right;
    }
  });

  document.body.appendChild(timerElement);

  // Make timer draggable
  makeDraggable(timerElement);

  timerInterval = setInterval(updateTimer, 1000);

  // Listen for visibility changes
  setupVisibilityTracking();

  // Listen for fullscreen changes
  setupFullscreenTracking();
}

function makeDraggable(element) {
  element.style.cursor = 'move';

  element.addEventListener('mousedown', (e) => {
    isDragging = true;
    const rect = element.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    element.style.transition = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const x = e.clientX - dragOffset.x;
    const y = e.clientY - dragOffset.y;

    // Keep timer within viewport
    const maxX = window.innerWidth - element.offsetWidth;
    const maxY = window.innerHeight - element.offsetHeight;

    const boundedX = Math.max(0, Math.min(x, maxX));
    const boundedY = Math.max(0, Math.min(y, maxY));

    element.style.left = boundedX + 'px';
    element.style.top = boundedY + 'px';
    element.style.right = 'auto';
    element.style.bottom = 'auto';
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      element.style.transition = '';

      // Save position
      const position = {
        top: element.style.top,
        right: element.style.right,
        left: element.style.left,
        bottom: element.style.bottom
      };
      chrome.storage.local.set({ timerPosition: position });
    }
  });
}

function setupFullscreenTracking() {
  // Hide timer in fullscreen mode
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      // Entered fullscreen - hide timer
      if (timerElement) {
        timerElement.style.display = 'none';
      }
    } else {
      // Exited fullscreen - show timer
      if (timerElement) {
        timerElement.style.display = 'flex';
      }
    }
  });

  // Also handle webkit fullscreen (Safari)
  document.addEventListener('webkitfullscreenchange', () => {
    if (document.webkitFullscreenElement) {
      if (timerElement) {
        timerElement.style.display = 'none';
      }
    } else {
      if (timerElement) {
        timerElement.style.display = 'flex';
      }
    }
  });

  // Handle Mozilla fullscreen
  document.addEventListener('mozfullscreenchange', () => {
    if (document.mozFullScreenElement) {
      if (timerElement) {
        timerElement.style.display = 'none';
      }
    } else {
      if (timerElement) {
        timerElement.style.display = 'flex';
      }
    }
  });
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
