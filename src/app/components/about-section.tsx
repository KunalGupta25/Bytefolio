
import Image from 'next/image';
import type { AboutData } from '@/lib/data'; // Import type
import SectionWrapper from './section-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Heart } from 'lucide-react';

interface AboutSectionProps {
  aboutData: AboutData;
  userName: string; // For alt text
}

export default function AboutSection({ aboutData, userName }: AboutSectionProps) {
  return (
    <SectionWrapper id="about" title="About Me" subtitle="A little bit about my journey and passion for technology.">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
        {/* Left: Profile Image - Centered with cards */}
        <div className="lg:col-span-2 flex justify-center lg:justify-end items-center">
          <div className="relative w-64 h-64 md:w-72 md:h-72 flex-shrink-0">
            {/* Gradient Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5 rounded-full blur-3xl -z-10"></div>
            
            {/* Profile Image Container */}
            <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-accent group">
              <Image
                src={aboutData.profileImageUrl || "https://placehold.co/300x300.png"}
                alt={`Profile Picture of ${userName}`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 256px, 288px"
                priority
                data-ai-hint={aboutData.dataAiHint || "profile picture"}
                className="group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Right: Two Cards Stacked */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Professional Summary Card */}
          <Card className="flex-1 shadow-xl hover:shadow-2xl transition-all duration-300 border border-accent/20 hover:border-accent/50 bg-background/80 backdrop-blur-sm overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                  <Briefcase className="h-5 w-5 text-accent" />
                </div>
                <CardTitle className="text-2xl">Professional Summary</CardTitle>
              </div>
              <div className="h-1 w-12 bg-gradient-to-r from-accent to-accent/50 rounded-full mt-2"></div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-base text-foreground/90 leading-relaxed">
                {aboutData.professionalSummary}
              </p>
            </CardContent>
          </Card>

          {/* Bio Card */}
          <Card className="flex-1 shadow-xl hover:shadow-2xl transition-all duration-300 border border-accent/20 hover:border-accent/50 bg-background/80 backdrop-blur-sm overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                  <Heart className="h-5 w-5 text-accent" />
                </div>
                <CardTitle className="text-2xl">Passion & Interests</CardTitle>
              </div>
              <div className="h-1 w-12 bg-gradient-to-r from-accent to-accent/50 rounded-full mt-2"></div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-base text-foreground/90 leading-relaxed">
                {aboutData.bio}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SectionWrapper>
  );
}
