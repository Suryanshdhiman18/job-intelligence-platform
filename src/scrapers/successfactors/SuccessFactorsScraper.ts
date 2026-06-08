import axios from "axios";
import * as cheerio from "cheerio";

import { BaseScraper } from "../../base/BaseScraper";
import { Job } from "../../models/Job";

export class SuccessFactorsScraper extends BaseScraper {

    constructor(
        private companyName: string,
        private careersUrl: string
    ) {
        super();
    }

    async scrapeJobs(): Promise<Job[]> {

        try {

            const jobs: Job[] = [];

            const PAGE_SIZE = 25;
            const MAX_PAGES = 5;

            for (
                let page = 0;
                page < MAX_PAGES;
                page++
            ) {

                const startRow =
                    page * PAGE_SIZE;

                const separator =
                    this.careersUrl.includes("?")
                        ? "&"
                        : "?";

                const url =
                    `${this.careersUrl}${separator}startrow=${startRow}`;

                console.log(
                    `Fetching page ${page + 1}...`
                );

                console.log(url);

                const response =
                    await axios.get(url);

                const $ =
                    cheerio.load(response.data);

                $(".data-row").each(
                    (_, element) => {

                        const title =
                            $(element)
                                .find(".jobTitle-link")
                                .first()
                                .text()
                                .trim();

                        const relativeUrl =
                            $(element)
                                .find(".jobTitle-link")
                                .attr("href");

                        const location =
                            $(element)
                                .find(".jobLocation")
                                .text()
                                .trim();

                        if (
                            !title ||
                            !relativeUrl
                        ) {
                            return;
                        }

                        jobs.push({

                            company:
                                this.companyName,

                            title,

                            location:
                                location ||
                                "Unknown",

                            applyUrl:
                                `https://careers.ey.com${relativeUrl}`,

                            postedDate:
                                null,

                            source:
                                "successfactors"
                        });
                    }
                );

                console.log(
                    `Collected ${jobs.length} jobs so far`
                );

                if (
                    $(".data-row").length === 0
                ) {
                    break;
                }
            }

            console.log(
                `Total Jobs: ${jobs.length}`
            );

            return jobs;

        } catch (error: any) {

            console.error(
                `SuccessFactors scrape failed for ${this.companyName}`
            );

            if (error.response) {

                console.error(
                    `Status: ${error.response.status}`
                );

                console.error(
                    `Status Text: ${error.response.statusText}`
                );

                console.error(
                    `URL: ${error.config?.url}`
                );
            }

            return [];
        }
    }
}