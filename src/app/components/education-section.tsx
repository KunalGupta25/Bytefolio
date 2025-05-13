import { educationData } from '@/lib/data';
import SectionWrapper from './section-wrapper';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';

export default function EducationSection() {
  return (
    <SectionWrapper id="education" title="Education" subtitle="My academic background and qualifications.">
      <div className="space-y-8">
        {educationData.map((edu, index) => (
          <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <CardHeader className="bg-muted/30">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <CardTitle className="text-xl font-semibold text-primary mb-1 sm:mb-0">{edu.degree}</CardTitle>
                {edu.icon && <edu.icon className="h-8 w-8 text-accent hidden sm:block" />}
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
        ))}
      </div>
    </SectionWrapper>
  );
}
