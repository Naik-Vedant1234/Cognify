// This script runs on the dashboard page to sync user IDs
(function () {
  // Only run on cognify-theta.vercel.app
  if (window.location.hostname === 'cognify-theta.vercel.app') {
    console.log('Cognify: Checking user ID sync...');

    // Get extension user ID
    if (chrome && chrome.storage) {
      chrome.storage.local.get(['userId'], (result) => {
        if (result.userId) {
          const extensionUserId = result.userId;
          const dashboardUserId = localStorage.getItem('cognify_user_id');

          console.log('Extension user ID:', extensionUserId);
          console.log('Dashboard user ID:', dashboardUserId);

          if (extensionUserId !== dashboardUserId) {
            console.log('Syncing user IDs...');
            localStorage.setItem('cognify_user_id', extensionUserId);
            console.log('User ID synced! Reloading page...');
            window.location.reload();
          } else {
            console.log('User IDs already synced ✓');
          }
        }
      });
    }
  }
})();
