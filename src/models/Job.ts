export interface Job {

  company: string;

  title: string;

  location: string;

  applyUrl: string;

  postedDate?: string | null;

  source: string;

  // New fields

  jobId?: string;

  description?: string;

  businessUnit?: string;

  employmentType?: string;

  experienceMin?: number;

  experienceMax?: number;

  designation?: string;

  careerStream?: string;

  jobLevel?: string;

  totalPositions?: number;

  skills?: string[];

  rawData?: any;

  department?: string;

  jobFamily?: string;

  organization?: string;

  workplaceType?: string;
  
}
