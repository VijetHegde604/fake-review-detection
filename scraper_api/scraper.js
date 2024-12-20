import puppeteer from "puppeteer";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const COOKIES_FILE_PATH = "./data/cookies.json";

async function saveCookies(page) {
  const cookies = await page.cookies();
  fs.writeFileSync(COOKIES_FILE_PATH, JSON.stringify(cookies, null, 2));
  console.log("Cookies saved to:", COOKIES_FILE_PATH);
}

async function loadCookies(page) {
  if (fs.existsSync(COOKIES_FILE_PATH)) {
    const cookies = JSON.parse(fs.readFileSync(COOKIES_FILE_PATH));
    await page.setCookie(...cookies);
    console.log("Cookies loaded from:", COOKIES_FILE_PATH);
    return true;
  }
  return false;
}

async function loginIfNeeded(page) {
  if (!(await loadCookies(page))) {
    console.log("No valid cookies found. Logging in...");
    await page.goto(
      "https://www.amazon.in/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.in%2F%3Fref_%3Dnav_custrec_signin&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=inflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0"
    );

    // Login process
    await page.waitForSelector("#ap_email");
    await page.type("#ap_email", process.env.AMAZON_EMAIL);
    await page.click("#continue");
    await page.waitForSelector("#ap_password");
    await page.type("#ap_password", process.env.AMAZON_PASSWORD);
    await page.click("#signInSubmit");

    // Wait for navigation to confirm login
    await page.waitForNavigation();
    console.log("Login successful!");

    // Save cookies
    await saveCookies(page);
  }
}

async function scrapeReviewText(productPageURL, maxReviews = 100) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  // Log in or load cookies
  await loginIfNeeded(page);

  // Modify the product page URL to point to the reviews section
  const reviewPageURL = productPageURL.replace("/dp/", "/product-reviews/");
  console.log(`Navigating to: ${reviewPageURL}`);

  let reviews = [];
  let nextPageExists = true;
  let currentPage = 1;

  // Start scraping reviews with pagination
  while (reviews.length < maxReviews && nextPageExists) {
    console.log(`Scraping page ${currentPage}...`);

    // Navigate to the current review page
    await page.goto(`${reviewPageURL}?pageNumber=${currentPage}`);

    // Wait for the reviews section to load
    try {
      await page.waitForSelector(".a-row.a-spacing-small.review-data", {
        timeout: 5000,
      });
    } catch (e) {
      console.log("No more reviews found.");
      break;
    }

    // Extract reviews on the current page
    const pageReviews = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".a-section.celwidget"))
        .map((reviewElement) => {
          const textElement = reviewElement.querySelector(
            "span[data-hook='review-body'] span"
          );
          const text = textElement ? textElement.textContent.trim() : "";

          const ratingElement = reviewElement.querySelector(
            "i[data-hook='review-star-rating']"
          );
          const ratingText = ratingElement
            ? ratingElement.querySelector(".a-icon-alt").textContent
            : "";
          const rating = ratingText
            ? parseFloat(ratingText.split(" ")[0])
            : null;

          return {
            text: text.toLowerCase() !== "read more" ? text : "",
            rating: rating,
          };
        })
        .filter((review) => review.text && review.rating);
    });

    reviews = [...reviews, ...pageReviews];
    console.log(`Collected ${reviews.length} reviews so far.`);

    // Check if there's a next page
    nextPageExists = await page.evaluate(() => {
      const nextButton = document.querySelector("li.a-last a");
      return nextButton !== null;
    });

    currentPage++;
  }

  // Limit reviews to the maximum specified
  reviews = reviews.slice(0, maxReviews);

  console.log(`Scraped ${reviews.length} reviews.`);

  await browser.close();
  return reviews;
}

export default scrapeReviewText;
