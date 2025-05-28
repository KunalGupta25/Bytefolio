
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
      subtitle="Dive into my latest articles, tutorials, and reflections on technology, coding, and more."
      className="bg-secondary"
    >
      <div className="text-center max-w-2xl mx-auto">
        <Feather className="h-16 w-16 text-accent mx-auto mb-6" />
        <p className="text-lg text-foreground mb-8">
          I regularly share my experiences, learnings, and perspectives on various topics in the tech world. 
          Whether you're looking for deep dives into specific technologies, career advice, or just my latest musings, my blog is the place to be.
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
