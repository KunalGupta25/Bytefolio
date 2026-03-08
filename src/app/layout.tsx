
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from '@/app/components/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import { getSiteSettings } from '@/lib/data'; 
import { getNormalizedSiteUrl } from '@/lib/site-url';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const CODE_SIGN_FAVICON_CYAN = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="90" font-family="monospace" fill="%2300FFFF">&lt;/&gt;</text></svg>';

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();

  let resolvedFaviconUrl = siteSettings.faviconUrl || CODE_SIGN_FAVICON_CYAN; 
  if (typeof resolvedFaviconUrl !== 'string' || resolvedFaviconUrl.trim() === '') {
    resolvedFaviconUrl = CODE_SIGN_FAVICON_CYAN; 
  }
  
  const pageTitle = `${siteSettings.siteName || 'ByteFolio'} | ${siteSettings.siteTitleSuffix || 'Portfolio'}`;
  const pageDescription = siteSettings.siteDescription || 'A modern portfolio showcasing skills, projects, and experience.';
  
  const siteUrl = getNormalizedSiteUrl();
  const ogImageRelativePath = '/og-image.png';

  let finalOgImageForOpenGraph: string;
  let finalOgImageForTwitter: string;

  if (siteUrl && siteUrl.startsWith('http')) {
    const baseUrl = new URL(siteUrl);
    finalOgImageForOpenGraph = new URL(ogImageRelativePath, baseUrl).toString();
    finalOgImageForTwitter = finalOgImageForOpenGraph;
  } else {
    finalOgImageForOpenGraph = ogImageRelativePath;
    finalOgImageForTwitter = ogImageRelativePath;
  }

  return {
    title: pageTitle,
    description: pageDescription,
    icons: {
      icon: resolvedFaviconUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: siteUrl && siteUrl.startsWith('http') ? siteUrl : undefined, 
      siteName: siteSettings.siteName,
      images: [
        {
          url: finalOgImageForOpenGraph,
          width: 1200,
          height: 675,
          alt: `${siteSettings.siteName} - ${siteSettings.siteTitleSuffix}`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [finalOgImageForTwitter],
    },
    alternates: siteUrl ? { canonical: '/' } : undefined,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const siteUrl = getNormalizedSiteUrl();

  const sameAsProfiles = [
    siteSettings.contactDetails.linkedin,
    siteSettings.contactDetails.github,
    siteSettings.contactDetails.twitter,
  ].filter((value): value is string => Boolean(value));

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteSettings.siteName,
    description: siteSettings.siteDescription,
    ...(siteUrl ? { url: siteUrl } : {}),
  };

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteSettings.defaultUserName,
    jobTitle: siteSettings.defaultUserSpecialization,
    ...(siteUrl ? { url: siteUrl } : {}),
    ...(sameAsProfiles.length ? { sameAs: sameAsProfiles } : {}),
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {gaMeasurementId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaMeasurementId}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        {siteSettings.customHtmlWidget && (
          <div 
            className="bg-transparent"
            dangerouslySetInnerHTML={{ __html: siteSettings.customHtmlWidget }} 
          />
        )}
      </body>
    </html>
  );
}
