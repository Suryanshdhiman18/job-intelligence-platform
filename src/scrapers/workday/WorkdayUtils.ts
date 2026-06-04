export function parseWorkdayUrl(
  url: string
) {

  const parsed =
    new URL(url);

  const hostParts =
    parsed.hostname.split(".");

  const tenant =
    hostParts[0];

  const server =
    hostParts[1];

  const pathParts =
    parsed.pathname
      .split("/")
      .filter(Boolean);

  const site =
    pathParts[pathParts.length - 1];

  return {
    tenant,
    server,
    site
  };
}