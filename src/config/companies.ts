import { Company }
    from "../models/Company";

export const companies: Company[] = [

    // Greenhouse
    {
        name: "stripe",
        ats: "greenhouse",
        token: "stripe"
    },

    {
        name: "notion",
        ats: "greenhouse",
        token: "notion"
    },

    {
        name: "datadog",
        ats: "greenhouse",
        token: "datadog"
    },

    {
        name: "Postman",
        ats: "greenhouse",
        token: "postman"
    },

    // Lever

    {
        name: "Atlassian",
        ats: "lever",
        token: "atlassian"
    },

    {
        name: "Netflix",
        ats: "lever",
        token: "Netflix"
    },

    {
        name: "y",
        ats: "greenhouse",
        token: "anthropic"
    },

    {
        name: "Ramp",
        ats: "ashby",
        token: "ramp"
    },

    {
        name: "Deel",
        ats: "ashby",
        token: "deel"
    },

    {
        name: "Linear",
        ats: "ashby",
        token: "linear"
    },

    {
        name: "Shopify",
        ats: "ashby",
        token: "shopify"
    },

    {
        name: "Visa",
        ats: "smartrecruiters",
        token: "Visa"
    },

    {
        name: "Bosch",
        ats: "smartrecruiters",
        token: "BoschGroup"
    },

    {
        name: "Ubisoft",
        ats: "smartrecruiters",
        token: "Ubisoft"
    },

    {
        name: "Publicis Groupe",
        ats: "smartrecruiters",
        token: "PublicisGroupe"
    },

    {
        name: "Infineon",
        ats: "smartrecruiters",
        token: "InfineonTechnologies"
    },

    // Workday

    {
        name: "PwC",
        ats: "workday",
        tenant: "pwc",
        site: "Global_Experienced_Careers",
        host: "wd3"
    },

    {
        name: "Elevance Health",
        ats: "workday",
        tenant: "elevancehealth",
        site: "carelonglobal_in",
        host: "wd1"
    },

    // Custom API

    {
        name: "Capgemini",
        ats: "capgemini"
    },

    {
        name: "KPMG",
        ats: "oracle",

        apiUrl:
            "https://ejgk.fa.em2.oraclecloud.com/hcmRestApi/resources/latest/recruitingCEJobRequisitions?onlyData=true&expand=requisitionList.workLocation,requisitionList.otherWorkLocations,requisitionList.secondaryLocations,flexFieldsFacet.values,requisitionList.requisitionFlexFields&finder=findReqs;siteNumber=CX_3001,facetsList=LOCATIONS%3BWORK_LOCATIONS%3BWORKPLACE_TYPES%3BTITLES%3BCATEGORIES%3BORGANIZATIONS%3BPOSTING_DATES%3BFLEX_FIELDS,limit=25,sortBy=POSTING_DATES_DESC",

        baseJobUrl:
            "https://ejgk.fa.em2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_3001/jobs/preview/"
    },

    {
        name: "EY",
        ats: "successfactors",

        careersUrl:
            "https://careers.ey.com/ey/search/?q=&sortColumn=referencedate&sortDirection=desc"
    },

    // NextHire

    {
        name: "Swiggy",
        ats: "nexthire",
        apiUrl:
            "https://swiggy.mynexthire.com/employer/careers/reqlist/get"
    }


];