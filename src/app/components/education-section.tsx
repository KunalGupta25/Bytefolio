
import type { EducationItem } from '@/lib/data';
import SectionWrapper from './section-wrapper';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface EducationSectionProps {
  educationItems: EducationItem[];
}

export default function EducationSection({ educationItems }: EducationSectionProps) {
  const IconComponent = ({ iconName }: { iconName?: EducationItem['iconName'] }) => {
    if (!iconName || typeof iconName !== 'string' || !(iconName in LucideIcons)) return null;
    const ResolvedIcon = LucideIcons[iconName as keyof typeof LucideIcons] as React.ElementType;
    return ResolvedIcon ? <ResolvedIcon className="h-8 w-8 text-accent hidden sm:block" /> : null;
  };

  return (
    <SectionWrapper id="education" title="Education" subtitle="My academic background and qualifications.">
      <div className="space-y-8">
        {educationItems.map((edu) => (
            <Card key={edu.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <CardTitle className="text-xl font-semibold text-primary mb-1 sm:mb-0">{edu.degree}</CardTitle>
                  <IconComponent iconName={edu.iconName} />
                </div>
                <CardDescription className="text-md font-medium text-accent">{edu.institution}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {edu.description && (
                  <p className="text-foreground leading-relaxed mb-3">{edu.description}</p>
                )}
              </CardContent>
              <CardFooter className="bg-muted/30 py-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <span>{edu.period}</span>
                </div>
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </SectionWrapper>
  );
}
