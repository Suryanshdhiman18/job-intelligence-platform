import axios from "axios";

import { BaseScraper } from "../../base/BaseScraper";
import { Job } from "../../models/Job";

export class SmartRecruitersScraper
  extends BaseScraper {

  constructor(
    private companyName: string,
    private companyToken: string
  ) {
    super();
  }

  async scrapeJobs(): Promise<Job[]> {

    try {

      const url =
        `https://api.smartrecruiters.com/v1/companies/${this.companyToken}/postings`;

      const response =
        await axios.get(url);

      const jobs =
        response.data.content || [];

      return jobs.map(
        (job: any) => ({

          company:
            this.companyName,

          title:
            job.name,

          location:
            job.location?.city ||
            "Unknown",

          applyUrl:
            job.ref,

          postedDate:
            job.releasedDate,

          source:
            "smartrecruiters"
        })
      );

    } catch (error) {

      console.error(
        `SmartRecruiters scrape failed for ${this.companyName}`
      );

      return [];
    }
  }
}