import inquirer from "inquirer";
import chalk from "chalk";

import { Job } from "./models/Job";

import { GreenhouseScraper } from "./scrapers/greenhouse/GreenhouseScraper";
import { LeverScraper } from "./scrapers/lever/LeverScraper";

import { companies } from "./config/companies";

import { AshbyScraper }
  from "./scrapers/ashby/AshbyScraper";

import { SmartRecruitersScraper }
  from "./scrapers/smartrecruiters/SmartRecruitersScraper";

import { WorkdayScraper }
  from "./scrapers/workday/WorkdayScraper";

import { CapgeminiScraper }
  from "./scrapers/capgemini/CapgeminiScraper";

import { OracleScraper }
  from "./scrapers/oracle/OracleScraper";

import { SuccessFactorsScraper }
  from "./scrapers/successfactors/SuccessFactorsScraper";

async function promptUser(): Promise<string> {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "companyName",
      message: "Enter company name:",
      validate: (input: string) =>
        input.trim().length > 0
          ? true
          : "Company name cannot be empty."
    }
  ]);

  return answers.companyName.trim();
}

async function main() {

  console.log(
    chalk.bold.cyan(
      "\n🔍 Multi ATS Job Scraper\n"
    )
  );

  let continueSearching = true;

  while (continueSearching) {

    const companyName =
      await promptUser();

    const company =
      companies.find(
        c =>
          c.name.toLowerCase() ===
          companyName.toLowerCase()
      );

    if (!company) {

      console.log(
        chalk.red(
          `\n❌ Company "${companyName}" not found in registry.\n`
        )
      );

      continue;
    }

    let scraper;

    switch (company.ats) {

      case "greenhouse":

        scraper =
          new GreenhouseScraper(
            company.name,
            company.token!
          );

        break;

      case "lever":

        scraper =
          new LeverScraper(
            company.name,
            company.token!
          );

        break;

      case "ashby":

        scraper =
          new AshbyScraper(
            company.name,
            company.token!
          );

        break;

      case "smartrecruiters":

        scraper =
          new SmartRecruitersScraper(
            company.name,
            company.token!
          );

        break;

      case "workday":

        scraper =
          new WorkdayScraper(
            company.name,
            company.tenant!,
            company.site!,
            company.host!
          );

        break;

      case "capgemini":

        scraper =
          new CapgeminiScraper(
            company.name
          );

        break;

      case "oracle":

        scraper =
          new OracleScraper(
            company.name,
            company.apiUrl!,
            company.baseJobUrl!
          );

        break;

      case "successfactors":

        scraper =
          new SuccessFactorsScraper(
            company.name,
            company.careersUrl!
          );

        break;

      default:

        console.log(
          chalk.red(
            `ATS "${company.ats}" is not supported yet.`
          )
        );

        continue;
    }

    console.log(
      chalk.blue(
        `\nFetching jobs from ${company.name} (${company.ats})...\n`
      )
    );

    const jobs =
      await scraper.scrapeJobs();

    if (jobs.length === 0) {

      console.log(
        chalk.yellow(
          `\nNo jobs found for "${company.name}".`
        )
      );

    } else {

      console.log(
        chalk.green(
          `\n✅ Found ${jobs.length} job(s) at ${company.name}\n`
        )
      );

      displayJobs(jobs);
    }

    const { again } =
      await inquirer.prompt([
        {
          type: "confirm",
          name: "again",
          message: "Search another company?",
          default: false
        }
      ]);

    continueSearching = again;
  }

  console.log(
    chalk.cyan(
      "\n👋 Done. Goodbye!\n"
    )
  );
}

function displayJobs(
  jobs: Job[]
) {

  jobs.forEach(
    (job, index) => {

      console.log(
        chalk.bold(
          `${index + 1}. ${job.title}`
        )
      );

      console.log(
        `   📍 ${job.location}`
      );

      console.log(
        `   🔗 ${chalk.blue(
          job.applyUrl
        )}`
      );

      if (job.postedDate) {

        console.log(
          `   📅 ${new Date(
            job.postedDate
          ).toLocaleDateString()}`
        );
      }

      console.log();
    }
  );
}

main();