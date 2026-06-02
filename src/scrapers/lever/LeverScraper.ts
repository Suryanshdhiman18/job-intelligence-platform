import axios from "axios";

import { BaseScraper } from "../../base/BaseScraper";
import { Job } from "../../models/Job";

export class LeverScraper extends BaseScraper {

  constructor(
    private companyName: string,
    private companyToken: string
  ) {
    super();
  }

  async scrapeJobs(): Promise<Job[]> {

    const apiUrl =
      `https://api.lever.co/v0/postings/${this.companyToken}`;

    try {

      console.log(
        `\nCalling: ${apiUrl}`
      );

      const response =
        await axios.get(apiUrl);

      console.log(
        `Response Status: ${response.status}`
      );

      console.log(
        `Jobs Returned: ${response.data.length}`
      );

      if (response.data.length === 0) {

        console.log(
          `No active jobs returned from Lever API`
        );

        return [];
      }

      const jobs: Job[] =
        response.data.map((job: any) => ({

          company: this.companyName,

          title:
            job.text || "Unknown",

          location:
            job.categories?.location ||
            "Unknown",

          applyUrl:
            job.hostedUrl,

          postedDate:
            job.createdAt
              ? new Date(
                  job.createdAt
                ).toISOString()
              : null,

          source: "lever"
        }));

      console.log(
        `Successfully extracted ${jobs.length} jobs`
      );

      return jobs;

    } catch (error: any) {

      console.error(
        `\nLever scrape failed for ${this.companyName}`
      );

      if (error.response) {

        console.error(
          `Status: ${error.response.status}`
        );

        console.error(
          `Status Text: ${error.response.statusText}`
        );

        console.error(
          `URL: ${apiUrl}`
        );

      } else {

        console.error(
          `Error: ${error.message}`
        );
      }

      return [];
    }
  }
}