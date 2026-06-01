import axios from "axios";

import { BaseScraper } from "../base/BaseScraper";
import { Job } from "../../models/Job";

export class GreenhouseScraper extends BaseScraper {

  constructor(
    private companyName: string,
    private boardToken: string
  ) {
    super();
  }

  async scrapeJobs(): Promise<Job[]> {

    try {

      const apiUrl =
        `https://boards-api.greenhouse.io/v1/boards/${this.boardToken}/jobs`;

      console.log(
        `\nFetching jobs from: ${apiUrl}`
      );

      const response =
        await axios.get(apiUrl);

      const jobsData =
        response.data.jobs;

      const jobs: Job[] =
        jobsData.map((job: any) => {

          return {
            company: this.companyName,

            title: job.title || "No Title",

            location:
              job.location?.name || "Unknown",

            applyUrl:
              job.absolute_url,

            postedDate:
              job.updated_at || null
          };
        });

      console.log(
        `\nTotal Jobs Extracted: ${jobs.length}`
      );

      console.table(jobs);

      return jobs;

    } catch (error) {

      console.error(
        "\nGreenhouse scraping failed:",
        error
      );

      return [];
    }
  }
}