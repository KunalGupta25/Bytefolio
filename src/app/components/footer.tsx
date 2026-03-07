
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
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-primary mb-2">{siteName}</h3>
            <p className="text-sm text-muted-foreground">
              Showcasing creativity and technical expertise
            </p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6">
            <Link href={contactDetails.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
              <Github className="h-6 w-6 text-muted-foreground hover:text-accent transition-colors hover:scale-110 transform duration-200" />
            </Link>
            <Link href={contactDetails.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
              <Linkedin className="h-6 w-6 text-muted-foreground hover:text-accent transition-colors hover:scale-110 transform duration-200" />
            </Link>
            <Link href={`mailto:${contactDetails.email}`} aria-label="Send Email">
              <Mail className="h-6 w-6 text-muted-foreground hover:text-accent transition-colors hover:scale-110 transform duration-200" />
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} {siteName}. <br className="sm:hidden" />
              <span className="text-accent font-medium">Built by {userName}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
