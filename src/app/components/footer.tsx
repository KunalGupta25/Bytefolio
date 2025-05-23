
import { Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import type { ContactDetails } from '@/lib/data'; // Import type

interface FooterProps {
  siteName: string;
  userName: string;
  contactDetails: ContactDetails;
}

export default function Footer({ siteName, userName, contactDetails }: FooterProps) {
  const currentYear = new Date().getFullYear();

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
        {/* Admin Panel link removed */}
      </div>
    </footer>
  );
}
