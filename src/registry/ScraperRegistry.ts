import { BaseScraper } from "../base/BaseScraper";
import { GreenhouseScraper } from "../scrapers/greenhouse/GreenhouseScraper";
import { LeverScraper } from "../scrapers/lever/Leverscraper";
import { AshbyScraper } from "../scrapers/ashby/AshbyScraper";
import { GoogleJobsScraper } from "../scrapers/fallback/GoogleJobsScraper";
import { DetectionResult } from "../detector/PlatformDetector";

export class ScraperRegistry {
  static build(
    companyName: string,
    detection: DetectionResult
  ): BaseScraper {
    switch (detection.platform) {
      case "greenhouse":
        return new GreenhouseScraper(companyName, detection.token);
      case "lever":
        return new LeverScraper(companyName, detection.token);
      case "ashby":
        return new AshbyScraper(companyName, detection.token);
      default:
        return new GoogleJobsScraper(companyName);
    }
  }
}