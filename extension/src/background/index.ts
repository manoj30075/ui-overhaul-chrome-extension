// Background service worker entrypoint
console.log('📡 Background service worker initialized');

// TODO: Implement LLM control and streaming JSON patch handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'REQUEST_PATCH') {
    // handle patch request
    sendResponse({ status: 'unimplemented' });
  }
});
