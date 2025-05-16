
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

const codeSignFaviconDataUri = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="90" font-family="monospace" fill="%2324292F">&lt;/&gt;</text></svg>';

// Generate dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  console.log('[generateMetadata] Fetching site settings...');
  const siteSettings = await getSiteSettings();
  console.log('[generateMetadata] Site settings fetched:', siteSettings);

  let resolvedFaviconUrl = siteSettings.faviconUrl || codeSignFaviconDataUri; 
  if (typeof resolvedFaviconUrl === 'string' && resolvedFaviconUrl.trim() === '') {
    resolvedFaviconUrl = codeSignFaviconDataUri; // Fallback for empty string
  }
  
  console.log(`[generateMetadata] Resolved faviconUrl to be used: ${resolvedFaviconUrl.startsWith('data:image/svg+xml') ? 'SVG Data URI' : resolvedFaviconUrl}`);

  return {
    title: `${siteSettings.siteName || 'ByteFolio'} | CS Student Portfolio`,
    description: 'A modern portfolio for a Computer Science student, showcasing skills, projects, and experience.',
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
