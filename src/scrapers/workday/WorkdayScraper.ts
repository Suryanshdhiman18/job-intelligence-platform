import axios from "axios";

import { BaseScraper } from "../../base/BaseScraper";
import { Job } from "../../models/Job";

export class WorkdayScraper extends BaseScraper {

    constructor(
        private companyName: string,
        private tenant: string,
        private site: string,
        private host: string
    ) {
        super();
    }

    async scrapeJobs(): Promise<Job[]> {

        try {

            const jobs: Job[] = [];

            let offset = 0;

            const limit = 20;

            const MAX_PAGES = 5;

            let pageCount = 0;

            const apiUrl =
                `https://${this.tenant}.${this.host}.myworkdayjobs.com/wday/cxs/${this.tenant}/${this.site}/jobs`;

            console.log(
                `Calling Workday API: ${apiUrl}`
            );

            while (true) {

                const response =
                    await axios.post(
                        apiUrl,
                        {
                            appliedFacets: {},
                            limit,
                            offset,
                            searchText: ""
                        },
                        {
                            headers: {
                                "Content-Type":
                                    "application/json"
                            }
                        }
                    );

                const jobPostings =
                    response.data.jobPostings || [];

                console.log(
                    `Fetched ${jobPostings.length} jobs (offset=${offset})`
                );

                if (jobPostings.length === 0) {
                    break;
                }

                for (const job of jobPostings) {

                    jobs.push({

                        company:
                            this.companyName,

                        title:
                            job.title,

                        location:
                            job.locationsText ||
                            "Unknown",

                        applyUrl:
                            `https://${this.tenant}.${this.host}.myworkdayjobs.com${job.externalPath}`,

                        postedDate:
                            job.postedOn,

                        source:
                            "workday"
                    });
                }

                offset += limit;

                pageCount++;

                if (pageCount >= MAX_PAGES) {

                    console.log(
                        `Reached MAX_PAGES (${MAX_PAGES})`
                    );

                    break;
                }
            }

            console.log(
                `Total Jobs: ${jobs.length}`
            );

            return jobs;

        } catch (error: any) {

            console.error(
                `Workday scrape failed for ${this.companyName}`
            );

            if (
                error.response
            ) {

                console.error(
                    error.response.status
                );
            }

            return [];
        }
    }
}