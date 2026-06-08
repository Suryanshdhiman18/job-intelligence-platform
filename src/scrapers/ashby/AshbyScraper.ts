import axios from "axios";
import { BaseScraper } from "../../base/BaseScraper";
import { Job } from "../../models/Job";

export class AshbyScraper extends BaseScraper {
  constructor(
    private companyName: string,
    private boardToken: string
  ) {
    super();
  }

  async scrapeJobs(): Promise<Job[]> {
    const url = `https://jobs.ashbyhq.com/api/non-user-graphql?op=ApiJobBoardWithTeams`;
    const response = await axios.post(
      url,
      {
        operationName: "ApiJobBoardWithTeams",
        variables: { organizationHostedJobsPageName: this.boardToken },
        query: `query ApiJobBoardWithTeams($organizationHostedJobsPageName: String!) {
          jobBoard: jobBoardWithTeams(organizationHostedJobsPageName: $organizationHostedJobsPageName) {
            jobPostings {
              id title locationName isRemote jobRequisitionId
              externalLink updatedAt
            }
          }
        }`,
      },
      { timeout: 8000 }
    );

    const postings =
      response.data?.data?.jobBoard?.jobPostings ?? [];

    return postings.map((job: any) => ({
      company: this.companyName,
      title: job.title || "No Title",
      location: job.isRemote ? "Remote" : job.locationName || "Unknown",
      applyUrl:
        job.externalLink ||
        `https://jobs.ashbyhq.com/${this.boardToken}/${job.id}`,
      postedDate: job.updatedAt || null,
      platform: "Ashby",
    }));
  }
}