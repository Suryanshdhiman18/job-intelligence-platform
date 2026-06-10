import axios from "axios";

import { BaseScraper } from "../../base/BaseScraper";
import { Job } from "../../models/Job";

export class CapgeminiScraper extends BaseScraper {

    constructor(
        private companyName: string
    ) {
        super();
    }

    async scrapeJobs(): Promise<Job[]> {

        try {

            const jobs: Job[] = [];

            let page = 1;

            const pageSize = 25;

            const MAX_PAGES = 5;

            while (page <= MAX_PAGES) {

                const apiUrl =
                    `https://cg-jobstream-api.azurewebsites.net/api/job-search?page=${page}&size=${pageSize}`;

                console.log(
                    `Fetching page ${page}...`
                );

                const response =
                    await axios.get(apiUrl);

                if (page === 1) {

                    console.log(
                        `Total Jobs Available: ${response.data.count}`
                    );
                }

                const jobData =
                    response.data.data || [];

                if (jobData.length === 0) {

                    console.log(
                        "No more jobs found."
                    );

                    break;
                }

                console.log(
                    `Fetched ${jobData.length} jobs`
                );

                for (const job of jobData) {

                    jobs.push({

                        company:
                            this.companyName,

                        title:
                            job.title ||
                            "Unknown",

                        location:
                            job.location ||
                            "Unknown",

                        applyUrl:
                            job.apply_job_url ||
                            "",

                        postedDate:
                            job.updated_at ||
                            null,

                        source:
                            "capgemini"
                    });
                }

                page++;
            }

            console.log(
                `Total Jobs Extracted: ${jobs.length}`
            );

            return jobs;

        } catch (error: any) {

            console.error(
                `Capgemini scrape failed`
            );

            if (error.response) {

                console.error(
                    `Status: ${error.response.status}`
                );
            }

            return [];
        }
    }
}