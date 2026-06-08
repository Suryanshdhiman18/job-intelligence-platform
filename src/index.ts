import inquirer from "inquirer";
import chalk from "chalk";
import * as dotenv from "dotenv";
import { PlatformDetector } from "./detector/PlatformDetector";
import { ScraperRegistry } from "./registry/ScraperRegistry";
import { Job } from "./models/Job";

dotenv.config();

async function promptUser() {
  return inquirer.prompt([
    {
      type: "input",
      name: "companyName",
      message: "Enter company name:",
      validate: (v: string) =>
        v.trim().length > 0 ? true : "Company name cannot be empty.",
    },
  ]);
}

function displayJobs(jobs: Job[]) {
  jobs.forEach((job, i) => {
    console.log(chalk.bold(`\n${i + 1}. ${job.title}`));
    console.log(`   Location : ${job.location}`);
    console.log(`   Apply    : ${chalk.cyan(job.applyUrl)}`);
    if (job.postedDate) {
      console.log(`   Posted   : ${job.postedDate}`);
    }
  });
}

async function main() {
  console.log(chalk.bold.cyan("\n🔍 Universal Job Scraper\n"));

  const detector = new PlatformDetector();
  let continueSearching = true;

  while (continueSearching) {
    const { companyName } = await promptUser();
    const name = companyName.trim();

    console.log(chalk.gray(`\nDetecting platform for "${name}"...`));

    let detection;
    try {
      detection = await detector.detect(name);
    } catch (err) {
      console.log(chalk.red("Network error during detection. Check your connection."));
      continue;
    }

    console.log(
      chalk.gray(`Platform detected: ${chalk.white(detection.platform)}`)
    );
    console.log(chalk.gray("Fetching jobs...\n"));

    let jobs: Job[] = [];

    try {
      const scraper = ScraperRegistry.build(name, detection);
      jobs = await scraper.scrapeJobs();
    } catch (err: any) {
      if (detection.platform !== "google") {
        // Platform API found but failed — try Google fallback
        console.log(
          chalk.yellow(
            "Platform API failed, falling back to Google Jobs..."
          )
        );
        try {
          const { GoogleJobsScraper } = await import(
            "./scrapers/fallback/GoogleJobsScraper"
          );
          jobs = await new GoogleJobsScraper(name).scrapeJobs();
        } catch (fallbackErr: any) {
          console.log(chalk.red(`Error: ${fallbackErr.message}`));
        }
      } else {
        console.log(chalk.red(`Error: ${err.message}`));
      }
    }

    if (jobs.length === 0) {
      console.log(
        chalk.yellow(
          `No jobs found for "${name}". The company may not be hiring, or uses a platform we don't support yet.`
        )
      );
    } else {
      console.log(
        chalk.green(`Found ${jobs.length} job(s) at ${name} via ${jobs[0].platform}:`)
      );
      displayJobs(jobs);
    }

    const { again } = await inquirer.prompt([
      {
        type: "confirm",
        name: "again",
        message: "\nSearch another company?",
        default: false,
      },
    ]);
    continueSearching = again;
  }

  console.log(chalk.cyan("\nDone.\n"));
}

main();