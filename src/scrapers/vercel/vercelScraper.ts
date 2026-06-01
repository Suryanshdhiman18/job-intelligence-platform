import { chromium } from "playwright";
import { BaseScraper } from "../base/BaseScraper";
import { Job } from "../../models/Job";

export class VercelScraper extends BaseScraper {

  async scrapeJobs(): Promise<Job[]> {

    const browser = await chromium.launch({
      headless: false
    });

    const page = await browser.newPage();

    const jobs: Job[] = [];

    // Used for duplicate prevention
    const visitedLinks = new Set<string>();

    try {

      // Monitor possible hidden APIs
      page.on(
        "response",
        async (response) => {

          const url = response.url();

          if (
            url.includes("job") ||
            url.includes("greenhouse") ||
            url.includes("lever")
          ) {

            console.log(
              "\nPossible Job API Found:",
              url
            );
          }
        }
      );

      // Open careers page
      await page.goto(
        "https://vercel.com/careers",
        {
          waitUntil: "networkidle"
        }
      );

      // Wait for rendering
      await page.waitForTimeout(5000);

      // Extract all anchor tags
      const allLinks =
        await page.locator("a").all();

      console.log(
        `\nTotal Links Found: ${allLinks.length}`
      );

      // Process links
      for (const link of allLinks) {

        const text =
          await link.textContent();

        const href =
          await link.getAttribute("href");

        // Skip invalid links
        if (!href || !text) {
          continue;
        }

        // Match only career job links
        if (
          href.includes("/careers/")
        ) {

          // Prevent duplicates
          if (
            visitedLinks.has(href)
          ) {
            continue;
          }

          visitedLinks.add(href);

          // Clean text
          const cleanedTitle =
            text.replace(/\s+/g, " ").trim();

          jobs.push({
            company: "Vercel",
            title: cleanedTitle,
            location: "Unknown",
            applyUrl: `https://vercel.com${href}`
          });
        }
      }

      console.log(
        `\nTotal Jobs Extracted: ${jobs.length}`
      );

      console.table(jobs);

      return jobs;

    } catch (error) {

      console.error(
        "\nScraping failed:",
        error
      );

      return [];

    } finally {

      await browser.close();
    }
  }
}