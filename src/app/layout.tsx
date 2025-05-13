import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Changed to Inter for body, Geist can be for headings
import './globals.css';
import { ThemeProvider } from '@/app/components/theme-provider';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'ByteFolio | CS Student Portfolio',
  description: 'A modern portfolio for a Computer Science student, showcasing skills, projects, and experience.',
};

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
