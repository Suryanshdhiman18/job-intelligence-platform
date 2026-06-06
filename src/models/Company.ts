export type ATSProvider =
  | "greenhouse"
  | "lever"
  | "ashby"
  | "smartrecruiters"
  | "workday"
  | "capgemini"
  | "oracle";

export interface Company {

  name: string;

  ats: ATSProvider;

  token?: string;

  tenant?: string;

  site?: string;

  host?: string;
}