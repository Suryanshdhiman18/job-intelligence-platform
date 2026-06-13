export type ATSProvider =
  | "greenhouse"
  | "lever"
  | "ashby"
  | "smartrecruiters"
  | "workday"
  | "capgemini"
  | "oracle"
  | "successfactors"
  | "nexthire";

export interface Company {

  name: string;

  ats: ATSProvider;

  token?: string;

  tenant?: string;

  site?: string;

  host?: string;

  apiUrl?: string;

  baseJobUrl?: string;

  careersUrl?: string;
}