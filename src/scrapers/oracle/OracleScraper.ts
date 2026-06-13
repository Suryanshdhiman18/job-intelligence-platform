import axios from "axios";

import { BaseScraper } from "../../base/BaseScraper";
import { Job } from "../../models/Job";

export class OracleScraper extends BaseScraper {

    constructor(
        private companyName: string,
        private apiUrl: string,
        private baseJobUrl: string
    ) {
        super();
    }

    async scrapeJobs(): Promise<Job[]> {

        try {

            const jobs: Job[] = [];

            console.log(
                `Calling Oracle API: ${this.apiUrl}`
            );

            const response =
                await axios.get(this.apiUrl);

            const totalJobs =
                response.data.items?.[0]?.TotalJobsCount || 0;

            console.log(
                `Total Jobs Available: ${totalJobs}`
            );

            const requisitions =
                response.data.items?.[0]?.requisitionList || [];

            console.log(
                `Fetched ${requisitions.length} jobs`
            );

            if (requisitions.length === 0) {

                console.log(
                    "No jobs returned from Oracle API"
                );

                return [];
            }

            for (const job of requisitions) {

                const cleanedDescription =
                    job.ShortDescriptionStr
                        ? job.ShortDescriptionStr
                            .replace(/<[^>]*>/g, "")
                            .replace(/\s+/g, " ")
                            .trim()
                        : "";

                const location =
                    job.PrimaryLocation ||
                    job.workLocation?.[0]?.TownOrCity ||
                    "Unknown";

                jobs.push({

                    company:
                        this.companyName,

                    title:
                        job.Title ||
                        "Unknown",

                    location,

                    applyUrl:
                        `${this.baseJobUrl.replace(/\/$/, "")}/${job.Id}`,

                    postedDate:
                        job.PostedDate ||
                        null,

                    source:
                        "oracle",

                    jobId:
                        String(job.Id),

                    description:
                        cleanedDescription,

                    businessUnit:
                        job.BusinessUnit,

                    department:
                        job.Department,

                    employmentType:
                        job.WorkerType ||
                        job.ContractType,

                    designation:
                        job.ManagerLevel,

                    careerStream:
                        job.JobFunction,

                    jobLevel:
                        job.ManagerLevel,

                    jobFamily:
                        job.JobFamily,

                    organization:
                        job.Organization,

                    workplaceType:
                        job.WorkplaceType,

                    // jobType:
                    //     job.JobType,

                    // schedule:
                    //     job.JobSchedule,

                    // shift:
                    //     job.JobShift,

                    // studyLevel:
                    //     job.StudyLevel,

                    // travelRequired:
                    //     job.DomesticTravelRequired ||
                    //     job.InternationalTravelRequired,

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
                `Oracle scrape failed for ${this.companyName}`
            );

            if (error.response) {

                console.error(
                    `Status: ${error.response.status}`
                );

                console.error(
                    error.response.data
                );
            }

            return [];
        }
    }
}