import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  hasParallax?: boolean;
  parallaxImageUrl?: string;
}

export default function SectionWrapper({
  id,
  children,
  className,
  title,
  subtitle,
  hasParallax = false,
  parallaxImageUrl = 'https://picsum.photos/1920/1080'
}: SectionWrapperProps) {
  
  const sectionStyle = hasParallax ? {
    backgroundImage: `url(${parallaxImageUrl})`,
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  } : {};

  return (
    <section
      id={id}
      className={cn(
        "py-16 md:py-24 relative", 
        hasParallax ? "text-primary-foreground" : "",
        className
      )}
      style={sectionStyle}
      aria-labelledby={`${id}-heading`}
    >
      {hasParallax && <div className="absolute inset-0 bg-black/50 z-0"></div>}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {title && (
          <div className="text-center mb-12">
            <h2 id={`${id}-heading`} className={cn("text-3xl md:text-4xl font-bold tracking-tight", hasParallax ? "text-white" : "text-primary")}>
              {title}
            </h2>
            {subtitle && (
              <p className={cn("mt-4 text-lg", hasParallax ? "text-gray-300" : "text-muted-foreground")}>
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
