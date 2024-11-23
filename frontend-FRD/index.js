import puppeteer from "puppeteer";
import fs from "fs";

const COOKIES_FILE_PATH = "cookies.json"; // Path to store cookies

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
    await page.goto("https://www.amazon.in/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.in%2F%3Fref_%3Dnav_custrec_signin&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=inflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0");

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
  const browser = await puppeteer.launch({ headless: true });
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
          const rating = ratingText ? parseFloat(ratingText.split(" ")[0]) : null;

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

  // Write reviews to a file
  fs.writeFileSync("reviews.json", JSON.stringify(reviews, null, 2));
  console.log(`Scraped ${reviews.length} reviews.`);
  console.log("Reviews saved to reviews.json");

  await browser.close();
  return reviews;
}

// Provide the product page URL
const productPageURL =
  "https://www.amazon.in/Solimo-Plastic-Cutter-Silver-SOKT165/dp/B07PBBXV86/?_encoding=UTF8&pd_rd_w=OZQ08&content-id=amzn1.sym.5fb50278-ac8e-4ca6-8fd4-02427124e9ff&pf_rd_p=5fb50278-ac8e-4ca6-8fd4-02427124e9ff&pf_rd_r=T7GQ3E447X1682AS8W2H&pd_rd_wg=OQ7Zi&pd_rd_r=4d64282a-51b2-4c28-ab91-f9bc31f39983&ref_=pd_hp_d_btf_PB&th=1";
scrapeReviewText(productPageURL, 100);
