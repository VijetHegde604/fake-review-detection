chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkReviews") {
    fetch("http://localhost:5000/check", {
      // Assuming server.py is hosted at localhost:5000
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reviews: request.reviews }),
    })
      .then((response) => response.json())
      .then((data) => sendResponse({ fakePercentage: data.fakePercentage }))
      .catch((error) => console.error("Error:", error));
    return true; // Keeps the message channel open for async sendResponse
  }
});
