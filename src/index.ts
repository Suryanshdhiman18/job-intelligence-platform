import inquirer from "inquirer";
import chalk from "chalk";
import { Job } from "./models/Job";
import { GreenhouseScraper } from "./scrapers/greenhouse/GreenhouseScraper";

async function promptUser() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "companyName",
      message: "Enter the company name:",
      validate: (input: string) =>
        input.trim().length > 0 ? true : "Company name cannot be empty.",
    },
    {
      type: "input",
      name: "boardToken",
      message: "Enter the Greenhouse board token:",
      validate: (input: string) =>
        input.trim().length > 0 ? true : "Board token cannot be empty.",
    },
  ]);

  return {
    companyName: answers.companyName.trim(),
    boardToken: answers.boardToken.trim(),
  };
}

async function main() {
  console.log(chalk.bold.cyan("\n🔍 Greenhouse Job Scraper\n"));

  let continueSearching = true;

  while (continueSearching) {
    const { companyName, boardToken } = await promptUser();

    const scraper = new GreenhouseScraper(companyName, boardToken);
    const jobs = await scraper.scrapeJobs();

    if (jobs.length === 0) {
      console.log(
        chalk.yellow(`\nNo jobs found for "${companyName}". Check the board token.`)
      );
    } else {
      console.log(chalk.green(`\n✅ Found ${jobs.length} job(s) at ${companyName}:\n`));
      displayJobs(jobs);
    }

    const { again } = await inquirer.prompt([
      {
        type: "confirm",
        name: "again",
        message: "Search another company?",
        default: false,
      },
    ]);

    continueSearching = again;
  }

  console.log(chalk.cyan("\nDone. Goodbye!\n"));
}

function displayJobs(jobs: Job[]) {
  jobs.forEach((job, i) => {
    console.log(chalk.bold(`${i + 1}. ${job.title}`));
    console.log(`   📍 ${job.location}`);
    console.log(`   🔗 ${chalk.blue(job.applyUrl)}`);
    if (job.postedDate) {
      console.log(`   📅 ${new Date(job.postedDate).toLocaleDateString()}`);
    }
    console.log();
  });
}

main();