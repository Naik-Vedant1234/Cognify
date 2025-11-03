let timerElement = null;
let startTime = Date.now();
let timerInterval = null;

function createTimer() {
  // Don't show timer on blocked page or dashboard
  if (window.location.href.includes('blocked.html') || 
      window.location.href.includes('localhost:5173')) {
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
}

function updateTimer() {
  if (!timerElement) return;
  
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
