export function extractToken(
  careersUrl: string,
  ats: string
): string {

  const cleanUrl =
    careersUrl
      .trim()
      .replace(/\/$/, "");

  const parts =
    cleanUrl.split("/");

  switch (ats) {

    case "greenhouse":
      return parts[parts.length - 1];

    case "lever":
      return parts[parts.length - 1];

    case "ashby":
      return parts[parts.length - 1];

    default:
      return "";
  }
}