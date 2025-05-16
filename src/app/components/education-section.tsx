
"use client";

import type { EducationItem } from '@/lib/data';
import SectionWrapper from './section-wrapper';
import { GraduationCap } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import "react-vertical-timeline-component/style.min.css";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";

interface EducationSectionProps {
  educationItems: EducationItem[];
}

export default function EducationSection({ educationItems }: EducationSectionProps) {

  const TimelineIcon = ({ iconName }: { iconName?: EducationItem['iconName'] }) => {
    if (iconName && typeof iconName === 'string' && (LucideIcons as Record<string, any>)[iconName]) {
      const ResolvedIcon = (LucideIcons as Record<string, React.ElementType>)[iconName];
      return ResolvedIcon ? <ResolvedIcon /> : <GraduationCap />;
    }
    return <GraduationCap />;
  };

  return (
    <SectionWrapper id="education" title="Education" subtitle="My academic background and qualifications.">
      {educationItems.length === 0 ? (
        <p className="text-center text-muted-foreground">No education details to display yet.</p>
      ) : (
        <VerticalTimeline lineColor="hsl(var(--border))">
          {educationItems.map((edu) => (
            <VerticalTimelineElement
              key={edu.id}
              className="vertical-timeline-element--education"
              contentStyle={{
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                boxShadow: '0 3px 0 hsl(var(--accent))', // Using accent for bottom border like in example
                borderRadius: 'var(--radius)',
              }}
              contentArrowStyle={{ borderRight: '7px solid hsl(var(--card))' }}
              date={edu.period}
              iconStyle={{
                background: 'hsl(var(--accent))',
                color: 'hsl(var(--accent-foreground))',
                boxShadow: '0 0 0 4px hsl(var(--border)), inset 0 2px 0 rgba(0,0,0,.08), 0 3px 0 4px rgba(0,0,0,.05)'
              }}
              icon={<TimelineIcon iconName={edu.iconName} />}
            >
              <h3 className="vertical-timeline-element-title text-xl font-semibold text-primary">
                {edu.degree}
              </h3>
              <h4 className="vertical-timeline-element-subtitle text-md font-medium text-accent">
                {edu.institution}
              </h4>
              {edu.description && (
                <p className="!mt-2 !font-normal text-foreground/80">
                  {edu.description}
                </p>
              )}
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      )}
    </SectionWrapper>
  );
}
