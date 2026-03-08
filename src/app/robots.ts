import type { MetadataRoute } from 'next';
import { getNormalizedSiteUrl } from '@/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getNormalizedSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*'],
      },
    ],
    sitemap: siteUrl ? [`${siteUrl}/sitemap.xml`] : undefined,
    host: siteUrl,
  };
}
