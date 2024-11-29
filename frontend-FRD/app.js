import { scrapeReviewText } from "./scraper.js";
const url =
  "https://www.amazon.in/Popsugar-Rechargeable-Control-Headlight-Charging/dp/B0CQK691XQ/?_encoding=UTF8&pd_rd_w=JQewn&content-id=amzn1.sym.1bef8eb0-2346-4755-ba81-a5e9f44b2e73&pf_rd_p=1bef8eb0-2346-4755-ba81-a5e9f44b2e73&pf_rd_r=BV1CEWG78KJT76NTEVVW&pd_rd_wg=mFc3x&pd_rd_r=c8ace79c-dd9c-4eb5-9d96-5e404de68305&ref_=pd_hp_d_btf_PB_toys&th=1";
scrapeReviewText(url, 100)
  .then(() => console.log("Scraping completed."))
  .catch((error) => console.error("Error:", error));
