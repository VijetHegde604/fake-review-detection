document.getElementById("analyze-reviews").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: scrapeReviews,
    });
  });
});

function scrapeReviews() {
  const reviews = Array.from(document.querySelectorAll(".review-text")).map(
    (review) => review.textContent
  );
  chrome.runtime.sendMessage(
    { action: "checkReviews", reviews: reviews },
    (response) => {
      document.getElementById(
        "result"
      ).textContent = `Fake review percentage: ${response.fakePercentage}%`;
    }
  );
}
