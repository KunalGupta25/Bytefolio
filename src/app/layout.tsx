
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

// Generate dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const faviconUrl = siteSettings.faviconUrl || '/favicon.ico'; // Fallback to default

  return {
    title: `${siteSettings.siteName || 'ByteFolio'} | CS Student Portfolio`,
    description: 'A modern portfolio for a Computer Science student, showcasing skills, projects, and experience.',
    icons: {
      icon: faviconUrl,
      // You can add other icon types here if needed, e.g., apple-touch-icon
      // apple: '/apple-icon.png', 
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
