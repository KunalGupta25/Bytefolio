export function getNormalizedSiteUrl(): string | undefined {
  const rawSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL;

  if (!rawSiteUrl) {
    return undefined;
  }

  const withProtocol = rawSiteUrl.startsWith('http')
    ? rawSiteUrl
    : `https://${rawSiteUrl}`;

  try {
    const parsed = new URL(withProtocol);
    return parsed.toString().replace(/\/$/, '');
  } catch {
    return undefined;
  }
}
