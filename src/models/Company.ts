export interface Company {

  name: string;

  ats:
    | "greenhouse"
    | "lever"
    | "ashby"
    | "smartrecruiters"
    | "workday";

  token?: string;

  tenant?: string;

  site?: string;

  host?: string;
}