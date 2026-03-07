
import { Button } from '@/components/ui/button';
import { ArrowDown, Download } from 'lucide-react';
import Link from 'next/link';

interface HeroSectionProps {
  userName: string;
  userSpecialization: string;
  heroTagline: string;
  resumeUrl: string;
}

export default function HeroSection({ userName, userSpecialization, heroTagline, resumeUrl }: HeroSectionProps) {
  const downloadName = userName ? `${userName.replace(/\s+/g, '_')}_Resume.pdf` : 'Resume.pdf';
  return (
    <section id="hero" className="relative bg-gradient-to-br from-background via-secondary/30 to-background text-foreground min-h-screen flex items-center justify-center py-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 max-w-4xl">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight">
              <span className="block text-muted-foreground">Hello, I&apos;m</span>
              <span className="block text-accent bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
                {userName}
              </span>
            </h1>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              {userSpecialization}
            </div>
          </div>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed">
            {heroTagline}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-8">
            <Button asChild size="lg" className="shadow-lg hover:shadow-accent/50 transition-all duration-300 hover:scale-105 px-8 py-4 text-lg">
              <Link href="#contact">
                Get in Touch
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="shadow-lg hover:shadow-md transition-all duration-300 hover:scale-105 px-8 py-4 text-lg">
              <a href={resumeUrl || "/resume.pdf"} download={downloadName}>
                <Download className="mr-2 h-5 w-5" />
                Download CV
              </a>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
         <Link href="#about" aria-label="Scroll to about section" className="p-2 rounded-full hover:bg-accent/10 transition-colors">
            <ArrowDown className="h-8 w-8 text-muted-foreground" />
         </Link>
      </div>
    </section>
  );
}
