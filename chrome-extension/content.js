const reviews = Array.from(document.querySelectorAll(".review-text")).map(
  (review) => review.textContent
);
chrome.runtime.sendMessage(
  { action: "checkReviews", reviews: reviews },
  (response) => {
    console.log("Fake review percentage: ", response.fakePercentage);
  }
);
