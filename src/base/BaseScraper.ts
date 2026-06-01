import { Job } from "../models/Job";

export abstract class BaseScraper {
  abstract scrapeJobs(): Promise<Job[]>;
}