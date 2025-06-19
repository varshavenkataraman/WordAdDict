chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.word) {
    console.log(`Received word: ${request.word}`);
    sendResponse({ status: "success" });
  }
});