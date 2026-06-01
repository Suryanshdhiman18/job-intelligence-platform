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
  
    //Trying to push:
  console.log(
    `\nFinal Job Count: ${jobs.length}`
  );
}

main();