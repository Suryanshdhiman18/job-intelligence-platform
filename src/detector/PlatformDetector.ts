import axios from "axios";

export type Platform =
  | "greenhouse"
  | "lever"
  | "ashby"
  | "google";

export interface DetectionResult {
  platform: Platform;
  token: string;
}

export class PlatformDetector {
  // Normalise "Stripe Inc." → "stripe"
  private slugify(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .trim();
  }

  async detect(companyName: string): Promise<DetectionResult> {
    const slug = this.slugify(companyName);

    // Try all platforms in parallel — first one that resolves wins
    const checks = [
      this.tryGreenhouse(slug, companyName),
      this.tryLever(slug, companyName),
      this.tryAshby(slug, companyName),
    ];

    const results = await Promise.allSettled(checks);

    for (const result of results) {
      if (result.status === "fulfilled" && result.value) {
        return result.value;
      }
    }

    // Nothing matched — fall back to Google Jobs
    return { platform: "google", token: companyName };
  }

  private async tryGreenhouse(
    slug: string,
    companyName: string
  ): Promise<DetectionResult | null> {
    try {
      const res = await axios.get(
        `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`,
        { timeout: 5000 }
      );
      if (res.data?.jobs?.length >= 0) {
        return { platform: "greenhouse", token: slug };
      }
    } catch {
      // Try common variants
      const variants = this.getVariants(slug, companyName);
      for (const v of variants) {
        try {
          const r = await axios.get(
            `https://boards-api.greenhouse.io/v1/boards/${v}/jobs`,
            { timeout: 4000 }
          );
          if (r.data?.jobs !== undefined) {
            return { platform: "greenhouse", token: v };
          }
        } catch {}
      }
    }
    return null;
  }

  private async tryLever(
    slug: string,
    companyName: string
  ): Promise<DetectionResult | null> {
    try {
      const res = await axios.get(
        `https://api.lever.co/v0/postings/${slug}?mode=json`,
        { timeout: 5000 }
      );
      if (Array.isArray(res.data)) {
        return { platform: "lever", token: slug };
      }
    } catch {
      const variants = this.getVariants(slug, companyName);
      for (const v of variants) {
        try {
          const r = await axios.get(
            `https://api.lever.co/v0/postings/${v}?mode=json`,
            { timeout: 4000 }
          );
          if (Array.isArray(r.data)) {
            return { platform: "lever", token: v };
          }
        } catch {}
      }
    }
    return null;
  }

  private async tryAshby(
    slug: string,
    companyName: string
  ): Promise<DetectionResult | null> {
    const variants = [slug, ...this.getVariants(slug, companyName)];
    for (const v of variants) {
      try {
        const res = await axios.post(
          "https://jobs.ashbyhq.com/api/non-user-graphql?op=ApiJobBoardWithTeams",
          {
            operationName: "ApiJobBoardWithTeams",
            variables: { organizationHostedJobsPageName: v },
            query: `query ApiJobBoardWithTeams($organizationHostedJobsPageName: String!) {
              jobBoard: jobBoardWithTeams(organizationHostedJobsPageName: $organizationHostedJobsPageName) {
                jobPostings { id }
              }
            }`,
          },
          { timeout: 5000 }
        );
        if (res.data?.data?.jobBoard !== null) {
          return { platform: "ashby", token: v };
        }
      } catch {}
    }
    return null;
  }

  // Produce common slug variations: "openai" → ["open-ai", "open_ai"]
  private getVariants(slug: string, originalName: string): string[] {
    const clean = originalName.toLowerCase().replace(/[^a-z0-9\s]/g, "");
    const hyphenated = clean.trim().replace(/\s+/g, "-");
    const underscored = clean.trim().replace(/\s+/g, "_");
    return [...new Set([hyphenated, underscored, slug])];
  }
}