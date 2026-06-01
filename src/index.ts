import { GreenhouseScraper }
from "./scrapers/greenhouse/GreenhouseScraper";

async function main() {

  const scraper =
    new GreenhouseScraper(
      "Vercel",
      "Vercel",
    );

  const jobs =
    await scraper.scrapeJobs();

  console.log(
    `\nFinal Job Count: ${jobs.length}`
  );
}

main();