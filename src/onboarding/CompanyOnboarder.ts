import inquirer from "inquirer";

import { detectATS }
from "../utils/ATSDetector";

import { extractToken }
from "../utils/TokenExtractor";

export async function onboardCompany() {

  const answers =
    await inquirer.prompt([
      {
        type: "input",
        name: "companyName",
        message: "Company Name:",
        validate: (input: string) =>
          input.trim().length > 0
            ? true
            : "Company name is required."
      },
      {
        type: "input",
        name: "careersUrl",
        message: "Careers URL:",
        validate: (input: string) =>
          input.trim().length > 0
            ? true
            : "Careers URL is required."
      }
    ]);

  const companyName =
    answers.companyName.trim();

  const careersUrl =
    answers.careersUrl.trim();

    const ats =
        await detectATS(
            careersUrl
        );

  const token =
    extractToken(
      careersUrl,
      ats
    );

  console.log(
    "\n=========================="
  );

  console.log(
    "Company Details"
  );

  console.log(
    "=========================="
  );

  console.log(
    "Company:",
    companyName
  );

  console.log(
    "Careers URL:",
    careersUrl
  );

  console.log(
    "ATS:",
    ats
  );

  console.log(
    "Token:",
    token || "Not Detected"
  );

  if (ats === "unknown") {

    console.log(
      "\n⚠️ ATS could not be detected from URL."
    );

    console.log(
      "This company may use:"
    );

    console.log(
      "- Workday"
    );

    console.log(
      "- Custom Careers Portal"
    );

    console.log(
      "- Embedded ATS"
    );

    console.log(
      "- Redirected Job Platform"
    );

    console.log(
      "\nNext Step:"
    );

    console.log(
      "Inspect page source or network requests."
    );
  }

  console.log(
    "\n==========================\n"
  );

  return {
    companyName,
    careersUrl,
    ats,
    token
  };
}