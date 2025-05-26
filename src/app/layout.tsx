
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/app/components/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import { getSiteSettings } from '@/lib/data'; // Import data fetching function

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const codeSignFaviconDataUriCyan = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="90" font-family="monospace" fill="%2300FFFF">&lt;/&gt;</text></svg>';

// Generate dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  console.log('[generateMetadata] Fetching site settings...');
  const siteSettings = await getSiteSettings();
  console.log('[generateMetadata] Site settings fetched:', siteSettings);

  let resolvedFaviconUrl = siteSettings.faviconUrl || codeSignFaviconDataUriCyan; 
  if (typeof resolvedFaviconUrl === 'string' && resolvedFaviconUrl.trim() === '') {
    resolvedFaviconUrl = codeSignFaviconDataUriCyan; 
  }
  
  console.log(`[generateMetadata] Resolved faviconUrl to be used: ${resolvedFaviconUrl.startsWith('data:image/svg+xml') ? 'SVG Data URI (Cyan Code Sign)' : resolvedFaviconUrl}`);

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
      </body>
    </html>
  );
}
    