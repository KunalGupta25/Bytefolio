
import { Button } from '@/components/ui/button';
import { ArrowDown, Download } from 'lucide-react';
import Link from 'next/link';
// import ThreeScenePlaceholder from './three-scene-placeholder'; // Placeholder for 3D object
// No longer importing siteSettingsData, will receive props

interface HeroSectionProps {
  userName: string;
  userSpecialization: string;
}

export default function HeroSection({ userName, userSpecialization }: HeroSectionProps) {
  return (
    <section id="hero" className="relative bg-gradient-to-br from-background via-secondary to-background text-foreground min-h-[calc(100vh-4rem)] flex items-center justify-center py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
          <span className="block">Hello, I&apos;m </span>
          <span className="block text-accent">{userName}</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10">
          A passionate Computer Science student specializing in {userSpecialization}. I build innovative and efficient digital solutions.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button asChild size="lg" className="shadow-lg hover:shadow-accent/50 transition-shadow">
            <Link href="#contact">
              Get in Touch
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="shadow-lg hover:shadow-md transition-shadow">
            {/* Link to your resume PDF in public folder */}
            <a href="/resume.pdf" download={`${userName.replace(/\s+/g, '_')}_Resume.pdf`}> 
              <Download className="mr-2 h-5 w-5" />
              Download CV
            </a>
          </Button>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
         <Link href="#about" aria-label="Scroll to about section">
            <ArrowDown className="h-8 w-8 text-muted-foreground animate-bounce" />
         </Link>
      </div>
      {/* Optional: Add a subtle background pattern or visual element */}
      {/* <div className="absolute inset-0 opacity-5 dark:opacity-[0.03]">
        <ThreeScenePlaceholder />
      </div> */}
    </section>
  );
}
