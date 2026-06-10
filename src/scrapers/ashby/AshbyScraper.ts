import axios from "axios";

import { BaseScraper } from "../../base/BaseScraper";
import { Job } from "../../models/Job";

export class AshbyScraper extends BaseScraper {

  constructor(
    private companyName: string,
    private companyToken: string
  ) {
    super();
  }

  async scrapeJobs(): Promise<Job[]> {

    try {

      const apiUrl =
        `https://api.ashbyhq.com/posting-api/job-board/${this.companyToken}`;

      console.log(
        `Calling Ashby API: ${apiUrl}`
      );

      const response =
        await axios.get(
          apiUrl,
          {
            timeout: 15000
          }
        );

      console.log(
        `Jobs Returned: ${response.data.jobs?.length || 0}`
      );

      const jobs =
        response.data.jobs || [];

      return jobs.map(
        (job: any) => ({

          company:
            this.companyName,

          title:
            job.title,

          location:
            job.location ||
            "Unknown",

          applyUrl:
            job.applyUrl,

          postedDate:
            job.publishedAt,

          source:
            "ashby"
        })
      );

    } catch (error: any) {

      console.error(
        `Ashby scrape failed for ${this.companyName}`
      );

      if (error.response) {

        console.error(
          `Status: ${error.response.status}`
        );

      } else {

        console.error(
          error.message
        );
      }

      return [];
    }
  }
}