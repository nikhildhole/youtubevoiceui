// Listen for tab changes or updates
chrome.tabs.onActivated.addListener((activeInfo) => {
  // Get the tab details when the tab is activated
  chrome.tabs.get(activeInfo.tabId, (tab) => {
      if (tab.url && tab.url.includes('youtube.com')) {
          console.log("YouTube page detected, starting speech recognition");

          // Send message to content script to start recognition
          chrome.tabs.sendMessage(tab.id, "start-recognition", (response) => {
              console.log(response); // Logs "Recognition started" or "Recognition stopped"
          });
      } else {
          console.log("Not a YouTube page");
      }
  });
});

// Optionally, listen for URL updates in the active tab (e.g., page navigation within the tab)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the page is fully loaded and the URL is from YouTube
  if (changeInfo.status === 'complete' && tab.url.includes('youtube.com')) {
      console.log("YouTube page detected, starting speech recognition");

      // Send message to content script to start recognition
      chrome.tabs.sendMessage(tabId, "start-recognition", (response) => {
          console.log(response); // Logs "Recognition started" or "Recognition stopped"
      });
  }
});
