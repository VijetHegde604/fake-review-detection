import { scrapeReviewText } from "./scraper.js";
const url =
  "https://www.amazon.in/Bosch-Aquatak-1500-Watt-Pressure-Washer/dp/B07BLCWPNR/?_encoding=UTF8&pd_rd_w=HUHBQ&content-id=amzn1.sym.509965a2-791b-4055-b876-943397d37ed3%3Aamzn1.symc.fc11ad14-99c1-406b-aa77-051d0ba1aade&pf_rd_p=509965a2-791b-4055-b876-943397d37ed3&pf_rd_r=9P5FFJT8RVMJSRSHSKHG&pd_rd_wg=5g8eL&pd_rd_r=6b281189-be98-477a-abeb-64ed6cecdd7f&ref_=pd_hp_d_atf_ci_mcx_mr_ca_hp_atf_d#customerReviews";
scrapeReviewText(url, 100)
  .then(() => console.log("Scraping completed."))
  .catch((error) => console.error("Error:", error));
