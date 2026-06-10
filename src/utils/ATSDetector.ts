import axios from "axios";
import { chromium } from "playwright";

export async function detectATS(
  careersUrl: string
): Promise<string> {

  const url =
    careersUrl.toLowerCase();

  // Fast URL checks

  if (url.includes("greenhouse")) {
    return "greenhouse";
  }

  if (url.includes("lever")) {
    return "lever";
  }

  if (url.includes("ashby")) {
    return "ashby";
  }

  if (url.includes("workday")) {
    return "workday";
  }

  if (url.includes("smartrecruiters")) {
    return "smartrecruiters";
  }

  // Axios HTML inspection

  try {

    console.log(
      "\nInspecting page HTML..."
    );

    const response =
      await axios.get(
        careersUrl,
        {
          timeout: 15000
        }
      );

    const html =
      response.data.toLowerCase();

    const ats =
      detectATSFromContent(
        html
      );

    if (
      ats !== "unknown"
    ) {
      return ats;
    }

  } catch {
    console.log(
      "Axios inspection failed."
    );
  }

  // Playwright inspection

  try {

    console.log(
      "\nLaunching Playwright..."
    );

    const browser =
      await chromium.launch({
        headless: true
      });

    const page =
      await browser.newPage();

    await page.goto(
      careersUrl,
      {
        waitUntil:
          "networkidle"
      }
    );

    const content =
      (
        await page.content()
      ).toLowerCase();

    await browser.close();

    return detectATSFromContent(
      content
    );

  } catch (error: any) {

    console.log(
      "Playwright inspection failed:"
    );

    console.log(
      error.message
    );

    return "unknown";
  }
}

function detectATSFromContent(
  content: string
): string {

  if (
    content.includes(
      "greenhouse"
    )
  ) {
    return "greenhouse";
  }

  if (
    content.includes(
      "lever"
    )
  ) {
    return "lever";
  }

  if (
    content.includes(
      "ashby"
    )
  ) {
    return "ashby";
  }

  if (
    content.includes(
      "workday"
    )
  ) {
    return "workday";
  }

  if (
    content.includes(
      "smartrecruiters"
    )
  ) {
    return "smartrecruiters";
  }

  return "unknown";
}