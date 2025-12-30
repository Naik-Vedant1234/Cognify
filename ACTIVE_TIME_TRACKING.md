# Active Time Tracking Feature

## Overview

Cognify now tracks only **active time** - time when you're actually viewing and interacting with a website. Inactive time (when the tab is hidden or you switch to another app) is automatically paused and not counted.

---

## How It Works

### 1. Visibility Detection

The extension uses the **Page Visibility API** to detect when a tab is:
- ✅ **Active**: Tab is visible and in focus
- ⏸️ **Inactive**: Tab is hidden, minimized, or you switched to another app

### 2. Automatic Pause/Resume

**Timer pauses when:**
- You switch to a different tab
- You minimize the browser
- You switch to another application (Alt+Tab)
- The browser window loses focus

**Timer resumes when:**
- You return to the tab
- You restore the browser window
- You switch back from another application

### 3. Visual Feedback

The purple timer in the top-right corner:
- **Full opacity (100%)**: Actively tracking
- **Dimmed (50% opacity)**: Paused (not counting time)

---

## Technical Implementation

### Content Script (content.js)

**Detects visibility changes:**
```javascript
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pauseTimer();
    chrome.runtime.sendMessage({ action: 'pauseTracking' });
  } else {
    resumeTimer();
    chrome.runtime.sendMessage({ action: 'resumeTracking' });
  }
});
```

**Handles window focus:**
```javascript
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
```

### Background Script (background.js)

**Tracks accumulated active time:**
```javascript
let accumulatedTime = 0; // Only counts active time
let isTrackingPaused = false;

function pauseTracking() {
  // Save time accumulated so far
  const currentDuration = Math.floor((Date.now() - startTime) / 1000);
  accumulatedTime += currentDuration;
  isTrackingPaused = true;
}

function resumeTracking() {
  // Resume from where we left off
  startTime = Date.now();
  isTrackingPaused = false;
}
```

---

## Benefits

### 1. Accurate Time Tracking
- Only counts time when you're actually viewing the page
- No more inflated numbers from forgotten tabs

### 2. Fair Analytics
- Reflects your real browsing habits
- Better insights into actual time spent

### 3. Productivity Insights
- See how much time you're truly active on each site
- Identify time-wasting patterns more accurately

---

## Example Scenarios

### Scenario 1: Multitasking
```
9:00 AM - Open YouTube (timer starts)
9:05 AM - Switch to Gmail (YouTube timer pauses, Gmail timer starts)
9:10 AM - Back to YouTube (YouTube timer resumes from 5 minutes)
9:15 AM - Close YouTube

Result: YouTube = 10 minutes active time (5 + 5)
        Gmail = 5 minutes active time
```

### Scenario 2: Taking a Break
```
10:00 AM - Reading article (timer running)
10:15 AM - Minimize browser for lunch (timer pauses at 15 min)
11:00 AM - Return to article (timer resumes from 15 min)
11:10 AM - Finish article (timer stops at 25 min)

Result: Article = 25 minutes active time (not 70 minutes)
```

### Scenario 3: Background Tab
```
2:00 PM - Open Spotify in background tab
2:00 PM - Switch to work in another tab
3:00 PM - Check Spotify briefly (2 minutes)
3:02 PM - Back to work

Result: Spotify = 2 minutes active time (not 62 minutes)
```

---

## Testing the Feature

### Test 1: Tab Switching
1. Open a website (e.g., YouTube)
2. Watch the timer count up
3. Switch to another tab
4. Notice timer dims (paused)
5. Switch back
6. Timer resumes counting

### Test 2: Window Minimizing
1. Open a website
2. Let timer run for 30 seconds
3. Minimize browser
4. Wait 1 minute
5. Restore browser
6. Timer should show ~30 seconds (not 1:30)

### Test 3: App Switching
1. Open a website
2. Let timer run for 20 seconds
3. Alt+Tab to another app
4. Wait 40 seconds
5. Alt+Tab back to browser
6. Timer should show ~20 seconds (not 1:00)

### Test 4: Dashboard Verification
1. Browse multiple sites with pauses
2. Check dashboard analytics
3. Verify times match your actual active time

---

## Comparison: Before vs After

### Before (Old Behavior)
```
Open YouTube at 9:00 AM
Switch to Gmail at 9:05 AM
Come back at 10:00 AM
Close YouTube at 10:05 AM

Tracked time: 65 minutes ❌ (includes 55 min inactive)
```

### After (New Behavior)
```
Open YouTube at 9:00 AM
Switch to Gmail at 9:05 AM (YouTube pauses at 5 min)
Come back at 10:00 AM (YouTube resumes from 5 min)
Close YouTube at 10:05 AM (YouTube stops at 10 min)

Tracked time: 10 minutes ✅ (only active time)
```

---

## Privacy & Performance

### Privacy
- All tracking happens locally in your browser
- No additional data is collected
- Same privacy policy applies

### Performance
- Minimal CPU usage (event-based, not polling)
- No impact on browsing speed
- Efficient message passing between scripts

---

## Troubleshooting

### Timer doesn't pause when switching tabs
**Solution:** Reload the extension:
1. Go to `chrome://extensions`
2. Find Cognify
3. Click reload icon

### Timer shows wrong time
**Solution:** The timer resets when you navigate to a new page. This is expected behavior.

### Dashboard shows different time than timer
**Solution:** Dashboard shows cumulative time across all sessions. Timer shows current session only.

---

## Future Enhancements

Potential improvements:
- Idle detection (pause after X minutes of no activity)
- Mouse/keyboard activity tracking
- Configurable pause threshold
- Activity heatmap visualization

---

## Summary

✅ **Accurate tracking** - Only counts active viewing time
✅ **Automatic** - No manual intervention needed
✅ **Visual feedback** - Timer dims when paused
✅ **Better insights** - Reflects real browsing habits
✅ **Privacy-focused** - All processing happens locally

Your time tracking is now more accurate and meaningful!
