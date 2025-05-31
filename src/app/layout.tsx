
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script'; // Import next/script
import './globals.css';
import { ThemeProvider } from '@/app/components/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import { getSiteSettings } from '@/lib/data'; 

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const CODE_SIGN_FAVICON_CYAN = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="90" font-family="monospace" fill="%2300FFFF">&lt;/&gt;</text></svg>';

export async function generateMetadata(): Promise<Metadata> {
  console.log('[generateMetadata] Fetching site settings...');
  const siteSettings = await getSiteSettings();
  console.log('[generateMetadata] Site settings fetched:', siteSettings);

  let resolvedFaviconUrl = siteSettings.faviconUrl || CODE_SIGN_FAVICON_CYAN; 
  if (typeof resolvedFaviconUrl !== 'string' || resolvedFaviconUrl.trim() === '') {
    resolvedFaviconUrl = CODE_SIGN_FAVICON_CYAN; 
  }
  
  console.log(`[generateMetadata] Resolved faviconUrl to be used: ${resolvedFaviconUrl.startsWith('data:image/svg+xml') ? 'SVG Data URI' : resolvedFaviconUrl}`);

  const pageTitle = `${siteSettings.siteName || 'ByteFolio'} | ${siteSettings.siteTitleSuffix || 'Portfolio'}`;
  const pageDescription = siteSettings.siteDescription || 'A modern portfolio showcasing skills, projects, and experience.';

  console.log(`[generateMetadata] Page Title: ${pageTitle}`);
  console.log(`[generateMetadata] Page Description: ${pageDescription}`);

  return {
    title: pageTitle,
    description: pageDescription,
    icons: {
      icon: resolvedFaviconUrl,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {gaMeasurementId && (
          <>
            {/* Google Analytics - Gtag.js */}
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
            {/* End Google Analytics */}
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
    
