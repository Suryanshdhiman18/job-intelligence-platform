import axios from "axios";
import { BaseScraper } from "../../base/BaseScraper";
import { Job } from "../../models/Job";
import dotenv from "dotenv";

dotenv.config();

export class GoogleJobsScraper extends BaseScraper {
  private apiKey: string;

  constructor(private companyName: string) {
    super();
    this.apiKey = process.env.SERPAPI_KEY || "";
  }

  async scrapeJobs(): Promise<Job[]> {
    if (!this.apiKey) {
      throw new Error(
        "SERPAPI_KEY not set. Get a free key at https://serpapi.com"
      );
    }

    const response = await axios.get("https://serpapi.com/search", {
      params: {
        engine: "google_jobs",
        q: `${this.companyName} jobs`,
        api_key: this.apiKey,
        num: 20,
      },
      timeout: 12000,
    });

    const jobs = response.data.jobs_results ?? [];

    if (jobs.length === 0) return [];

    return jobs.map((job: any) => ({
      company: this.companyName,
      title: job.title || "No Title",
      location: job.location || "Unknown",
      applyUrl:
        job.related_links?.[0]?.link ||
        job.apply_options?.[0]?.link ||
        "N/A",
      postedDate: job.detected_extensions?.posted_at || null,
      platform: "Google Jobs",
    }));
  }
}