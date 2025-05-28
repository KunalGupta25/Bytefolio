
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SectionWrapper from './section-wrapper';
import { ExternalLink, Feather } from 'lucide-react';

interface BlogCallToActionSectionProps {
  blogUrl?: string;
}

export default function BlogCallToActionSection({ blogUrl }: BlogCallToActionSectionProps) {
  if (!blogUrl) {
    return null; // Don't render the section if no blog URL is provided
  }

  return (
    <SectionWrapper 
      id="blog-cta" 
      title="My Thoughts & Insights" 
      subtitle="Explore my latest articles on coding tips, project deep dives, and my journey with new languages and frameworks."
      className="bg-secondary"
    >
      <div className="text-center max-w-2xl mx-auto">
        <Feather className="h-16 w-16 text-accent mx-auto mb-6" />
        <p className="text-lg text-foreground mb-8">
          I enjoy sharing what I learn. On my blog, you'll find practical tips and tricks, detailed write-ups about my projects, 
          and my experiences exploring new programming languages and frameworks. Dive in to discover more!
        </p>
        <Button asChild size="lg" className="shadow-lg hover:shadow-accent/50 transition-shadow">
          <Link href={blogUrl} target="_blank" rel="noopener noreferrer">
            Visit My Blog
            <ExternalLink className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </SectionWrapper>
  );
}
