import axios from "axios";

import { BaseScraper } from "../../base/BaseScraper";
import { Job } from "../../models/Job";

export class NextHireScraper extends BaseScraper {

    constructor(
        private companyName: string,
        private apiUrl: string
    ) {
        super();
    }

    async scrapeJobs(): Promise<Job[]> {

        try {

            console.log(
                `Calling NextHire API: ${this.apiUrl}`
            );

            const response =
                await axios.post(
                    this.apiUrl,
                    {
                        source: "careers",
                        code: "",
                        filterByBuId: -1
                    },
                    {
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );

            const jobPostings =
                response.data.reqDetailsBOList || [];

            console.log(
                `Fetched ${jobPostings.length} jobs`
            );

            if (
                jobPostings.length === 0
            ) {

                console.log(
                    "No jobs returned from NextHire API"
                );

                return [];
            }

            const jobs: Job[] = [];

            for (const job of jobPostings) {

                const cleanedDescription =
                    job.jdDisplay
                        ? job.jdDisplay
                              .replace(/<[^>]*>/g, "")
                              .replace(/\s+/g, " ")
                              .trim()
                        : "";

                const locations =
                    job.locationList?.length
                        ? job.locationList
                              .map(
                                  (loc: any) =>
                                      loc.office
                              )
                              .join(", ")
                        : job.location;

                jobs.push({

                    company:
                        this.companyName,

                    title:
                        job.reqTitle ||
                        "Unknown",

                    location:
                        locations ||
                        "Unknown",

                    applyUrl:
                        "https://careers.swiggy.com/#/careers",

                    postedDate:
                        job.approvedOn ||
                        null,

                    source:
                        "nexthire",

                    jobId:
                        String(
                            job.reqId
                        ),

                    description:
                        cleanedDescription,

                    businessUnit:
                        job.buName,

                    employmentType:
                        job.employmentType,

                    experienceMin:
                        job.expMin,

                    experienceMax:
                        job.expMax,

                    designation:
                        job.designation,

                    careerStream:
                        job.careerStream,

                    jobLevel:
                        job.jobLevel,

                    totalPositions:
                        job.totalPositions,

                    rawData:
                        job
                });
            }

            console.log(
                `Total Jobs: ${jobs.length}`
            );

            return jobs;

        } catch (error: any) {

            console.error(
                `NextHire scrape failed for ${this.companyName}`
            );

            if (
                error.response
            ) {

                console.error(
                    `Status: ${error.response.status}`
                );

                console.error(
                    `Status Text: ${error.response.statusText}`
                );
            }

            return [];
        }
    }
}