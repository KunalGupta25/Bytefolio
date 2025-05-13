
import { Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import { siteSettingsData, contactDetails } from '@/lib/data'; // Import site settings and contact details

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const siteName = siteSettingsData.siteName;
  const userName = siteSettingsData.defaultUserName;

  return (
    <footer className="bg-secondary text-secondary-foreground py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <Link href={contactDetails.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
            <Github className="h-6 w-6 hover:text-accent transition-colors" />
          </Link>
          <Link href={contactDetails.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
            <Linkedin className="h-6 w-6 hover:text-accent transition-colors" />
          </Link>
          <Link href={`mailto:${contactDetails.email}`} aria-label="Send Email">
            <Mail className="h-6 w-6 hover:text-accent transition-colors" />
          </Link>
        </div>
        <p className="text-sm">
          &copy; {currentYear} {siteName}. Designed & Built by {userName}.
        </p>
        <p className="text-xs mt-2">
          <Link href="/admin" className="hover:text-accent transition-colors">Admin Panel</Link>
        </p>
      </div>
    </footer>
  );
}
