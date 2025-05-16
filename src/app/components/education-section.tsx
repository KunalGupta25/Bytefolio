
import type { EducationItem } from '@/lib/data';
import SectionWrapper from './section-wrapper';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, GraduationCap } from 'lucide-react'; // Added GraduationCap as default icon
import * as LucideIcons from 'lucide-react';

interface EducationSectionProps {
  educationItems: EducationItem[];
}

export default function EducationSection({ educationItems }: EducationSectionProps) {
  
  const TimelineIcon = ({ iconName }: { iconName?: EducationItem['iconName'] }) => {
    if (iconName && typeof iconName === 'string' && (LucideIcons as Record<string, any>)[iconName]) {
      const ResolvedIcon = (LucideIcons as Record<string, React.ElementType>)[iconName];
      return ResolvedIcon ? <ResolvedIcon className="h-6 w-6 text-white" /> : <GraduationCap className="h-6 w-6 text-white" />;
    }
    return <GraduationCap className="h-6 w-6 text-white" />; // Default icon
  };

  return (
    <SectionWrapper id="education" title="Education" subtitle="My academic background and qualifications.">
      {educationItems.length === 0 ? (
        <p className="text-center text-muted-foreground">No education details to display yet.</p>
      ) : (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative wrap overflow-hidden p-10 h-full">
            {/* Vertical Line for md+ screens */}
            <div 
              className="absolute border-opacity-20 border-primary/50 h-full border" 
              style={{left: '50%'}}
            ></div>
            {/* Vertical Line for mobile (left aligned) */}
            <div 
              className="absolute border-opacity-20 border-primary/50 h-full border md:hidden" 
              style={{left: '20px'}}
            ></div>

            {educationItems.map((edu, index) => (
              <div 
                key={edu.id} 
                className={`mb-8 flex justify-between items-center w-full ${
                  index % 2 === 0 ? 'md:flex-row-reverse left-timeline' : 'right-timeline'
                } md:flex-row`}
              >
                <div className="order-1 md:w-5/12"></div> {/* Spacer for alternating layout */}
                
                {/* Dot and Icon */}
                <div className={`z-20 flex items-center order-1 bg-accent shadow-xl w-12 h-12 rounded-full absolute left-[calc(50%-1.5rem)] md:static transform md:-translate-x-0 ${index % 2 === 0 ? 'md:translate-x-0' : 'md:-translate-x-0'} ml-[calc(20px-1.5rem)] md:ml-0`}>
                  <div className="mx-auto">
                    <TimelineIcon iconName={edu.iconName} />
                  </div>
                </div>

                {/* Content Card */}
                <div className={`order-1 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'} w-full md:w-5/12 px-4 py-4 ml-[60px] md:ml-0`}>
                   <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden bg-card/90 backdrop-blur-sm w-full">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl font-semibold text-primary">{edu.degree}</CardTitle>
                      <CardDescription className="text-md font-medium text-accent">{edu.institution}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {edu.description && (
                        <p className="text-foreground leading-relaxed mb-3">{edu.description}</p>
                      )}
                    </CardContent>
                    <CardFooter className="bg-muted/50 py-3 px-6">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4 mr-2" />
                        <span>{edu.period}</span>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}

    