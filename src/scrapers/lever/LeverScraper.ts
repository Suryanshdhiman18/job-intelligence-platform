import axios from "axios";
import { BaseScraper } from "../../base/BaseScraper";
import { Job } from "../../models/Job";

export class LeverScraper extends BaseScraper {
  constructor(
    private companyName: string,
    private boardToken: string
  ) {
    super();
  }

  async scrapeJobs(): Promise<Job[]> {
    const url = `https://api.lever.co/v0/postings/${this.boardToken}?mode=json`;
    const response = await axios.get(url, { timeout: 8000 });
    return response.data.map((job: any) => ({
      company: this.companyName,
      title: job.text || "No Title",
      location: job.categories?.location || job.workplaceType || "Unknown",
      applyUrl: job.hostedUrl,
      postedDate: job.createdAt
        ? new Date(job.createdAt).toISOString()
        : null,
      platform: "Lever",
    }));
  }
}