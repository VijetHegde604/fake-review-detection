import express from "express";
import scrapeReviewText from "./scraper.js";
import dotenv from "dotenv";
import cors from "cors"; // Add this importcl
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());

app.use(express.json());

app.post("/scrape-reviews", async (req, res) => {
  try {
    const { url, maxReviews } = req.body;

    if (!url) {
      return res.status(400).json({ error: "Product URL is required" });
    }

    const reviews = await scrapeReviewText(url, maxReviews || 50);

    res.json({
      reviews: reviews,
    });
  } catch (error) {
    console.error("Scraping error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to scrape reviews",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
