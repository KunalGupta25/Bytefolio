import type { MetadataRoute } from 'next';
import { getNormalizedSiteUrl } from '@/lib/site-url';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getNormalizedSiteUrl();

  if (!siteUrl) {
    return [];
  }

  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
