
import type { Certification } from '@/lib/data';
import SectionWrapper from './section-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ExternalLink, CalendarDays } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface CertificationsSectionProps {
  certifications: Certification[];
}

export default function CertificationsSection({ certifications }: CertificationsSectionProps) {

  const IconComponent = ({ iconName }: { iconName?: Certification['iconName'] }) => {
    if (!iconName || typeof iconName !== 'string' || !(iconName in LucideIcons)) return null;
    const ResolvedIcon = LucideIcons[iconName as keyof typeof LucideIcons] as React.ElementType;
    return ResolvedIcon ? <ResolvedIcon className="h-7 w-7 text-accent" /> : null;
  };

  return (
    <SectionWrapper 
      id="certifications" 
      title="Certifications" 
      subtitle="My credentials and professional achievements."
      hasParallax 
      parallaxImageUrl="https://picsum.photos/seed/abstracttech/1920/1080" // New image URL
      data-ai-hint="abstract technology" // New AI hint
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert) => (
            <Card key={cert.id} className="bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg font-semibold text-card-foreground">{cert.name}</CardTitle>
                  <IconComponent iconName={cert.iconName} />
                </div>
                <CardDescription className="text-sm text-muted-foreground">{cert.organization}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center text-xs text-muted-foreground mb-3">
                  <CalendarDays className="h-3 w-3 mr-1.5" />
                  <span>Issued: {cert.date}</span>
                </div>
              </CardContent>
              {cert.verifyLink && cert.verifyLink !== '#' && (
                  <CardContent className="pt-0">
                  <Button asChild variant="link" size="sm" className="p-0 h-auto text-accent">
                      <Link href={cert.verifyLink} target="_blank" rel="noopener noreferrer">
                        Verify Credential <ExternalLink className="ml-1.5 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
              )}
            </Card>
          )
        )}
      </div>
    </SectionWrapper>
  );
}
