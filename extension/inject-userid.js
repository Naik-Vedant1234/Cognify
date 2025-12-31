// This script runs on the dashboard page to sync user IDs
(function () {
  // Only run on cognify-theta.vercel.app
  if (window.location.hostname === 'cognify-theta.vercel.app' || window.location.hostname === 'localhost') {
    console.log('🔄 Cognify: Checking user ID sync...');

    // Wait for page to load
    setTimeout(() => {
      const dashboardUserId = localStorage.getItem('cognify_user_id');

      console.log('📊 Dashboard user ID:', dashboardUserId);

      if (dashboardUserId && chrome && chrome.storage) {
        // Get extension user ID
        chrome.storage.local.get(['userId'], (result) => {
          const extensionUserId = result.userId;
          console.log('🔌 Extension user ID:', extensionUserId);

          if (extensionUserId !== dashboardUserId) {
            console.log('⚠️ User IDs don\'t match! Syncing extension to dashboard...');

            // Update extension to use dashboard user ID
            chrome.storage.local.set({ userId: dashboardUserId }, () => {
              console.log('✅ Extension user ID updated to:', dashboardUserId);
              alert('User ID synced! Extension will now track time for your logged-in account.');
            });
          } else {
            console.log('✅ User IDs already synced!');
          }
        });
      } else {
        console.log('ℹ️ No dashboard user ID found (user not logged in)');
      }
    }, 1000);
  }
})();
