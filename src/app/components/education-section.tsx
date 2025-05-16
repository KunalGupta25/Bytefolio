
"use client";

import type { EducationItem } from '@/lib/data';
import SectionWrapper from './section-wrapper';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, GraduationCap } from 'lucide-react'; 
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

  const mobileTimelineOffset = '30px'; 
  const iconWidthRem = 3; 
  const iconRadiusRem = iconWidthRem / 2;
  const gapAfterIconRem = 1; 
  const cardMarginLeftMobile = `calc(${mobileTimelineOffset} + ${iconRadiusRem}rem + ${gapAfterIconRem}rem)`; 

  return (
    <SectionWrapper id="education" title="Education" subtitle="My academic background and qualifications.">
      {educationItems.length === 0 ? (
        <p className="text-center text-muted-foreground">No education details to display yet.</p>
      ) : (
        <div className="container mx-auto px-0 sm:px-6 lg:px-8">
          <div className="relative wrap overflow-hidden py-10 px-4 md:px-10 h-full">
            <div 
              className="absolute border-opacity-20 border-primary/50 h-full border hidden md:block" 
              style={{left: '50%'}}
            ></div>
            <div 
              className="absolute border-opacity-20 border-primary/50 h-full border md:hidden" 
              style={{left: mobileTimelineOffset }} 
            ></div>

            {educationItems.map((edu, index) => (
              <div 
                key={edu.id} 
                className={`mb-8 flex items-start w-full relative ${
                  index % 2 === 0 ? 'md:flex-row-reverse md:justify-between' : 'md:flex-row md:justify-between'
                } md:items-center`}
              >
                <div className="hidden md:block md:order-1 md:w-5/12"></div> 
                
                <div className={`z-20 flex items-center justify-center order-1 bg-accent shadow-xl w-12 h-12 rounded-full absolute 
                                left-[${mobileTimelineOffset}] transform -translate-x-1/2 
                                md:relative md:left-auto md:transform-none md:mx-4 
                                ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                  <div className="mx-auto">
                    <TimelineIcon iconName={edu.iconName} />
                  </div>
                </div>

                <div className={`order-1 ${index % 2 === 0 ? 'md:order-1 md:text-right md:pr-8' : 'md:order-2 md:text-left md:pl-8'} 
                                 flex-1 px-2 sm:px-0 py-4 
                                 md:w-5/12 md:flex-none md:px-4`}
                     style={{ marginLeft: `var(--card-margin-left-mobile, ${cardMarginLeftMobile})` }}
                >
                  <style jsx>{`
                    @media (min-width: 768px) { /* md breakpoint */
                      .timeline-card-${edu.id} {
                        margin-left: 0 !important;
                      }
                    }
                  `}</style>
                   <div className={`timeline-card-${edu.id}`}>
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
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}
    
