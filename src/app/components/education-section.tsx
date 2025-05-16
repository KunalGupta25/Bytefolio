
"use client";

import type { EducationItem } from '@/lib/data';
import SectionWrapper from './section-wrapper';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, GraduationCap } from 'lucide-react'; 
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const mobileTimelineOffset = '30px'; // The distance from the left of the padded container to the timeline bar
  const iconWidthRem = 3; // Corresponds to w-12
  const iconRadiusRem = iconWidthRem / 2;
  const gapAfterIconRem = 1; // Gap between icon's right edge and card's left edge
  
  // Calculate the margin needed for the card to clear the icon area on mobile
  // Card starts after: timeline offset + icon radius + desired gap
  const cardMarginLeftMobile = `calc(${mobileTimelineOffset} + ${iconRadiusRem}rem + ${gapAfterIconRem}rem)`;
  // Example: calc(30px + 1.5rem + 1rem) = calc(30px + 24px + 16px) = calc(70px)

  return (
    <SectionWrapper id="education" title="Education" subtitle="My academic background and qualifications.">
      {educationItems.length === 0 ? (
        <p className="text-center text-muted-foreground">No education details to display yet.</p>
      ) : (
        <div className="container mx-auto px-0 sm:px-6 lg:px-8">
          {/* Increased padding on mobile (px-6), keeps md:px-10 for larger */}
          <div className="relative wrap overflow-hidden py-10 px-6 md:px-10 h-full">
            {/* Desktop timeline bar */}
            <div 
              className="absolute border-opacity-20 border-primary/50 h-full border hidden md:block" 
              style={{left: '50%'}}
            ></div>
            {/* Mobile timeline bar */}
            <div 
              className="absolute border-opacity-20 border-primary/50 h-full border md:hidden" 
              style={{left: mobileTimelineOffset }} // Positioned relative to the padded .wrap container
            ></div>

            {educationItems.map((edu, index) => (
              <div 
                key={edu.id} 
                className={cn(
                  "mb-8 w-full relative", // Common classes
                  "md:flex md:items-center", // Desktop flex layout
                  index % 2 === 0 ? 'md:flex-row-reverse md:justify-between' : 'md:flex-row md:justify-between' // Desktop alternating
                  // Mobile will be handled by internal structure for simplicity now
                )}
              >
                {/* Desktop Spacer (order-1 by default for non-reversed items) */}
                <div className="hidden md:block md:w-5/12 md:order-1"></div> 
                
                {/* Icon Wrapper */}
                <div
                  className={cn(
                    "z-20 flex items-center justify-center bg-accent shadow-xl w-12 h-12 rounded-full", // Common icon styles
                    // Mobile absolute positioning: centered on the mobileTimelineOffset line
                    "absolute left-0 transform -translate-x-1/2", // Default to relative to parent, then use style for precise left
                    // Desktop relative positioning
                    "md:relative md:left-auto md:transform-none md:mx-4",
                    index % 2 === 0 ? "md:order-2" : "md:order-1" // Icon order for desktop
                  )}
                  style={{
                    // On mobile, 'left' is the mobileTimelineOffset from the edge of the parent flex item.
                    // Since the parent flex item starts at the edge of the padded 'wrap' container,
                    // this positions the icon's center correctly relative to the timeline bar.
                    left: mobileTimelineOffset, 
                    // transform: 'translateX(-50%)' is handled by Tailwind above for non-md
                  }}
                >
                  <TimelineIcon iconName={edu.iconName} />
                </div>

                {/* Card Wrapper */}
                <div 
                  className={cn(
                    "flex-1 min-w-0", // Added min-w-0 for flex stability
                    "py-4", // Vertical padding
                    "md:w-5/12 md:order-2 md:px-4", // Desktop width, order, padding
                    index % 2 === 0 ? 'md:order-1 md:text-right md:pr-8' : 'md:order-2 md:text-left md:pl-8' // Desktop specific order and text alignment
                  )}
                  style={{ 
                    // marginLeft for mobile to clear the icon
                    // On desktop, this will be overridden by style jsx if needed, or by md:px-4
                    marginLeft: cardMarginLeftMobile
                  }}
                >
                  {/* This inner div is for the style jsx to specifically target and reset margin on desktop if needed */}
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
                  {/* style jsx to reset mobile margin on desktop */}
                  <style jsx>{`
                    @media (min-width: 768px) { /* md breakpoint */
                      .timeline-card-${edu.id} {
                        margin-left: 0 !important; /* Reset for desktop if the parent div's style was persisting */
                      }
                      /* Ensure the parent div also doesn't have the mobile margin */
                      div[style*="margin-left: ${cardMarginLeftMobile}"] {
                         margin-left: 0 !important;
                      }
                    }
                  `}</style>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}
    
